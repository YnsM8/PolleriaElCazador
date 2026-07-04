from __future__ import annotations

import re
import unicodedata

from app.schemas.assistant import ChatResponse
from app.services.analytics import (
    calculate_category_sales,
    calculate_locations,
    calculate_summary,
)
from app.services.clustering import get_dish_clusters
from app.services.regression import get_model_metrics


SUGGESTED_QUESTIONS = [
    "Cual es el local con mayores ventas?",
    "Que significa el RMSE del modelo?",
    "Como aporta K-Means al negocio?",
    "Como optimizar inventario en temporada alta?",
]

INTENT_KEYWORDS = {
    "ventas": ["venta", "ventas", "vende", "vendio", "vendimos", "ingreso", "ticket", "pedido", "pedidos"],
    "locales": ["local", "locales", "sede", "sedes", "calle real", "huancavelica", "seguimiento"],
    "rmse": ["rmse", "error cuadratico", "raiz", "desviacion"],
    "r2": ["r2", "r²", "determinacion", "variabilidad", "explica"],
    "regresion_lineal": ["regresion", "lineal", "prediccion", "predecir", "modelo predictivo", "ventas mensuales"],
    "kmeans": ["kmeans", "k-means", "cluster", "clusters", "segmentacion", "platos", "alto valor", "alto volumen"],
    "inventario": ["inventario", "stock", "insumos", "pollo", "papas", "carbon", "merma"],
    "personal": ["personal", "trabajadores", "turno", "turnos", "cocina", "salon", "atencion"],
    "marketing": ["marketing", "promocion", "promociones", "campana", "descuento", "combos"],
    "temporada_alta": ["temporada alta", "julio", "diciembre", "alta"],
    "temporada_baja": ["temporada baja", "enero", "febrero", "marzo", "baja"],
    "recomendaciones": ["recomienda", "recomendacion", "estrategia", "acciones", "decision", "decisiones"],
}


def answer_chat(message: str) -> ChatResponse:
    normalized_message = _normalize(message)
    category = _detect_category(normalized_message)
    answer = _build_answer(category)

    return ChatResponse(
        answer=answer,
        category=category,
        suggested_questions=_suggestions_for_category(category),
    )


def _detect_category(message: str) -> str:
    priority_categories = [
        "rmse",
        "r2",
        "kmeans",
        "inventario",
        "personal",
        "marketing",
        "regresion_lineal",
        "recomendaciones",
    ]
    for category in priority_categories:
        if any(_normalize(keyword) in message for keyword in INTENT_KEYWORDS[category]):
            return category

    if any(keyword in message for keyword in ["local", "locales", "sede", "sedes", "calle real", "huancavelica"]):
        return "locales"
    if "temporada alta" in message or "julio" in message or "diciembre" in message:
        return "temporada_alta"
    if "temporada baja" in message or "enero" in message or "febrero" in message or "marzo" in message:
        return "temporada_baja"

    scores: dict[str, int] = {}
    for category, keywords in INTENT_KEYWORDS.items():
        scores[category] = sum(1 for keyword in keywords if _normalize(keyword) in message)

    best_category = max(scores, key=scores.get)
    if scores[best_category] == 0:
        return "resumen_negocio"
    return best_category


def _build_answer(category: str) -> str:
    handlers = {
        "ventas": _answer_sales,
        "locales": _answer_locations,
        "rmse": _answer_rmse,
        "r2": _answer_r2,
        "regresion_lineal": _answer_regression,
        "kmeans": _answer_kmeans,
        "inventario": _answer_inventory,
        "personal": _answer_staff,
        "marketing": _answer_marketing,
        "temporada_alta": _answer_high_season,
        "temporada_baja": _answer_low_season,
        "recomendaciones": _answer_recommendations,
        "resumen_negocio": _answer_business_summary,
    }
    return handlers.get(category, _answer_business_summary)()


