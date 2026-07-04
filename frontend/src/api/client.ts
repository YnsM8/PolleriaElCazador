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

export function getAppData(): Promise<AppData> {
  return Promise.all([
    requestJson<Summary>("/api/summary"),
    requestJson<LocalMetric[]>("/api/locales"),
    requestJson<AnnualSales[]>("/api/ventas/anuales"),
    requestJson<CategorySales[]>("/api/ventas/categorias"),
    requestJson<LocalMetric[]>("/api/ventas/locales"),
    requestJson<DescriptiveStat[]>("/api/eda/estadisticas"),
    requestJson<DistributionBin[]>("/api/eda/distribucion-ventas"),
    requestJson<AnnualSales[]>("/api/eda/margen-anual"),
    requestJson<ClusterResponse>("/api/clusters/platos"),
    requestJson<ModelMetrics>("/api/model/metrics"),
    requestJson<FeatureImportance[]>("/api/model/importancia"),
    requestJson<PredictionVsReal[]>("/api/model/predicciones-vs-real"),
  ]).then(
    ([
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
    ]) => ({
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
    }),
  );
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
