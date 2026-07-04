import type {
  AnnualSales,
  AppData,
  CategorySales,
  ChatResponse,
  ClusterResponse,
  DescriptiveStat,
  DistributionBin,
  FeatureImportance,
  HealthResponse,
  LocalMetric,
  ModelMetrics,
  PredictionRequest,
  PredictionResponse,
  PredictionVsReal,
  Summary,
} from "../types/api";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ??
  import.meta.env.VITE_API_BASE_URL ??
  (import.meta.env.PROD ? "/server" : "http://localhost:8000");

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!response.ok) {
    throw new Error(`Error ${response.status} al consultar ${path}`);
  }

  return response.json();
}

export function getHealth(): Promise<HealthResponse> {
  return requestJson<HealthResponse>("/api/health");
}

export async function getAppData(): Promise<AppData> {
  const summary = await requestJson<Summary>("/api/summary");
  const locales = await requestJson<LocalMetric[]>("/api/locales");
  const ventasAnuales = await requestJson<AnnualSales[]>("/api/ventas/anuales");
  const ventasCategorias = await requestJson<CategorySales[]>("/api/ventas/categorias");
  const ventasLocales = await requestJson<LocalMetric[]>("/api/ventas/locales");
  const estadisticas = await requestJson<DescriptiveStat[]>("/api/eda/estadisticas");
  const distribucionVentas = await requestJson<DistributionBin[]>("/api/eda/distribucion-ventas");
  const margenAnual = await requestJson<AnnualSales[]>("/api/eda/margen-anual");
  const clusters = await requestJson<ClusterResponse>("/api/clusters/platos");
  const modelMetrics = await requestJson<ModelMetrics>("/api/model/metrics");
  const importancia = await requestJson<FeatureImportance[]>("/api/model/importancia");
  const predicciones = await requestJson<PredictionVsReal[]>("/api/model/predicciones-vs-real");

  return {
    summary,
    locales,
    ventasAnuales,
    ventasCategorias,
    ventasLocales,
    estadisticas,
    distribucionVentas,
    margenAnual,
    clusters,
    modelMetrics,
    importancia,
    predicciones,
  };
}

export function predictSales(payload: PredictionRequest): Promise<PredictionResponse> {
  return requestJson<PredictionResponse>("/api/model/predict", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function sendChatMessage(message: string): Promise<ChatResponse> {
  return requestJson<ChatResponse>("/api/assistant/chat", {
    method: "POST",
    body: JSON.stringify({ message }),
  });
}
