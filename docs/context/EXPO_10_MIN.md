# Guion de exposición oral - 10 minutos

## 1. Introducción y problemática

Buenos días. Nuestro proyecto presenta una solución integral de Inteligencia de Negocios e Inteligencia Artificial para Pollos y Parrillas El Cazador, una cadena gastronómica con tres locales en Chilca, Huancayo.

El problema principal es que la empresa necesita tomar mejores decisiones sobre ventas, inventario, personal y promociones. Actualmente, estas decisiones pueden depender mucho de la experiencia, pero no necesariamente de datos consolidados.

## 2. Arquitectura de datos

La solución propone una arquitectura con Data Lake y Data Warehouse. En el Data Lake se almacenan los datos crudos de ventas, platos, costos, feriados y futuras fuentes como clima o campañas. Luego, mediante procesos ETL, los datos se limpian, transforman e integran en un Data Warehouse con tablas de hechos y dimensiones.

## 3. Análisis de datos

En el dashboard se analizan indicadores como ventas totales, pedidos, ticket promedio, margen bruto, descuentos y ventas por categoría. También se visualizan tendencias anuales, distribución de ventas y comparativas por local.

## 4. Modelo predictivo

Usamos regresión lineal para predecir ventas mensuales por local. Las variables de entrada son año, mes, local, descuento promedio y temporada. Evaluamos el modelo con MAE, RMSE y R².

## 5. Segmentación

También usamos K-Means para segmentar platos según precio, margen y frecuencia. Esto permite clasificar platos en alto valor, alto volumen, nicho rentable y bajo rendimiento.

## 6. Dashboard

El dashboard integra los resultados en una interfaz web interactiva, con visualizaciones y narrativas que ayudan a interpretar los datos desde una perspectiva empresarial.

## 7. IA desarrollada

Como prototipo de IA se implementó un asistente conversacional para gerencia. Este permite consultar KPIs, interpretar métricas y obtener recomendaciones sobre inventario, personal y marketing.

## 8. Cierre

En conclusión, el proyecto demuestra cómo una empresa gastronómica puede transformar sus datos en conocimiento estratégico, usando BI, modelos predictivos y un asistente de IA para mejorar la toma de decisiones.
