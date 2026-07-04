from __future__ import annotations

from functools import lru_cache

import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

from app.services.analytics import load_processed_sales
from app.services.repository import get_storage_mode, read_sql_dataframe


FEATURES = ["precio_unitario", "margen_porcentaje", "frecuencia_mensual", "margen_unitario"]
CLUSTER_NAMES = ["ALTO VALOR", "ALTO VOLUMEN", "NICHO RENTABLE", "BAJO RENDIMIENTO"]


@lru_cache(maxsize=1)
def get_dish_clusters() -> dict[str, object]:
    metrics = _build_dish_metrics_from_postgres() if get_storage_mode() == "postgres" else _build_dish_metrics(load_processed_sales())

    scaler = StandardScaler()
    model_input = metrics[FEATURES]
    scaled_input = scaler.fit_transform(model_input)

    kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
    metrics["cluster_id"] = kmeans.fit_predict(scaled_input)

    centroids = pd.DataFrame(scaler.inverse_transform(kmeans.cluster_centers_), columns=FEATURES)
    centroids["cluster_id"] = centroids.index
    name_map = _assign_cluster_names(centroids)

    metrics["cluster"] = metrics["cluster_id"].map(name_map)
    centroids["cluster"] = centroids["cluster_id"].map(name_map)

    summary = (
        metrics.groupby(["cluster_id", "cluster"])
        .agg(
            platos=("id_plato", "count"),
            precio_unitario=("precio_unitario", "mean"),
            margen_porcentaje=("margen_porcentaje", "mean"),
            frecuencia_mensual=("frecuencia_mensual", "mean"),
            margen_unitario=("margen_unitario", "mean"),
            ventas_totales=("ingreso_total", "sum"),
        )
        .reset_index()
        .sort_values("ventas_totales", ascending=False)
    )
    summary["recomendacion"] = summary["cluster"].map(_cluster_recommendation)

    return {
        "platos": _round_records(metrics.sort_values(["cluster", "ingreso_total"], ascending=[True, False])),
        "centroides": _round_records(centroids.sort_values("cluster")),
        "resumen": _round_records(summary),
        "recomendaciones": [
            {"cluster": name, "recomendacion": _cluster_recommendation(name)} for name in CLUSTER_NAMES
        ],
    }


def clear_cluster_cache() -> None:
    get_dish_clusters.cache_clear()


def _build_dish_metrics(sales: pd.DataFrame) -> pd.DataFrame:
    sales = sales.copy()
    sales["costo_unitario"] = sales["costo_total"] / sales["cantidad"]
    metrics = (
        sales.groupby(["id_plato", "plato", "categoria"])
        .agg(
            precio_unitario=("precio_unitario", "mean"),
            costo_unitario=("costo_unitario", "mean"),
            ingreso_total=("monto_total", "sum"),
            margen_promedio=("margen_bruto", "mean"),
            frecuencia=("id_venta", "count"),
        )
        .reset_index()
    )
    metrics["margen_unitario"] = metrics["precio_unitario"] - metrics["costo_unitario"]
    metrics["margen_porcentaje"] = (metrics["margen_unitario"] / metrics["precio_unitario"]) * 100
    metrics["frecuencia_mensual"] = metrics["frecuencia"] / 65
    return metrics


def _build_dish_metrics_from_postgres() -> pd.DataFrame:
    metrics = read_sql_dataframe(
        """
        select
            p.id_plato,
            p.plato,
            p.categoria,
            avg(f.precio_unitario)::float as precio_unitario,
            avg(f.costo_total / nullif(f.cantidad, 0))::float as costo_unitario,
            sum(f.monto_total)::float as ingreso_total,
            avg(f.margen_bruto)::float as margen_promedio,
            count(f.id_venta)::int as frecuencia
        from fact_ventas f
        join dim_plato p on p.id_plato = f.id_plato
        group by p.id_plato, p.plato, p.categoria
        """
    )
    metrics["margen_unitario"] = metrics["precio_unitario"] - metrics["costo_unitario"]
    metrics["margen_porcentaje"] = (metrics["margen_unitario"] / metrics["precio_unitario"]) * 100
    metrics["frecuencia_mensual"] = metrics["frecuencia"] / 65
    return metrics


def _assign_cluster_names(centroids: pd.DataFrame) -> dict[int, str]:
    remaining = set(centroids["cluster_id"].tolist())
    name_map: dict[int, str] = {}

    high_value_id = int(centroids.sort_values(["precio_unitario", "margen_unitario"], ascending=False).iloc[0]["cluster_id"])
    name_map[high_value_id] = "ALTO VALOR"
    remaining.remove(high_value_id)

    high_volume_candidates = centroids[centroids["cluster_id"].isin(remaining)]
    high_volume_id = int(high_volume_candidates.sort_values("frecuencia_mensual", ascending=False).iloc[0]["cluster_id"])
    name_map[high_volume_id] = "ALTO VOLUMEN"
    remaining.remove(high_volume_id)

    niche_candidates = centroids[centroids["cluster_id"].isin(remaining)]
    niche_id = int(niche_candidates.sort_values("margen_porcentaje", ascending=False).iloc[0]["cluster_id"])
    name_map[niche_id] = "NICHO RENTABLE"
    remaining.remove(niche_id)

    low_id = remaining.pop()
    name_map[int(low_id)] = "BAJO RENDIMIENTO"
    return name_map


def _cluster_recommendation(cluster: str) -> str:
    recommendations = {
        "ALTO VALOR": "Priorizar visibilidad y asegurar stock por su aporte al margen.",
        "ALTO VOLUMEN": "Mantener disponibilidad constante y controlar tiempos de preparacion.",
        "NICHO RENTABLE": "Promocionar en combos selectivos sin sacrificar margen.",
        "BAJO RENDIMIENTO": "Revisar precio, rotacion o continuidad en carta.",
    }
    return recommendations[cluster]


def _round_records(dataframe: pd.DataFrame) -> list[dict[str, object]]:
    rounded = dataframe.copy()
    float_columns = rounded.select_dtypes(include=["float"]).columns
    for column in float_columns:
        rounded[column] = rounded[column].round(2)
    return rounded.to_dict(orient="records")
