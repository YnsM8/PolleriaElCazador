# 07 - Plan de tareas para Codex

## Regla general

Avanzar por fases. No construir todo sin verificar.

## Fase 0 - Preparación

- Crear estructura de carpetas.
- Copiar archivos de referencia.
- Crear README principal.
- Configurar Git.
- Crear `.gitignore`.

## Fase 1 - Backend base

- Crear FastAPI.
- Configurar CORS.
- Crear endpoint health.
- Crear data_generator.py.
- Generar ventas_cazador.csv y platos_cazador.csv.
- Normalizar nombres de locales.

Verificación:
- `uvicorn app.main:app --reload`
- Abrir `/api/health`
- Probar `/api/data/generate`

## Fase 2 - Analytics + Warehouse

- Crear data lake conceptual con carpetas raw, processed y warehouse.
- Crear dimensiones y tabla de hechos.
- Crear KPIs.
- Crear endpoints de resumen, locales, anuales, categorías y EDA.

## Fase 3 - Modelos

- Implementar K-Means.
- Implementar Regresión Lineal.
- Crear endpoints de métricas, coeficientes, predicción vs real y simulador.

## Fase 4 - IA conversacional

- Crear assistant.py.
- Implementar reglas + TF-IDF.
- Endpoint `/api/assistant/ask`.
- Respuestas con KPIs reales.

## Fase 5 - Frontend base

- Crear React + Vite + TypeScript + Tailwind.
- Crear layout, sidebar y páginas vacías.
- Crear cliente API.

## Fase 6 - Dashboard

- Consumir endpoints.
- Crear KPI cards.
- Crear gráficos Recharts.
- Crear tablas.

## Fase 7 - Storytelling

- Agregar textos interpretativos.
- Agregar página Problema.
- Agregar página Arquitectura con Mermaid o diagrama propio.
- Agregar página Presentación.

## Fase 8 - QA

- Ejecutar backend.
- Ejecutar frontend.
- Corregir errores.
- Revisar TypeScript.
- Revisar README.
- Preparar comandos finales.
