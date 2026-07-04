from __future__ import annotations

from pathlib import Path

import pandas as pd
from fastapi import HTTPException

from app.services.data_generator import processed_file, warehouse_file


def _read_csv_or_404(path: Path, friendly_name: str) -> pd.DataFrame:
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"{friendly_name} no existe. Ejecuta POST /api/data/generate primero.",
        )
    return pd.read_csv(path)


def load_fact_sales() -> pd.DataFrame:
    return _read_csv_or_404(warehouse_file("fact_ventas"), "fact_ventas.csv")


def load_locations() -> pd.DataFrame:
    return _read_csv_or_404(warehouse_file("dim_local"), "dim_local.csv")


def load_processed_sales() -> pd.DataFrame:
    return _read_csv_or_404(processed_file("ventas_cazador.csv"), "ventas_cazador.csv")


def calculate_summary() -> dict[str, float | int | str]:
    fact_sales = load_fact_sales()

    summary = _calculate_kpis(fact_sales)
    summary["periodo"] = f"{fact_sales['fecha'].min()} a {fact_sales['fecha'].max()}"
    summary["locales"] = int(fact_sales["id_local"].nunique())
    return summary


def _calculate_kpis(fact_sales: pd.DataFrame) -> dict[str, float | int]:
    total_sales = float(fact_sales["monto_total"].sum())
    total_orders = int(fact_sales["id_venta"].count())
    total_margin = float(fact_sales["margen_bruto"].sum())
    subtotal = float(fact_sales["monto_subtotal"].sum())
    total_discount = float(fact_sales["monto_descuento"].sum())

    return {
        "ventas_totales": round(total_sales, 2),
        "pedidos_totales": total_orders,
        "ticket_promedio": round(total_sales / total_orders, 2) if total_orders else 0.0,
        "margen_bruto_total": round(total_margin, 2),
        "margen_bruto_porcentaje": round((total_margin / total_sales) * 100, 2) if total_sales else 0.0,
        "descuento_total": round(total_discount, 2),
        "descuento_promedio": round((total_discount / subtotal) * 100, 2) if subtotal else 0.0,
    }


def calculate_locations() -> list[dict[str, object]]:
    fact_sales = load_fact_sales()
    locations = load_locations()

    result = _sales_by_location(fact_sales).merge(locations, on="id_local", how="left")
    result["recomendacion"] = result.apply(_location_recommendation, axis=1)

    columns = [
        "id_local",
        "local",
        "antiguedad",
        "perfil",
        "ventas_totales",
        "pedidos",
        "ticket_promedio",
        "margen_bruto",
        "margen_porcentaje",
        "descuentos",
        "recomendacion",
    ]
    result = result[columns].sort_values("ventas_totales", ascending=False)
    return _round_records(result)


def calculate_annual_sales() -> list[dict[str, object]]:
    fact_sales = load_fact_sales()
    grouped = (
        fact_sales.groupby("anio")
        .agg(
            ventas_totales=("monto_total", "sum"),
            pedidos=("id_venta", "count"),
            margen_bruto=("margen_bruto", "sum"),
            monto_subtotal=("monto_subtotal", "sum"),
            monto_descuento=("monto_descuento", "sum"),
        )
        .reset_index()
        .sort_values("anio")
    )
    grouped["ticket_promedio"] = grouped["ventas_totales"] / grouped["pedidos"]
    grouped["margen_porcentaje"] = (grouped["margen_bruto"] / grouped["ventas_totales"]) * 100
    grouped["descuento_porcentaje"] = (grouped["monto_descuento"] / grouped["monto_subtotal"]) * 100
    grouped = grouped.drop(columns=["monto_subtotal", "monto_descuento"])
    return _round_records(grouped)


def calculate_category_sales() -> list[dict[str, object]]:
    sales = load_processed_sales()
    grouped = (
        sales.groupby("categoria")
        .agg(
            ventas_totales=("monto_total", "sum"),
            pedidos=("id_venta", "count"),
            unidades=("cantidad", "sum"),
            margen_bruto=("margen_bruto", "sum"),
            monto_subtotal=("monto_subtotal", "sum"),
            monto_descuento=("monto_descuento", "sum"),
        )
        .reset_index()
    )
    grouped["ticket_promedio"] = grouped["ventas_totales"] / grouped["pedidos"]
    grouped["margen_porcentaje"] = (grouped["margen_bruto"] / grouped["ventas_totales"]) * 100
    grouped["descuento_porcentaje"] = (grouped["monto_descuento"] / grouped["monto_subtotal"]) * 100
    grouped = grouped.drop(columns=["monto_subtotal", "monto_descuento"])
    grouped = grouped.sort_values("ventas_totales", ascending=False)
    return _round_records(grouped)


