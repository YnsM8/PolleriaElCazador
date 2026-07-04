# 03 - Arquitectura de datos y aplicación

## Arquitectura conceptual

```mermaid
flowchart LR
    A[Fuentes de datos] --> B[Data Lake - Raw]
    B --> C[ETL/ELT con Python]
    C --> D[Data Warehouse]
    D --> E[Data Marts]
    E --> F[API FastAPI]
    F --> G[Dashboard Web React]
    F --> H[Modelos ML]
    F --> I[Asistente IA]

    A1[Ventas POS] --> A
    A2[Platos y costos] --> A
    A3[Feriados] --> A
    A4[Clima futuro] --> A
    A5[Campañas futuras] --> A

    D1[fact_ventas] --> D
    D2[dim_fecha] --> D
    D3[dim_local] --> D
    D4[dim_plato] --> D
    D5[dim_turno] --> D
```

## Capas del proyecto

### Backend

Responsable de:
- generar datos
- transformar datos
- crear esquema tipo Data Warehouse
- calcular KPIs
- ejecutar análisis
- entrenar modelos
- servir endpoints JSON

### Frontend

Responsable de:
- mostrar dashboards
- construir narrativa visual
- mostrar gráficos
- permitir simulación predictiva
- integrar asistente IA

### IA / ML

Componentes:
- Regresión lineal
- K-Means
- Asistente conversacional

## Estructura recomendada

```txt
el-cazador-bi/
  backend/
    app/
      main.py
      config.py
      schemas.py
      services/
        data_generator.py
        warehouse.py
        analytics.py
        clustering.py
        regression.py
        assistant.py
        recommendations.py
      routers/
        health.py
        data.py
        summary.py
        locales.py
        eda.py
        clusters.py
        model.py
        assistant.py
        recommendations.py
      data/
        raw/
        processed/
        warehouse/
    requirements.txt
    README.md

  frontend/
    src/
      api/
        client.ts
      components/
        Layout.tsx
        Sidebar.tsx
        KpiCard.tsx
        ChartCard.tsx
        DataTable.tsx
        StoryInsight.tsx
      pages/
        Home.tsx
        Problema.tsx
        Arquitectura.tsx
        Dashboard.tsx
        Locales.tsx
        Exploratorio.tsx
        Segmentacion.tsx
        Prediccion.tsx
        AsistenteIA.tsx
        Recomendaciones.tsx
        Metodologia.tsx
        Presentacion.tsx
      App.tsx
      main.tsx
    package.json
    README.md

  docs/
    reference/
    context/
  AGENTS.md
  README.md
```
