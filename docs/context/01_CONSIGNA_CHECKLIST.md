# 01 - Checklist de cumplimiento de consigna

La web debe cubrir explícitamente los 7 puntos de la consigna.

## 1. Descripción del problema de negocio y análisis del entorno

Implementar en:
- Página Inicio.
- Página Problema de Negocio.
- Página Metodología.

Debe incluir:
- Empresa: Pollos y Parrillas El Cazador.
- Sector: gastronómico/restaurantes.
- Contexto operativo: tres locales en Chilca, Huancayo.
- Problema: ventas variables, inventario, personal, promociones, temporadas.
- Justificación BI + IA: centralizar datos, identificar patrones, predecir demanda y apoyar decisiones.

## 2. Arquitectura de datos

Implementar en:
- Página Arquitectura de Datos.

Debe incluir:
- Data Lake conceptual:
  - raw/ventas_cazador.csv
  - raw/platos_cazador.csv
  - raw/fuentes futuras: clima, campañas, inventario.
- ETL/ELT:
  - limpieza
  - normalización de locales
  - creación de dimensiones
  - agregaciones mensuales
- Data Warehouse:
  - fact_ventas
  - dim_fecha
  - dim_local
  - dim_plato
  - dim_turno
  - dim_temporada
- Data marts:
  - ventas
  - inventario
  - marketing
  - modelos
- Diagrama Mermaid en frontend.

## 3. Analítica de datos

Implementar en:
- Dashboard General.
- Análisis Exploratorio.

Debe incluir:
- KPI cards.
- Histogramas.
- Boxplots o alternativa equivalente.
- Dispersión.
- Tablas resumen.
- Ventas por año.
- Ventas por local.
- Ventas por categoría.
- Evolución del margen.
- Estadísticas descriptivas.

## 4. Modelo predictivo

Implementar en:
- Página Predicción.
- Página Segmentación.

Modelos:
- Regresión Lineal para ventas mensuales por local.
- K-Means para segmentación de platos.

Regresión:
- Inputs: año, mes, id_local, descuento_promedio, temporada.
- Output: ventas_totales.
- Métricas: MAE, RMSE, R².
- Visualizaciones: real vs predicho, residuos, distribución de residuos, coeficientes.

K-Means:
- Inputs: precio_unitario, margen_%, frecuencia_mensual, margen_unitario.
- 4 clusters:
  - ALTO VALOR
  - ALTO VOLUMEN
  - NICHO RENTABLE
  - BAJO RENDIMIENTO

## 5. Dashboards con data storytelling

Implementar en:
- Home.
- Dashboard.
- Locales.
- Exploratorio.
- Predicción.
- Segmentación.

Debe tener:
- Orden lógico.
- Tarjetas KPI.
- Narrativas cortas junto a los gráficos.
- Recomendaciones empresariales.
- Diseño visual claro, profesional y académico.

## 6. Prototipo de IA

Implementar en:
- Página Asistente IA.

Opción elegida:
Sistema conversacional de asistencia gerencial.

Debe responder preguntas como:
- ¿Qué local vende más?
- ¿Qué platos tienen alto valor?
- ¿Qué significa el RMSE?
- ¿Qué recomienda el modelo para julio?
- ¿Qué local necesita mayor seguimiento?
- ¿Qué acciones tomar para inventario?

Implementación sugerida:
- Endpoint POST /api/assistant/ask.
- Motor híbrido:
  - reglas por intención
  - TF-IDF + similitud coseno sobre una base de conocimiento
  - respuestas enriquecidas con KPIs reales del backend
- Sin APIs externas.

## 7. Presentación oral

Implementar como archivo:
- docs/context/EXPO_10_MIN.md

La exposición debe cubrir:
- problemática
- arquitectura
- análisis
- modelos
- dashboard
- IA desarrollada
- cierre con recomendaciones
