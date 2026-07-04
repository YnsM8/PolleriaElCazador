# Context Pack - Proyecto BI + IA El Cazador

Este paquete sirve para iniciar el desarrollo con Codex desde cero.

## Archivos base incluidos

- `docs/reference/CONSIGNA_EVALUACION_FINAL_IN.pdf`: consigna oficial de evaluación.
- `docs/reference/INFORME_BI_EL_CAZADOR.pdf`: informe técnico del caso de negocio.
- `docs/reference/CONSOLIDADO_2_2_IN.ipynb`: notebook Python con generación de datos, EDA, K-Means y regresión lineal.

## Objetivo

Construir una web full stack que funcione como herramienta equivalente a un dashboard BI, con:
- Arquitectura de datos conceptual: Data Lake + Data Warehouse.
- Análisis descriptivo/exploratorio.
- Modelo predictivo supervisado: Regresión Lineal.
- Modelo no supervisado: K-Means para segmentación de platos.
- Dashboard interactivo con data storytelling.
- Prototipo de IA: sistema conversacional para consultas gerenciales.
- Sección de presentación para exposición oral de 10 minutos.

## Stack recomendado

- Backend: FastAPI + pandas + numpy + scikit-learn.
- Frontend: React + Vite + TypeScript + Tailwind CSS + Recharts.
- Persistencia de prototipo: CSV/Parquet/SQLite.
- Sin login en la primera versión.
- Sin APIs externas ni servicios de pago.