def calculate_sales_by_location() -> list[dict[str, object]]:
    fact_sales = load_fact_sales()
    locations = load_locations()[["id_local", "local"]]
    result = _sales_by_location(fact_sales).merge(locations, on="id_local", how="left")
    columns = [
        "id_local",
        "local",
        "ventas_totales",
        "pedidos",
        "ticket_promedio",
        "margen_bruto",
        "margen_porcentaje",
        "descuentos",
    ]
    result = result[columns].sort_values("ventas_totales", ascending=False)
    return _round_records(result)


def calculate_descriptive_stats() -> list[dict[str, object]]:
    sales = load_processed_sales()
    metrics = ["monto_total", "margen_bruto", "descuento"]
    stats = sales[metrics].describe(percentiles=[0.25, 0.5, 0.75]).T.reset_index()
    stats = stats.rename(
        columns={
            "index": "variable",
            "25%": "p25",
            "50%": "p50",
            "75%": "p75",
        }
    )
    stats["count"] = stats["count"].astype(int)
    return _round_records(stats[["variable", "count", "mean", "std", "min", "p25", "p50", "p75", "max"]])


def calculate_sales_distribution(bins: int = 12) -> list[dict[str, object]]:
    sales = load_processed_sales()
    frequencies, edges = pd.cut(sales["monto_total"], bins=bins, retbins=True, include_lowest=True)
    distribution = frequencies.value_counts().sort_index().reset_index()
    distribution.columns = ["intervalo", "frecuencia"]
    distribution["desde"] = [round(float(edges[index]), 2) for index in range(len(edges) - 1)]
    distribution["hasta"] = [round(float(edges[index + 1]), 2) for index in range(len(edges) - 1)]
    distribution["rango"] = distribution.apply(lambda row: f"{row['desde']:.2f} - {row['hasta']:.2f}", axis=1)
    return distribution[["rango", "desde", "hasta", "frecuencia"]].to_dict(orient="records")


def calculate_annual_margin() -> list[dict[str, object]]:
    fact_sales = load_fact_sales()
    grouped = (
        fact_sales.groupby("anio")
        .agg(
            ventas_totales=("monto_total", "sum"),
            margen_bruto=("margen_bruto", "sum"),
            monto_subtotal=("monto_subtotal", "sum"),
            monto_descuento=("monto_descuento", "sum"),
        )
        .reset_index()
        .sort_values("anio")
    )
    grouped["margen_porcentaje"] = (grouped["margen_bruto"] / grouped["ventas_totales"]) * 100
    grouped["descuento_porcentaje"] = (grouped["monto_descuento"] / grouped["monto_subtotal"]) * 100
    grouped = grouped.drop(columns=["monto_subtotal", "monto_descuento"])
    return _round_records(grouped)


def _sales_by_location(fact_sales: pd.DataFrame) -> pd.DataFrame:
    grouped = (
        fact_sales.groupby("id_local")
        .agg(
            ventas_totales=("monto_total", "sum"),
            pedidos=("id_venta", "count"),
            margen_bruto=("margen_bruto", "sum"),
            descuentos=("monto_descuento", "sum"),
        )
        .reset_index()
    )
    grouped["ticket_promedio"] = grouped["ventas_totales"] / grouped["pedidos"]
    grouped["margen_porcentaje"] = (grouped["margen_bruto"] / grouped["ventas_totales"]) * 100
    return grouped


def _location_recommendation(row: pd.Series) -> str:
    if row["id_local"] == 1:
        return "Usar como referencia operativa por su estabilidad historica."
    if row["id_local"] == 2:
        return "Ajustar promociones por su flujo comercial dinamico."
    return "Monitorear demanda e inventario por su etapa de expansion."


def _round_records(dataframe: pd.DataFrame) -> list[dict[str, object]]:
    rounded = dataframe.copy()
    numeric_columns = rounded.select_dtypes(include=["number"]).columns
    float_columns = [column for column in numeric_columns if pd.api.types.is_float_dtype(rounded[column])]
    for column in float_columns:
        rounded[column] = rounded[column].round(2)
    return rounded.to_dict(orient="records")
