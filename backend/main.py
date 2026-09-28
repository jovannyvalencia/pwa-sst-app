from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from supabase_client import supabase

app = FastAPI(
    title="API Backend SST",
    description="Servidor Backend en Python para gestión de Seguridad y Salud en el Trabajo",
    version="1.0.0"
)

# Permitir solicitudes desde el frontend en React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"status": "ok", "mensaje": "Servidor FastAPI corriendo correctamente"}

@app.get("/api/incidentes")
def obtener_incidentes():
    response = supabase.table("incidentes").select("*").execute()
    return {"data": response.data}