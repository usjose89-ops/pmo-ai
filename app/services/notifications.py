from datetime import date

class EmailService:
    @staticmethod
    def send_task_assignment(task_title: str, email: str, deadline: date, priority: str):
        """
        Sends a professional HTML email assignment.
        """
        subject = f"Asignación de Compromiso: {task_title}"
        body = f"""
        <html>
            <body>
                <h2 style="color: #2563eb;">Nuevo Compromiso Asignado</h2>
                <p>Estimado Colaborador,</p>
                <p>Se le ha asignado la siguiente tarea en la plataforma <strong>ConstructIA</strong>:</p>
                <ul>
                    <li><strong>Compromiso:</strong> {task_title}</li>
                    <li><strong>Fecha Límite:</strong> {deadline}</li>
                    <li><strong>Prioridad:</strong> <span style="color: {'red' if priority == 'HIGH' else 'orange' if priority == 'MEDIUM' else 'green'};">{priority}</span></li>
                </ul>
                <p>Favor gestionar su cumplimiento en la plataforma.</p>
                <hr>
                <p style="font-size: 12px; color: gray;">ConstructIA Bot - Notificaciones Automáticas</p>
            </body>
        </html>
        """
        print(f"\n[MOCK EMAIL SENT] To: {email} | Subject: {subject}")
        print("-" * 50)
        print(body)
        print("-" * 50)

    @staticmethod
    def send_delay_alert(manager_email: str, task_title: str, old_date: date, new_date: date, reason: str):
        """
        Sends an alert for authorized delay.
        """
        subject = f"ALERTA: Atraso Justificado en {task_title}"
        body = f"""
        <html>
            <body>
                <h2 style="color: #dc2626;">Aviso de Atraso</h2>
                <p>El responsable ha modificado la fecha de un compromiso crítico.</p>
                <ul>
                    <li><strong>Tarea:</strong> {task_title}</li>
                    <li><strong>Fecha Anterior:</strong> {old_date}</li>
                    <li><strong>Nueva Fecha:</strong> {new_date}</li>
                    <li><strong>Razón:</strong> {reason}</li>
                </ul>
                <p>Esta acción ha quedado registrada en el Log de Auditoría.</p>
            </body>
        </html>
        """
        print(f"\n[MOCK EMAIL SENT] To: {manager_email} | Subject: {subject}")
        print("-" * 50)
        print(body)
        print("-" * 50)
