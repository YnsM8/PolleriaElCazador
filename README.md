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
