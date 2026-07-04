# Prompt maestro para Codex

Actúa como desarrollador web full stack senior y construye desde cero una aplicación web BI + IA para el caso “Pollos y Parrillas El Cazador”.

Antes de programar, lee todos los archivos ubicados en:
- `docs/context/`
- `docs/reference/`

La aplicación debe cumplir la consigna de evaluación final de Inteligencia de Negocios e Inteligencia Artificial. Debe cubrir obligatoriamente:
1. Descripción del problema de negocio y análisis del entorno.
2. Arquitectura de datos con Data Lake y/o Data Warehouse, flujos ETL/ELT y diagrama.
3. Analítica descriptiva/exploratoria con KPIs, histogramas, boxplots, dispersión y tablas.
4. Modelo predictivo supervisado o no supervisado con variables, evaluación e interpretación.
5. Dashboards interactivos con data storytelling usando una herramienta equivalente a Power BI/Tableau.
6. Prototipo de IA integrado al caso, usando un sistema conversacional.
7. Sección de presentación para exposición oral de 10 minutos.

## Stack obligatorio

Backend:
- FastAPI
- pandas
- numpy
- scikit-learn

Frontend:
- React
- Vite
- TypeScript
- Tailwind CSS
- Recharts

Persistencia:
- CSV/Parquet/SQLite para prototipo.

No usar:
- login
- APIs externas
- servicios de pago

## Funcionalidades obligatorias

### Backend

Crear:
- generación de datos sintéticos basada en el notebook
- normalización de locales según el informe
- capa tipo Data Lake/Data Warehouse
- endpoints de KPIs
- endpoints de EDA
- K-Means para platos
- Regresión Lineal para ventas mensuales
- endpoint de simulador predictivo
- asistente conversacional
- recomendaciones estratégicas

### Frontend

Crear páginas:
1. Inicio
2. Problema
3. Arquitectura
4. Dashboard
5. Locales
6. Análisis Exploratorio
7. Segmentación
8. Predicción
9. Asistente IA
10. Recomendaciones
11. Metodología
12. Presentación

## Modelos

### K-Means

Variables:
- precio_unitario
- margen_%
- frecuencia_mensual
- margen_unitario

Clusters:
- ALTO VALOR
- ALTO VOLUMEN
- NICHO RENTABLE
- BAJO RENDIMIENTO

### Regresión Lineal

Inputs:
- año
- mes
- id_local
- descuento_promedio
- temporada

Output:
- ventas_totales

Métricas:
- MAE
- RMSE
- R²

Visualizaciones:
- predicción vs real
- residuos
- distribución de residuos
- coeficientes

## IA conversacional

Crear endpoint:
- POST `/api/assistant/ask`

Debe responder preguntas gerenciales usando:
- reglas por intención
- TF-IDF + similitud coseno opcional
- KPIs reales del backend

## Modo de trabajo

Trabaja por fases:
1. Estructura del proyecto.
2. Backend base.
3. Datos y warehouse.
4. Analytics.
5. Modelos.
6. Asistente IA.
7. Frontend base.
8. Dashboards.
9. Storytelling.
10. QA y README.

Después de cada fase:
- muestra archivos creados/modificados
- ejecuta comandos de verificación cuando sea posible
- corrige errores antes de avanzar
