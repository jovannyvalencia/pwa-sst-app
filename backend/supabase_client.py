import os
from supabase import create_client, Client
from dotenv import load_dotenv

# Cargar las variables de entorno del archivo .env
load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Error: Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY")

# Esta es la variable 'supabase' que exportamos
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)