from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.services.analytics import (
    calculate_annual_margin,
    calculate_annual_sales,
    calculate_category_sales,
    calculate_descriptive_stats,
    calculate_locations,
    calculate_sales_by_location,
    calculate_sales_distribution,
    calculate_summary,
)
from app.schemas.assistant import ChatRequest, ChatResponse
from app.schemas.model import PredictionRequest
from app.services.assistant import answer_chat
from app.services.clustering import get_dish_clusters
from app.services.data_generator import generate_datasets
from app.services.regression import (
    get_feature_importance,
    get_model_metrics,
    get_predictions_vs_real,
    predict_sales,
)


app = FastAPI(
    title="El Cazador BI + IA",
    description="Backend base para el proyecto BI + IA de Pollos y Parrillas El Cazador.",
    version="0.1.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health", summary="Verifica que el backend este activo.")
def health_check() -> dict[str, str]:
    return {
        "status": "ok",
        "project": "El Cazador BI + IA",
    }


@app.post("/api/data/generate", summary="Genera datasets sinteticos y tablas warehouse.")
def generate_data() -> dict[str, object]:
    return generate_datasets()


@app.get("/api/summary", summary="Devuelve KPIs generales calculados desde fact_ventas.")
def get_summary() -> dict[str, float | int | str]:
    return calculate_summary()


@app.get("/api/locales", summary="Devuelve metricas y recomendaciones por local.")
def get_locations() -> list[dict[str, object]]:
    return calculate_locations()


@app.get("/api/ventas/anuales", summary="Devuelve ventas, margen y descuentos agregados por anio.")
def get_annual_sales() -> list[dict[str, object]]:
    return calculate_annual_sales()


@app.get("/api/ventas/categorias", summary="Devuelve ventas, pedidos y margen por categoria de plato.")
def get_category_sales() -> list[dict[str, object]]:
    return calculate_category_sales()


@app.get("/api/ventas/locales", summary="Devuelve ventas, pedidos y margen por local.")
def get_location_sales() -> list[dict[str, object]]:
    return calculate_sales_by_location()


@app.get("/api/eda/estadisticas", summary="Devuelve estadisticas descriptivas de ventas, margen y descuento.")
def get_descriptive_stats() -> list[dict[str, object]]:
    return calculate_descriptive_stats()


@app.get("/api/eda/distribucion-ventas", summary="Devuelve intervalos y frecuencias para histograma de ventas.")
def get_sales_distribution() -> list[dict[str, object]]:
    return calculate_sales_distribution()


@app.get("/api/eda/margen-anual", summary="Devuelve evolucion anual de margen y descuento.")
def get_annual_margin() -> list[dict[str, object]]:
    return calculate_annual_margin()


@app.get("/api/clusters/platos", summary="Segmenta platos con K-Means en cuatro clusters comerciales.")
def get_dish_cluster_endpoint() -> dict[str, object]:
    return get_dish_clusters()


@app.get("/api/model/metrics", summary="Devuelve metricas de la regresion lineal mensual.")
def get_model_metrics_endpoint() -> dict[str, object]:
    return get_model_metrics()


@app.get("/api/model/importancia", summary="Devuelve coeficientes e impacto de variables del modelo.")
def get_model_importance_endpoint() -> list[dict[str, object]]:
    return get_feature_importance()


@app.get("/api/model/predicciones-vs-real", summary="Devuelve ventas reales, predichas y residuos del set de prueba.")
def get_predictions_vs_real_endpoint() -> list[dict[str, object]]:
    return get_predictions_vs_real()


@app.post("/api/model/predict", summary="Simula ventas mensuales y devuelve recomendaciones gerenciales.")
def predict_sales_endpoint(request: PredictionRequest) -> dict[str, object]:
    return predict_sales(request)


@app.post("/api/assistant/chat", response_model=ChatResponse, summary="Responde consultas gerenciales con reglas y KPIs reales.")
def assistant_chat_endpoint(request: ChatRequest) -> ChatResponse:
    return answer_chat(request.message)
