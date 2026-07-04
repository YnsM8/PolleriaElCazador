# 02 - Especificación de datos según notebook

## Bloques del notebook

El notebook tiene 4 bloques principales:

1. Generación de datos
2. Análisis exploratorio
3. K-Means para segmentación de platos
4. Regresión Lineal para predicción de ventas

## Generación de datos

Periodo:
- Desde 2021-01-01 hasta 2026-06-01.

Semillas:
- numpy seed 42
- random seed 42

Variables del dataset de ventas:
- id_venta
- fecha
- año
- mes
- id_local
- local
- id_turno
- turno
- dia_semana
- es_feriado
- id_plato
- plato
- categoria
- cantidad
- precio_unitario
- costo_total
- descuento
- monto_subtotal
- monto_descuento
- monto_total
- margen_bruto

Locales del notebook:
- id_local 1: Ferrocarril & Real, factor_venta 1.2
- id_local 2: Av. Huancavelica 436, factor_venta 0.9
- id_local 3: Centro, factor_venta 1.1

Locales normalizados para la app:
- id_local 1: Calle Real #232, factor_venta 1.2
- id_local 2: Avenida Huancavelica #587, factor_venta 0.9
- id_local 3: Calle Real #976, factor_venta 1.1

Turnos:
- Mañana: 0.20
- Tarde: 0.45
- Noche: 0.35

Factores por día:
- Lunes: 0.70
- Martes: 0.80
- Miércoles: 0.85
- Jueves: 0.90
- Viernes: 1.20
- Sábado: 1.50
- Domingo: 1.40

Temporadas:
- Alta: julio y diciembre.
- Baja: enero, febrero y marzo.
- Media: resto de meses.

Reglas:
- Viernes, sábado y domingo tienen mayor demanda.
- Julio y diciembre aumentan la demanda.
- Enero, febrero y marzo reducen la demanda.
- Feriados aumentan la demanda.
- Desde 2025 los descuentos son más frecuentes y más altos.
- El descuento afecta el margen bruto.

## Platos

Incluir 19 platos:
- PARRILLA MIXTA
- PARRILLA ESPECIAL
- BISTEC A LA PARRILLA
- CHURRASCO
- ANTICUCHO
- KASLER
- PIERNAS AL AJO
- CHAUFA DE POLLO
- TALLARIN SALTADO
- POLLO BRASA 1/4
- POLLO BRASA 1/2
- POLLO BRASA FAMILIAR
- 1/4 POLLO + PAPA
- BEBIDA 1L
- BEBIDA 2L
- CHICHA MORADA
- PAPAS FRITAS
- ENSALADA RUSA
- ARROZ CHAUFA

Categorías:
- Parrillas
- Especiales
- Brasas
- Bebidas
- Complementos

## EDA

Calcular:
- Estadísticas descriptivas de monto_total, margen_bruto y descuento.
- Evolución anual de margen.
- Ventas por categoría.
- Distribución de monto_total.
- Comparación por local.
- Margen por categoría.

## K-Means

Agrupar por plato:
- precio_unitario promedio
- costo promedio
- ingreso total
- margen promedio
- frecuencia

Variables del modelo:
- precio_unitario
- margen_%
- frecuencia_mensual
- margen_unitario

Configuración:
- StandardScaler
- KMeans(n_clusters=4, random_state=42, n_init=10)

Clusters:
- ALTO VALOR
- ALTO VOLUMEN
- NICHO RENTABLE
- BAJO RENDIMIENTO

## Regresión Lineal

Agrupar ventas mensuales por:
- año
- mes
- id_local
- local

Variables calculadas:
- ventas_totales
- ventas_sin_descuento
- total_descuentos
- numero_pedidos
- descuento_promedio
- temporada

Inputs:
- año
- mes
- id_local
- descuento_promedio
- temporada

Output:
- ventas_totales

Preprocesamiento:
- OneHotEncoder para id_local y temporada.
- StandardScaler para año, mes y descuento_promedio.

Modelo:
- LinearRegression

Evaluación:
- MAE
- RMSE
- R²
- Coeficientes
