# El Cazador BI + IA

Aplicacion web full stack para Pollos y Parrillas El Cazador. Esta fase inicial crea la estructura base del proyecto con backend FastAPI y frontend React + Vite + TypeScript + Tailwind.

## Stack

- Backend: FastAPI + Uvicorn.
- Frontend: React + Vite + TypeScript + Tailwind CSS.
- Datos: carpetas locales `data/raw`, `data/processed` y `data/warehouse`.

## Backend

```powershell
cd C:\PolleriaElCazador\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Verificar:

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

## Frontend

```powershell
cd C:\PolleriaElCazador\frontend
npm install
npm run dev
```

Verificar:

```txt
http://localhost:5173
```

## Estado de la fase

Fase 6 incluye backend BI + IA y frontend React con navegacion, dashboards, graficos, tablas, simulador predictivo, asistente IA, arquitectura visual y presentacion de 10 minutos.

## Supabase / Vercel

Para despliegue, configura `DATABASE_URL` en el backend con la cadena PostgreSQL de Supabase. Si `DATABASE_URL` no existe, la app usa CSV local como fallback.

```powershell
cd C:\PolleriaElCazador\backend
python scripts/create_schema.py
python scripts/seed_database.py --replace
python scripts/check_database.py
```

## Despliegue en Vercel

El repo queda preparado para Vercel Services:

- `frontend` se publica en `/`.
- `backend/main.py` expone FastAPI bajo `/server`.
- El frontend consulta `/server/api/...` cuando `VITE_API_URL=/server`.

En el dashboard de Vercel:

1. Importa el repo `YnsM8/PolleriaElCazador`.
2. En `Project Settings > Build & Development Settings`, usa Framework Preset `Services`.
3. Configura variables de entorno:

```txt
DATABASE_URL=postgresql+psycopg://...
VITE_API_URL=/server
BACKEND_CORS_ORIGINS=
```

`BACKEND_CORS_ORIGINS` puede quedar vacio si frontend y backend viven en el mismo proyecto Vercel. Para dominios separados, agrega los origenes permitidos separados por coma.

Comandos locales de verificacion antes de desplegar:

```powershell
cd C:\PolleriaElCazador\backend
python scripts/check_database.py
cd ..\frontend
npm run build
```
