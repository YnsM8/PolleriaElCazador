# 04 - API Contract

## Base URL

http://localhost:8000

## Endpoints

### GET /api/health

Respuesta:
```json
{
  "status": "ok",
  "project": "El Cazador BI + IA"
}
```

### POST /api/data/generate

Genera datasets y warehouse.

Respuesta:
```json
{
  "message": "Datos generados correctamente",
  "ventas_rows": 12345,
  "periodo": "2021-01-01 a 2026-06-01"
}
```

### GET /api/summary

KPIs generales:
- ventas_totales
- pedidos_totales
- ticket_promedio
- margen_bruto_total
- margen_bruto_porcentaje
- descuento_total
- descuento_promedio
- mae
- rmse
- r2

### GET /api/locales

Métricas por local:
- id_local
- local
- antiguedad
- perfil
- ventas_totales
- pedidos
- ticket_promedio
- margen_bruto
- margen_porcentaje
- recomendacion

### GET /api/ventas/anuales

- año
- ventas_totales
- margen_bruto
- margen_porcentaje
- descuento_porcentaje

### GET /api/ventas/categorias

- categoria
- ventas_totales
- margen_bruto
- pedidos

### GET /api/eda/estadisticas

Estadísticas descriptivas:
- count
- mean
- std
- min
- p25
- p50
- p75
- max

### GET /api/eda/distribucion-ventas

Para histograma:
- rango
- frecuencia

### GET /api/eda/boxplot-local

Datos resumidos para boxplot:
- local
- min
- q1
- median
- q3
- max

### GET /api/clusters/platos

Devuelve:
- platos con cluster
- centroides
- resumen por cluster
- recomendaciones

### GET /api/model/metrics

Devuelve:
- mae
- rmse
- r2
- interpretacion

### GET /api/model/importancia

Devuelve:
- variable
- coeficiente
- impacto

### GET /api/model/predicciones-vs-real

Devuelve:
- real
- predicho
- residuo
- año
- mes
- local

### POST /api/model/predict

Body:
```json
{
  "año": 2026,
  "mes": 7,
  "id_local": 1,
  "descuento_promedio": 15.0,
  "temporada": "Alta"
}
```

Respuesta:
```json
{
  "venta_estimada": 123456.78,
  "interpretacion": "...",
  "recomendacion_inventario": "...",
  "recomendacion_personal": "...",
  "recomendacion_marketing": "..."
}
```

### POST /api/assistant/ask

Body:
```json
{
  "question": "¿Qué local vende más?"
}
```

Respuesta:
```json
{
  "answer": "...",
  "intent": "ventas_local",
  "sources": ["summary", "locales"]
}
```

### GET /api/recomendaciones

Devuelve recomendaciones estratégicas:
- inventario
- personal
- marketing
- automatización semanal
- escalabilidad con clima y campañas
