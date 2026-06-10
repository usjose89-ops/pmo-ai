import os
import csv
import xml.etree.ElementTree as ET
from datetime import datetime
from typing import List, Dict, Any, Optional
from app.models import Task, APU, TaskStatus, TaskPriority

class PrimaveraP6Parser:
    """
    Motor nativo para integrar cronogramas exportados de Primavera P6 (.xml o .xer).
    Esta clase no utiliza librerías de terceros (salvo la librería estandar `csv` y `xml`), garanatizando
    100% de compatibilidad con licenciamiento cerrado localizable.
    """

    def __init__(self, db_session, project_id: int):
        self.db = db_session
        self.project_id = project_id

    def parse_file(self, file_path: str):
        """Detecta la extensión e invoca el procesador correcto."""
        ext = os.path.splitext(file_path)[1].lower()
        if ext == '.xer':
            return self._parse_xer(file_path)
        elif ext == '.xml':
            return self._parse_xml(file_path)
        else:
            raise ValueError("Formato de archivo no soportado. Debe ser .xer o .xml")

    def _parse_xml(self, file_path: str) -> Dict[str, Any]:
        """
        Lectura Estándar de Primavera P6 XML empleando ElementTree nativo.
        Los XML de P6 organizan Actividades bajo <Activity> y la estructura WBS bajo <WBS>.
        """
        tree = ET.parse(file_path)
        root = tree.getroot()
        
        # P6 usa Default Namespaces usualmente
        # Detectaremos namespace si existe para simplificar
        ns = ''
        if root.tag.startswith('{'):
            ns = root.tag.split('}')[0] + '}'

        # 1. Parsear WBS Nodes
        wbs_nodes = {}
        for wbs in root.findall(f'.//{ns}WBS'):
            wbs_id = wbs.findtext(f'{ns}ObjectId')
            wbs_name = wbs.findtext(f'{ns}Name')
            wbs_code = wbs.findtext(f'{ns}Code')
            wbs_parent_id = wbs.findtext(f'{ns}ParentObjectId')
            
            wbs_nodes[wbs_id] = {
                'id': wbs_id,
                'name': wbs_name,
                'code': wbs_code,
                'parent_id': wbs_parent_id
            }

        # 2. Parsear Actividades
        activities = []
        for act in root.findall(f'.//{ns}Activity'):
            act_id = act.findtext(f'{ns}Id')
            act_name = act.findtext(f'{ns}Name')
            wbs_id = act.findtext(f'{ns}WBSObjectId')
            
            # Start/End dates (P6 format usually: 2026-05-10T08:00:00)
            start_str = act.findtext(f'{ns}EarlyStartDate') or act.findtext(f'{ns}PlannedStartDate')
            end_str = act.findtext(f'{ns}EarlyFinishDate') or act.findtext(f'{ns}PlannedFinishDate')
            
            try:
                # Truncate time info for native 'Date' schema handling if necessary
                start_date = datetime.strptime(start_str[:10], '%Y-%m-%d').date() if start_str else datetime.today().date()
                end_date = datetime.strptime(end_str[:10], '%Y-%m-%d').date() if end_str else datetime.today().date()
            except Exception:
                start_date = datetime.today().date()
                end_date = datetime.today().date()

            activities.append({
                'p6_id': act_id,
                'name': act_name,
                'wbs_id': wbs_id,
                'start_date': start_date,
                'end_date': end_date
            })

        return self._sync_to_db(wbs_nodes, activities)

    def _parse_xer(self, file_path: str) -> Dict[str, Any]:
        """
        El formato de P6 XER es un archivo texto delimitado con separadores %T, %F, %R.
        Nativo, ultra veloz para pipelines pesados.
        """
        wbs_data = []
        activity_data = []

        current_table = None
        headers = []

        with open(file_path, 'r', encoding='windows-1252', errors='replace') as f:
            reader = csv.reader(f, delimiter='\t')
            for row in reader:
                if not row: continue

                token = row[0]
                if token == '%T':
                    current_table = row[1]
                elif token == '%F':
                    headers = row[1:]
                elif token == '%R':
                    record = dict(zip(headers, row[1:]))
                    if current_table == 'PROJWBS':
                        wbs_data.append(record)
                    elif current_table == 'TASK':
                        activity_data.append(record)

        # Re-estructurar a formato neutro
        wbs_nodes = { 
            w['wbs_id']: {'id': w['wbs_id'], 'name': w['wbs_name'], 'code': w['wbs_short_name'], 'parent_id': w.get('parent_wbs_id')} 
            for w in wbs_data if 'wbs_id' in w
        }

        activities = []
        for act in activity_data:
            if 'task_id' not in act: continue
            
            # Formato XER fecha: 2026-05-10 08:00
            start_str = act.get('target_start_date') or act.get('early_start_date')
            end_str = act.get('target_end_date') or act.get('early_end_date')

            try:
                start_date = datetime.strptime(start_str.split(' ')[0], '%Y-%m-%d').date() if start_str else datetime.today().date()
                end_date = datetime.strptime(end_str.split(' ')[0], '%Y-%m-%d').date() if end_str else datetime.today().date()
            except Exception:
                start_date = datetime.today().date()
                end_date = datetime.today().date()

            activities.append({
                'p6_id': act['task_code'], # Usually task_code is the human A1000 ID
                'name': act.get('task_name', 'Unnamed Task'),
                'wbs_id': act.get('wbs_id'),
                'start_date': start_date,
                'end_date': end_date
            })

        return self._sync_to_db(wbs_nodes, activities)


    def _sync_to_db(self, wbs_nodes: Dict[str, dict], activities: List[dict]) -> Dict[str, Any]:
        """
        Sincroniza los diccionarios limpios contra la base de datos aplicando la regla de Bloqueo EVM.
        """
        # Mapeo Temporal WBS_ID -> APU_ID local
        wbs_to_apu_map = {}

        # 1. Crear / Mapear Nodos WBS como Entidades APU de agrupamiento (Solo si no existen)
        for wbs_id, wbs in wbs_nodes.items():
            existing_apu = self.db.query(APU).filter(APU.project_id == self.project_id, APU.code == wbs['code']).first()
            if existing_apu:
                wbs_to_apu_map[wbs_id] = existing_apu.id
            else:
                new_apu = APU(
                    project_id=self.project_id,
                    code=wbs['code'],
                    name=wbs['name'][0:200],
                    unit="GLB" # Default para WBS
                )
                self.db.add(new_apu)
                self.db.flush() # Para obtener ID
                wbs_to_apu_map[wbs_id] = new_apu.id

        self.db.commit()

        # 2. Ingesta de Actividades con Firewall PMO de Earned Value
        tasks_created = 0
        tasks_updated = 0
        tasks_evm_protected = 0

        for act in activities:
            existing_task = self.db.query(Task).filter(
                Task.project_id == self.project_id, 
                Task.p6_activity_id == act['p6_id']
            ).first()

            # Resolver APU Foreign Key
            mapped_apu_id = wbs_to_apu_map.get(act.get('wbs_id'))

            if not existing_task:
                # CREATE NEW
                new_task = Task(
                    project_id=self.project_id,
                    p6_activity_id=act['p6_id'],
                    name=act['name'],
                    start_date=act['start_date'],
                    end_date=act['end_date'],
                    original_deadline=act['end_date'], # Set Baseline on creation
                    apu_id=mapped_apu_id,
                    status=TaskStatus.PENDING
                )
                self.db.add(new_task)
                tasks_created += 1

            else:
                # UPDATE EXISTING: REGLA DE BLOQUEO EVM
                # Si una tarea ya está fluyendo en Obras (IN_PROGRESS o DONE), P6 NO puede planchar ni su progreso ni su EVM.
                if existing_task.status in [TaskStatus.IN_PROGRESS, TaskStatus.DONE]:
                    # EVM PROTECTED: Solo cambiamos deadline (Baseline extension/reduction)
                    existing_task.original_deadline = act['end_date']
                    existing_task.name = act['name']
                    tasks_evm_protected += 1
                else:
                    # Tarea "Virgen" o "Pending": Se puede reemplazar libremente fechas
                    existing_task.start_date = act['start_date']
                    existing_task.end_date = act['end_date']
                    existing_task.original_deadline = act['end_date']
                    existing_task.name = act['name']
                    existing_task.apu_id = mapped_apu_id
                    tasks_updated += 1

        self.db.commit()

        return {
            "status": "success",
            "message": "Cronograma integrado correctamente con blindaje EVM.",
            "metrics": {
                "tasks_created": tasks_created,
                "tasks_updated": tasks_updated,
                "evm_protected_from_overwrite": tasks_evm_protected
            }
        }
