from typing import List, Optional, Any
from enum import Enum
import decimal
from datetime import date
from sqlalchemy import String, Integer, Float, ForeignKey, Boolean, Enum as SAEnum, JSON, Date, Numeric
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Currency(Enum):
    CLP = "CLP"
    USD = "USD"
    UF = "UF"

class Methodology(Enum):
    PREDICTIVE = "PREDICTIVE"
    AGILE = "AGILE"
    HYBRID = "HYBRID"

class ResourceType(Enum):
    LABOR = "LABOR"
    MATERIAL = "MATERIAL"
    EQUIPMENT = "EQUIPMENT"
    SUBCONTRACT = "SUBCONTRACT"

class TaskPriority(Enum):
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"

class TaskStatus(Enum):
    PENDING = "PENDING"
    IN_PROGRESS = "IN_PROGRESS"
    DONE = "DONE"
    DELAYED = "DELAYED"

class TaskCompletionStatus(Enum):
    ON_TIME = "ON_TIME"
    DELAYED_JUSTIFIED = "DELAYED_JUSTIFIED"
    DELAYED_UNJUSTIFIED = "DELAYED_UNJUSTIFIED"

class ChangeRequestStatus(Enum):
    DRAFT = "DRAFT"
    SUBMITTED = "SUBMITTED"
    CLIENT_APPROVED = "CLIENT_APPROVED"
    REJECTED = "REJECTED"

class SystemRole(Enum):
    CONTRACT_ADMIN = "CONTRACT_ADMIN"
    CIVIL_SUPT = "CIVIL_SUPT"
    ELEC_SUPT = "ELEC_SUPT"
    QA_INSPECTOR = "QA_INSPECTOR"
    CLIENT_ITO = "CLIENT_ITO"

class Discipline(Enum):
    GLOBAL = "GLOBAL"
    CIVIL = "CIVIL"
    ELECTRICAL = "ELECTRICAL"

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(100), unique=True)
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    role: Mapped[SystemRole] = mapped_column(SAEnum(SystemRole), default=SystemRole.CONTRACT_ADMIN)
    discipline: Mapped[Discipline] = mapped_column(SAEnum(Discipline), default=Discipline.GLOBAL)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)


class ClientProfile(Base):
    __tablename__ = "client_profiles"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    rules_config: Mapped[dict] = mapped_column(JSON)  # e.g., {"accreditation_days": 15}

    projects: Mapped[List["Project"]] = relationship(back_populates="client")

class Project(Base):
    __tablename__ = "projects"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(100))
    client_id: Mapped[int] = mapped_column(ForeignKey("client_profiles.id"))
    currency: Mapped[Currency] = mapped_column(SAEnum(Currency))
    methodology: Mapped[Methodology] = mapped_column(SAEnum(Methodology))

    client: Mapped["ClientProfile"] = relationship(back_populates="projects")
    apus: Mapped[List["APU"]] = relationship(back_populates="project")

class APU(Base):
    __tablename__ = "apus"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    code: Mapped[str] = mapped_column(String(50))
    name: Mapped[str] = mapped_column(String(200))
    unit: Mapped[str] = mapped_column(String(20))
    
    # Recursive structure
    parent_id: Mapped[Optional[int]] = mapped_column(ForeignKey("apus.id"))
    
    # Relationships
    project: Mapped["Project"] = relationship(back_populates="apus")
    children: Mapped[List["APU"]] = relationship(back_populates="parent", cascade="all, delete-orphan")
    parent: Mapped[Optional["APU"]] = relationship(back_populates="children", remote_side=[id])
    
    resources_association: Mapped[List["APUResourceAssociation"]] = relationship(back_populates="apu")

class Resource(Base):
    __tablename__ = "resources"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    unit: Mapped[str] = mapped_column(String(20))
    base_price: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 4))
    currency: Mapped[Currency] = mapped_column(SAEnum(Currency))
    resource_type: Mapped[ResourceType] = mapped_column(SAEnum(ResourceType))

    apu_associations: Mapped[List["APUResourceAssociation"]] = relationship(back_populates="resource")

class APUResourceAssociation(Base):
    __tablename__ = "apu_resource_associations"

    apu_id: Mapped[int] = mapped_column(ForeignKey("apus.id"), primary_key=True)
    resource_id: Mapped[int] = mapped_column(ForeignKey("resources.id"), primary_key=True)
    quantity: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 4))

    apu: Mapped["APU"] = relationship(back_populates="resources_association")
    resource: Mapped["Resource"] = relationship(back_populates="apu_associations")

class Employee(Base):
    __tablename__ = "employees"

    id: Mapped[int] = mapped_column(primary_key=True)
    rut: Mapped[str] = mapped_column(String(20), unique=True)
    name: Mapped[str] = mapped_column(String(100))
    base_salary_liquid: Mapped[int] = mapped_column(Integer) # Sueldo Líquido in CLP
    role: Mapped[str] = mapped_column(String(100))

class Task(Base):
    __tablename__ = "tasks"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    p6_activity_id: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    project_id: Mapped[Optional[int]] = mapped_column(ForeignKey("projects.id"), nullable=True)
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)
    original_deadline: Mapped[Optional[date]] = mapped_column(Date)
    
    priority: Mapped[TaskPriority] = mapped_column(SAEnum(TaskPriority), default=TaskPriority.MEDIUM)
    assigned_email: Mapped[Optional[str]] = mapped_column(String(100))
    status: Mapped[TaskStatus] = mapped_column(SAEnum(TaskStatus), default=TaskStatus.PENDING)
    completion_status: Mapped[Optional[TaskCompletionStatus]] = mapped_column(SAEnum(TaskCompletionStatus))

    dependencies: Mapped[Optional[dict]] = mapped_column(JSON) # List of task IDs
    discipline: Mapped[Optional[Discipline]] = mapped_column(SAEnum(Discipline), nullable=True)
    
    # Resource / Auditing
    apu_id: Mapped[Optional[int]] = mapped_column(ForeignKey("apus.id"))
    quantity: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 4), default=1)

    # EVM Fields
    planned_value: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2), default=0)
    earned_value: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2), default=0)

    # Relationships
    project: Mapped[Optional["Project"]] = relationship()
    apu: Mapped[Optional["APU"]] = relationship()

