import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import tasks, documents, parameters, estimation, projects

# Initialize Database (Create Tables - best effort, tables may already exist)
try:
    from app.database import init_db
    init_db()
except Exception as e:
    print(f"[WARN] init_db skipped: {e}")

app = FastAPI(
    title="ConstructIA API",
    description="Backend for Construction Management SaaS",
    version="1.0.0"
)

# CORS (Allow Frontend to connect)
cors_origins = [
    origin.strip()
    for origin in os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:3001").split(",")
    if origin.strip()
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(tasks.router, prefix="/api/tasks", tags=["Tasks"])
app.include_router(documents.router, prefix="/api/documents", tags=["Documents"])
app.include_router(parameters.router, prefix="/api/parameters", tags=["Parameters"])
app.include_router(estimation.router, prefix="/api/estimation", tags=["Estimation"])
app.include_router(projects.router, prefix="/api/projects", tags=["Projects"])

@app.get("/")
def read_root():
    return {"message": "Welcome to ConstructIA API"}
