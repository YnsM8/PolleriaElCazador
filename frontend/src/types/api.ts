export type HealthResponse = {
  status: string;
  project: string;
};

export type Summary = {
  ventas_totales: number;
  pedidos_totales: number;
  ticket_promedio: number;
  margen_bruto_total: number;
  margen_bruto_porcentaje: number;
  descuento_total: number;
  descuento_promedio: number;
  periodo: string;
  locales: number;
};

export type LocalMetric = {
  id_local: number;
  local: string;
  antiguedad?: string;
  perfil?: string;
  ventas_totales: number;
  pedidos: number;
  ticket_promedio: number;
  margen_bruto: number;
  margen_porcentaje: number;
  descuentos?: number;
  recomendacion?: string;
};

export type AnnualSales = {
  anio: number;
  ventas_totales: number;
  pedidos?: number;
  margen_bruto: number;
  ticket_promedio?: number;
  margen_porcentaje: number;
  descuento_porcentaje: number;
};

export type CategorySales = {
  categoria: string;
  ventas_totales: number;
  pedidos: number;
  unidades: number;
  margen_bruto: number;
  ticket_promedio: number;
  margen_porcentaje: number;
  descuento_porcentaje: number;
};

export type DescriptiveStat = {
  variable: string;
  count: number;
  mean: number;
  std: number;
  min: number;
  p25: number;
  p50: number;
  p75: number;
  max: number;
};

export type DistributionBin = {
  rango: string;
  desde: number;
  hasta: number;
  frecuencia: number;
};

export type ClusterDish = {
  id_plato: number;
  plato: string;
  categoria: string;
  precio_unitario: number;
  ingreso_total: number;
  margen_porcentaje: number;
  frecuencia_mensual: number;
  margen_unitario: number;
  cluster_id: number;
  cluster: string;
};

export type ClusterSummary = {
  cluster_id: number;
  cluster: string;
  platos: number;
  precio_unitario: number;
  margen_porcentaje: number;
  frecuencia_mensual: number;
  margen_unitario: number;
  ventas_totales: number;
  recomendacion: string;
};

export type ClusterResponse = {
  platos: ClusterDish[];
  centroides: Array<Record<string, string | number>>;
  resumen: ClusterSummary[];
  recomendaciones: Array<{ cluster: string; recomendacion: string }>;
};

export type ModelMetrics = {
  mae: number;
  rmse: number;
  r2: number;
  r2_porcentaje: number;
  registros_entrenamiento: number;
  registros_prueba: number;
  interpretacion: string;
};

export type FeatureImportance = {
  variable: string;
  coeficiente: number;
  impacto: string;
};

export type PredictionVsReal = {
  anio: number;
  mes: number;
  id_local: number;
  local: string;
  temporada: string;
  real: number;
  predicho: number;
  residuo: number;
};

export type PredictionRequest = {
  año: number;
  mes: number;
  id_local: number;
  descuento_promedio: number;
  temporada: string;
};

export type PredictionResponse = {
  venta_estimada: number;
  interpretacion: string;
  recomendacion_inventario: string;
  recomendacion_personal: string;
  recomendacion_marketing: string;
};

export type ChatResponse = {
  answer: string;
  category: string;
  suggested_questions: string[];
};

export type AppData = {
  summary: Summary;
  locales: LocalMetric[];
  ventasAnuales: AnnualSales[];
  ventasCategorias: CategorySales[];
  ventasLocales: LocalMetric[];
  estadisticas: DescriptiveStat[];
  distribucionVentas: DistributionBin[];
  margenAnual: AnnualSales[];
  clusters: ClusterResponse;
  modelMetrics: ModelMetrics;
  importancia: FeatureImportance[];
  predicciones: PredictionVsReal[];
};
