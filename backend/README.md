# Backend - El Cazador BI + IA

Backend base construido con FastAPI.

## Instalacion

```powershell
cd C:\PolleriaElCazador\backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

## Ejecutar

```powershell
uvicorn app.main:app --reload
```

## Verificar

```powershell
Invoke-RestMethod http://localhost:8000/api/health
```

Respuesta esperada:

```json
{
  "status": "ok",
  "project": "El Cazador BI + IA"
}
```

## Generar datos

```powershell
Invoke-RestMethod -Method Post http://localhost:8000/api/data/generate
```

Archivos generados:

- `data/processed/ventas_cazador.csv`
- `data/processed/platos_cazador.csv`
- `data/warehouse/fact_ventas.csv`
- `data/warehouse/dim_fecha.csv`
- `data/warehouse/dim_local.csv`
- `data/warehouse/dim_plato.csv`
- `data/warehouse/dim_turno.csv`

## Endpoints analiticos iniciales

```powershell
Invoke-RestMethod http://localhost:8000/api/summary
Invoke-RestMethod http://localhost:8000/api/locales
Invoke-RestMethod http://localhost:8000/api/ventas/anuales
Invoke-RestMethod http://localhost:8000/api/ventas/categorias
Invoke-RestMethod http://localhost:8000/api/ventas/locales
Invoke-RestMethod http://localhost:8000/api/eda/estadisticas
Invoke-RestMethod http://localhost:8000/api/eda/distribucion-ventas
Invoke-RestMethod http://localhost:8000/api/eda/margen-anual
```

Cada endpoint devuelve JSON agregado y liviano para graficos en React.

## Endpoints de modelos

```powershell
Invoke-RestMethod http://localhost:8000/api/clusters/platos
Invoke-RestMethod http://localhost:8000/api/model/metrics
Invoke-RestMethod http://localhost:8000/api/model/importancia
Invoke-RestMethod http://localhost:8000/api/model/predicciones-vs-real
Invoke-RestMethod -Method Post http://localhost:8000/api/model/predict -ContentType "application/json" -Body '{"año":2026,"mes":7,"id_local":1,"descuento_promedio":15.0,"temporada":"Alta"}'
```

## Asistente conversacional

```powershell
Invoke-RestMethod -Method Post http://localhost:8000/api/assistant/chat -ContentType "application/json" -Body '{"message":"Que significa el RMSE?"}'
```

El asistente usa reglas, contexto del negocio y KPIs/modelos locales. No usa APIs externas.