def _answer_business_summary() -> str:
    summary = calculate_summary()
    top_location = calculate_locations()[0]
    return (
        "El Cazador opera tres locales en Chilca y el sistema BI centraliza ventas, margen, descuentos "
        f"y modelos predictivos. En el periodo {summary['periodo']} se registran "
        f"S/ {summary['ventas_totales']:,.2f} en ventas, {summary['pedidos_totales']:,} pedidos "
        f"y un ticket promedio de S/ {summary['ticket_promedio']:,.2f}. "
        f"El local con mayor venta es {top_location['local']}. "
        "La recomendacion general es usar estos indicadores para planificar inventario, personal y promociones."
    )


def _answer_sales() -> str:
    summary = calculate_summary()
    top_location = calculate_locations()[0]
    categories = calculate_category_sales()
    top_category = categories[0]
    return (
        f"Las ventas totales son S/ {summary['ventas_totales']:,.2f}, con "
        f"{summary['pedidos_totales']:,} pedidos y ticket promedio de S/ {summary['ticket_promedio']:,.2f}. "
        f"El local lider es {top_location['local']} con S/ {top_location['ventas_totales']:,.2f}; "
        f"la categoria mas fuerte es {top_category['categoria']} con S/ {top_category['ventas_totales']:,.2f}. "
        "Conviene priorizar abastecimiento y control operativo en los puntos y categorias de mayor demanda."
    )


def _answer_locations() -> str:
    locations = calculate_locations()
    leader = locations[0]
    follow_up = next((location for location in locations if location["id_local"] == 3), locations[-1])
    return (
        f"El local con mayores ventas es {leader['local']} con S/ {leader['ventas_totales']:,.2f}. "
        f"El local que requiere mayor seguimiento es {follow_up['local']}, porque esta en etapa de expansion "
        "y presenta mayor necesidad de monitoreo predictivo. "
        f"Recomendacion: {follow_up['recomendacion']}"
    )


def _answer_rmse() -> str:
    metrics = get_model_metrics()
    return (
        f"El RMSE del modelo es S/ {metrics['rmse']:,.2f}. "
        "En terminos gerenciales, representa el error tipico de prediccion mensual expresado en soles: "
        "mientras menor sea, mas confiable es la estimacion para compras de pollo, papas y carbon. "
        "Se recomienda usarlo como margen de seguridad al planificar inventario."
    )


def _answer_r2() -> str:
    metrics = get_model_metrics()
    return (
        f"El R2 del modelo es {metrics['r2']:.4f}, equivalente a {metrics['r2_porcentaje']:.2f}%. "
        "Esto indica que la regresion lineal captura una parte alta de la variabilidad de las ventas mensuales. "
        "Para gerencia, significa que el modelo es util como apoyo a decisiones, aunque debe complementarse con criterio operativo."
    )


def _answer_regression() -> str:
    metrics = get_model_metrics()
    return (
        "La regresion lineal predice ventas mensuales por local usando anio, mes, id_local, descuento promedio "
        f"y temporada. Sus metricas actuales son MAE S/ {metrics['mae']:,.2f}, "
        f"RMSE S/ {metrics['rmse']:,.2f} y R2 {metrics['r2']:.4f}. "
        "Es adecuada para el caso porque es interpretable y permite convertir la prediccion en decisiones de inventario, personal y marketing."
    )


def _answer_kmeans() -> str:
    clusters = get_dish_clusters()
    high_value = next(item for item in clusters["resumen"] if item["cluster"] == "ALTO VALOR")
    return (
        "K-Means segmenta los platos segun precio, margen, frecuencia mensual y margen unitario. "
        "Los grupos son ALTO VALOR, ALTO VOLUMEN, NICHO RENTABLE y BAJO RENDIMIENTO. "
        f"El grupo ALTO VALOR concentra {high_value['platos']} platos y S/ {high_value['ventas_totales']:,.2f} en ventas. "
        "La recomendacion es proteger stock de platos de alto valor y revisar precio/rotacion de bajo rendimiento."
    )


def _answer_inventory() -> str:
    metrics = get_model_metrics()
    return (
        "Para inventario, usa la prediccion mensual y suma un margen de seguridad cercano al error del modelo "
        f"(RMSE S/ {metrics['rmse']:,.2f}). En temporada alta conviene reforzar pollo, papas y carbon antes de fines de semana. "
        "En temporada baja, evita sobrestock de perecibles y revisa compras semanalmente."
    )