class TaskLog(Base):
    __tablename__ = "task_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey("tasks.id"))
    change_date: Mapped[date] = mapped_column(Date)
    previous_date: Mapped[date] = mapped_column(Date)
    new_date: Mapped[Optional[date]] = mapped_column(Date, nullable=True)
    reason: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    task: Mapped["Task"] = relationship()

class ProtocolType(Enum):
    CONCRETE_POURING = "CONCRETE_POURING"
    ELECTRICAL_TEST = "ELECTRICAL_TEST"
    TOPOGRAPHY = "TOPOGRAPHY"
    MATERIAL_CERT = "MATERIAL_CERT"

class ProtocolStatus(Enum):
    DRAFT = "DRAFT"
    INTERNAL_REVIEW = "INTERNAL_REVIEW"
    CLIENT_REVIEW = "CLIENT_REVIEW"
    APPROVED = "APPROVED"

class QualityProtocol(Base):
    __tablename__ = "quality_protocols"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    task_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tasks.id"))
    
    type: Mapped[ProtocolType] = mapped_column(SAEnum(ProtocolType))
    status: Mapped[ProtocolStatus] = mapped_column(SAEnum(ProtocolStatus), default=ProtocolStatus.DRAFT)
    digital_signature: Mapped[bool] = mapped_column(Boolean, default=False)
    discipline: Mapped[Optional[Discipline]] = mapped_column(SAEnum(Discipline), nullable=True)
    
    # Simple JSON to store form data or file paths
    data: Mapped[Optional[dict]] = mapped_column(JSON) 

class TOPFolder(Base):
    __tablename__ = "top_folders"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    system_name: Mapped[str] = mapped_column(String(200)) # e.g. "Sistema Catenaria"
    completion_percentage: Mapped[decimal.Decimal] = mapped_column(Numeric(5, 2), default=0)
    required_documents: Mapped[list] = mapped_column(JSON) # ["TE1", "Protocolos", ...]
    
class CostParameter(Base):
    __tablename__ = "cost_parameters"

    id: Mapped[int] = mapped_column(primary_key=True)
    name: Mapped[str] = mapped_column(String(200))
    category: Mapped[str] = mapped_column(String(100))
    unit: Mapped[str] = mapped_column(String(20), default="uni")
    value: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 2))
    
    classification_rules: Mapped[Optional[dict]] = mapped_column(JSON) 

    # Simple integer, no FK constraint to avoid relationship conflicts
    client_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    # If client_id is NULL -> GLOBAL DEFAULT
    # If client_id is set -> overrides the global default for that client


class IndirectCost(Base):
    __tablename__ = "indirect_costs"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    category: Mapped[str] = mapped_column(String(100)) # e.g. "Flota Vehículos", "Instalaciones Faena"
    description: Mapped[str] = mapped_column(String(200)) # e.g. "Arriendo Camioneta 4x4"
    unit: Mapped[str] = mapped_column(String(50)) # e.g. "mes", "global"
    quantity: Mapped[decimal.Decimal] = mapped_column(Numeric(12, 4))
    unit_price: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2))
    total_price: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2))

    project: Mapped["Project"] = relationship()

class AmortizedAsset(Base):
    __tablename__ = "amortized_assets"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    name: Mapped[str] = mapped_column(String(200)) # e.g. "Notebook Profesional"
    asset_category: Mapped[str] = mapped_column(String(100)) # e.g. "Hardware", "Comunicaciones"
    purchase_value: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2)) # One-off purchase
    amortization_months: Mapped[int] = mapped_column(Integer) # e.g. 36
    monthly_fixed_cost: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2), default=0) # e.g. monthly phone plan
    
    project: Mapped["Project"] = relationship()

class ChangeRequest(Base):
    __tablename__ = "change_requests"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    task_id: Mapped[Optional[int]] = mapped_column(ForeignKey("tasks.id"), nullable=True)
    title: Mapped[str] = mapped_column(String(200))
    description: Mapped[str] = mapped_column(String(1000))
    cost_impact: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2))
    time_impact_days: Mapped[int] = mapped_column(Integer)
    status: Mapped[ChangeRequestStatus] = mapped_column(SAEnum(ChangeRequestStatus), default=ChangeRequestStatus.DRAFT)

    project: Mapped["Project"] = relationship()
    task: Mapped[Optional["Task"]] = relationship()

class Risk(Base):
    __tablename__ = "risks"

    id: Mapped[int] = mapped_column(primary_key=True)
    project_id: Mapped[int] = mapped_column(ForeignKey("projects.id"))
    description: Mapped[str] = mapped_column(String(1000))
    probability: Mapped[decimal.Decimal] = mapped_column(Numeric(5, 4)) # 0.0000 to 1.0000
    impact_cost: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2))
    expected_monetary_value: Mapped[decimal.Decimal] = mapped_column(Numeric(18, 2)) # Probability * impact_cost
    response_plan: Mapped[str] = mapped_column(String(1000))

    project: Mapped["Project"] = relationship()

