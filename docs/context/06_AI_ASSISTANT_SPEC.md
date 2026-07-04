# 06 - Especificación del prototipo de IA

## Tecnología IA seleccionada

Sistema conversacional para asistencia gerencial.

## Objetivo

Permitir que un administrador consulte el estado del negocio en lenguaje natural y reciba respuestas útiles basadas en los datos y modelos.

## Valor para el negocio

- Reduce el tiempo de lectura de reportes.
- Ayuda a gerencia a interpretar KPIs.
- Convierte resultados del modelo en acciones.
- Explica términos como RMSE, R², margen y clusters.

## Implementación sugerida

No usar APIs externas.

Backend:
- Crear `assistant.py`.
- Usar reglas de intención con palabras clave.
- Opcional: usar TF-IDF + similitud coseno con scikit-learn para buscar la respuesta más parecida dentro de una base de conocimiento.
- Enriquecer respuestas consultando KPIs reales calculados por el backend.

## Intenciones mínimas

- resumen_negocio
- ventas_local
- ventas_categoria
- margen
- prediccion
- inventario
- personal
- marketing
- explicar_rmse
- explicar_r2
- explicar_kmeans
- arquitectura
- recomendaciones

## Preguntas sugeridas en UI

- ¿Cuál es el local con mayores ventas?
- ¿Qué local requiere más seguimiento?
- ¿Qué significa el RMSE del modelo?
- ¿Qué significa el R²?
- ¿Qué platos son de alto valor?
- ¿Cómo optimizar el inventario para temporada alta?
- ¿Qué recomienda el modelo para julio?
- ¿Por qué se usa regresión lineal?
- ¿Cómo aporta K-Means al negocio?

## Respuesta esperada

Cada respuesta debe tener:
- respuesta directa
- dato o indicador relacionado
- recomendación empresarial