def _answer_staff() -> str:
    top_location = calculate_locations()[0]
    return (
        f"Para personal, el local {top_location['local']} debe tener mayor cobertura por liderar ventas. "
        "La prioridad operativa es reforzar turnos tarde y noche, especialmente viernes, sabado, domingo, julio y diciembre. "
        "En locales de menor demanda, conviene mantener dotacion base con refuerzos puntuales."
    )


def _answer_marketing() -> str:
    summary = calculate_summary()
    return (
        f"El descuento promedio acumulado es {summary['descuento_promedio']:.2f}%. "
        "Marketing debe usar promociones moderadas: combos para sostener demanda en temporada baja y campanas selectivas "
        "para platos de alto margen. Si el descuento sube demasiado, puede aumentar ventas pero erosionar margen bruto."
    )


def _answer_high_season() -> str:
    return (
        "La temporada alta corresponde a julio y diciembre. En esos meses la demanda aumenta, por lo que se recomienda "
        "anticipar compras de insumos criticos, reforzar personal en cocina y atencion, y priorizar platos de alto valor "
        "sin abusar de descuentos."
    )


def _answer_low_season() -> str:
    return (
        "La temporada baja corresponde a enero, febrero y marzo. La demanda esperada es menor, por lo que conviene "
        "controlar inventario perecible, activar promociones moderadas y revisar platos de baja rotacion para proteger margen."
    )


def _answer_recommendations() -> str:
    locations = calculate_locations()
    expansion_location = next((location for location in locations if location["id_local"] == 3), locations[-1])
    return (
        "Recomendaciones estrategicas: automatizar una revision semanal de ventas y predicciones; reforzar inventario "
        "en temporada alta; ajustar personal segun picos de demanda; usar promociones por categoria y no solo descuentos generales; "
        f"dar seguimiento especial a {expansion_location['local']} por estar en etapa de expansion."
    )


def _suggestions_for_category(category: str) -> list[str]:
    by_category = {
        "ventas": ["Que categoria vende mas?", "Cual es el local con mayores ventas?", "Cual es el ticket promedio?"],
        "locales": ["Que local requiere mas seguimiento?", "Como se comparan los locales?", "Que recomienda para Calle Real #976?"],
        "rmse": ["Que significa el R2?", "Como uso el RMSE para inventario?", "El modelo es confiable?"],
        "r2": ["Que significa el RMSE?", "Por que se usa regresion lineal?", "Que variables usa el modelo?"],
        "regresion_lineal": ["Que recomienda el modelo para julio?", "Que significa el RMSE?", "Que variables impactan la prediccion?"],
        "kmeans": ["Que platos son de alto valor?", "Como aporta K-Means al negocio?", "Que hacer con bajo rendimiento?"],
        "inventario": ["Como optimizar inventario en temporada alta?", "Que hacer en temporada baja?", "Como usar el RMSE?"],
        "personal": ["Que turnos reforzar?", "Que local necesita mas personal?", "Como planificar temporada alta?"],
        "marketing": ["Como usar descuentos sin perder margen?", "Que hacer en temporada baja?", "Que platos promocionar?"],
        "temporada_alta": ["Como optimizar inventario en temporada alta?", "Que personal reforzar?", "Que promociones usar en julio?"],
        "temporada_baja": ["Como sostener ventas en temporada baja?", "Que promociones convienen?", "Como evitar merma?"],
        "recomendaciones": ["Que local requiere mas seguimiento?", "Como priorizar inventario?", "Como aporta la IA al negocio?"],
    }
    return by_category.get(category, SUGGESTED_QUESTIONS)


def _normalize(text: str) -> str:
    text = text.lower().strip()
    text = "".join(
        character for character in unicodedata.normalize("NFD", text) if unicodedata.category(character) != "Mn"
    )
    text = re.sub(r"\s+", " ", text)
    return text
