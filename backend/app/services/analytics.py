from __future__ import annotations

import pandas as pd

from app.services.repository import (
    load_fact_sales,
    load_locations,
    load_processed_sales,
    read_sql_dataframe,
    get_storage_mode,
)


def calculate_summary() -> dict[str, float | int | str]:
    if get_storage_mode() == "postgres":
        row = read_sql_dataframe(
            """
            select
                sum(monto_total)::float as ventas_totales,
                count(id_venta)::int as pedidos_totales,
                sum(margen_bruto)::float as margen_bruto_total,
                sum(monto_subtotal)::float as monto_subtotal,
                sum(monto_descuento)::float as descuento_total,
                min(fecha)::text as fecha_min,
                max(fecha)::text as fecha_max,
                count(distinct id_local)::int as locales
            from fact_ventas
            """
        ).iloc[0]
        total_sales = float(row["ventas_totales"] or 0)
        total_orders = int(row["pedidos_totales"] or 0)
        subtotal = float(row["monto_subtotal"] or 0)
        total_margin = float(row["margen_bruto_total"] or 0)
        total_discount = float(row["descuento_total"] or 0)
        return {
            "ventas_totales": round(total_sales, 2),
            "pedidos_totales": total_orders,
            "ticket_promedio": round(total_sales / total_orders, 2) if total_orders else 0.0,
            "margen_bruto_total": round(total_margin, 2),
            "margen_bruto_porcentaje": round((total_margin / total_sales) * 100, 2) if total_sales else 0.0,
            "descuento_total": round(total_discount, 2),
            "descuento_promedio": round((total_discount / subtotal) * 100, 2) if subtotal else 0.0,
            "periodo": f"{row['fecha_min']} a {row['fecha_max']}",
            "locales": int(row["locales"] or 0),
        }

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
    if get_storage_mode() == "postgres":
        result = read_sql_dataframe(
            """
            select
                l.id_local,
                l.local,
                l.antiguedad,
                l.perfil,
                sum(f.monto_total)::float as ventas_totales,
                count(f.id_venta)::int as pedidos,
                (sum(f.monto_total) / nullif(count(f.id_venta), 0))::float as ticket_promedio,
                sum(f.margen_bruto)::float as margen_bruto,
                ((sum(f.margen_bruto) / nullif(sum(f.monto_total), 0)) * 100)::float as margen_porcentaje,
                sum(f.monto_descuento)::float as descuentos
            from fact_ventas f
            join dim_local l on l.id_local = f.id_local
            group by l.id_local, l.local, l.antiguedad, l.perfil
            order by ventas_totales desc
            """
        )
        result["recomendacion"] = result.apply(_location_recommendation, axis=1)
        return _round_records(result)

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
    if get_storage_mode() == "postgres":
        return _round_records(
            read_sql_dataframe(
                """
                select
                    anio,
                    sum(monto_total)::float as ventas_totales,
                    count(id_venta)::int as pedidos,
                    sum(margen_bruto)::float as margen_bruto,
                    (sum(monto_total) / nullif(count(id_venta), 0))::float as ticket_promedio,
                    ((sum(margen_bruto) / nullif(sum(monto_total), 0)) * 100)::float as margen_porcentaje,
                    ((sum(monto_descuento) / nullif(sum(monto_subtotal), 0)) * 100)::float as descuento_porcentaje
                from fact_ventas
                group by anio
                order by anio
                """
            )
        )

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
    if get_storage_mode() == "postgres":
        return _round_records(
            read_sql_dataframe(
                """
                select
                    p.categoria,
                    sum(f.monto_total)::float as ventas_totales,
                    count(f.id_venta)::int as pedidos,
                    sum(f.cantidad)::int as unidades,
                    sum(f.margen_bruto)::float as margen_bruto,
                    (sum(f.monto_total) / nullif(count(f.id_venta), 0))::float as ticket_promedio,
                    ((sum(f.margen_bruto) / nullif(sum(f.monto_total), 0)) * 100)::float as margen_porcentaje,
                    ((sum(f.monto_descuento) / nullif(sum(f.monto_subtotal), 0)) * 100)::float as descuento_porcentaje
                from fact_ventas f
                join dim_plato p on p.id_plato = f.id_plato
                group by p.categoria
                order by ventas_totales desc
                """
            )
        )

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
    if get_storage_mode() == "postgres":
        return _round_records(
            read_sql_dataframe(
                """
                select
                    l.id_local,
                    l.local,
                    sum(f.monto_total)::float as ventas_totales,
                    count(f.id_venta)::int as pedidos,
                    (sum(f.monto_total) / nullif(count(f.id_venta), 0))::float as ticket_promedio,
                    sum(f.margen_bruto)::float as margen_bruto,
                    ((sum(f.margen_bruto) / nullif(sum(f.monto_total), 0)) * 100)::float as margen_porcentaje,
                    sum(f.monto_descuento)::float as descuentos
                from fact_ventas f
                join dim_local l on l.id_local = f.id_local
                group by l.id_local, l.local
                order by ventas_totales desc
                """
            )
        )

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
    if get_storage_mode() == "postgres":
        records: list[dict[str, object]] = []
        for variable in ["monto_total", "margen_bruto", "descuento"]:
            row = read_sql_dataframe(
                f"""
                select
                    '{variable}' as variable,
                    count({variable})::int as count,
                    avg({variable})::float as mean,
                    stddev_samp({variable})::float as std,
                    min({variable})::float as min,
                    percentile_cont(0.25) within group (order by {variable})::float as p25,
                    percentile_cont(0.5) within group (order by {variable})::float as p50,
                    percentile_cont(0.75) within group (order by {variable})::float as p75,
                    max({variable})::float as max
                from fact_ventas
                """
            ).iloc[0].to_dict()
            records.append(row)
        return _round_records(pd.DataFrame(records))

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
    if get_storage_mode() == "postgres":
        distribution = read_sql_dataframe(
            f"""
            with stats as (
                select min(monto_total)::float as min_value, max(monto_total)::float as max_value
                from fact_ventas
            ),
            bucketed as (
                select
                    least(width_bucket(f.monto_total, s.min_value, s.max_value, {bins}), {bins}) as bucket,
                    count(*)::int as frecuencia
                from fact_ventas f
                cross join stats s
                group by bucket
            ),
            series as (
                select generate_series(1, {bins}) as bucket
            )
            select
                (s.min_value + (series.bucket - 1) * ((s.max_value - s.min_value) / {bins}))::float as desde,
                (s.min_value + series.bucket * ((s.max_value - s.min_value) / {bins}))::float as hasta,
                coalesce(bucketed.frecuencia, 0)::int as frecuencia
            from series
            cross join stats s
            left join bucketed on bucketed.bucket = series.bucket
            order by series.bucket
            """
        )
        distribution["desde"] = distribution["desde"].round(2)
        distribution["hasta"] = distribution["hasta"].round(2)
        distribution["rango"] = distribution.apply(lambda row: f"{row['desde']:.2f} - {row['hasta']:.2f}", axis=1)
        return distribution[["rango", "desde", "hasta", "frecuencia"]].to_dict(orient="records")

    sales = load_processed_sales()
    frequencies, edges = pd.cut(sales["monto_total"], bins=bins, retbins=True, include_lowest=True)
    distribution = frequencies.value_counts().sort_index().reset_index()
    distribution.columns = ["intervalo", "frecuencia"]
    distribution["desde"] = [round(float(edges[index]), 2) for index in range(len(edges) - 1)]
    distribution["hasta"] = [round(float(edges[index + 1]), 2) for index in range(len(edges) - 1)]
    distribution["rango"] = distribution.apply(lambda row: f"{row['desde']:.2f} - {row['hasta']:.2f}", axis=1)
    return distribution[["rango", "desde", "hasta", "frecuencia"]].to_dict(orient="records")


def calculate_annual_margin() -> list[dict[str, object]]:
    if get_storage_mode() == "postgres":
        return _round_records(
            read_sql_dataframe(
                """
                select
                    anio,
                    sum(monto_total)::float as ventas_totales,
                    sum(margen_bruto)::float as margen_bruto,
                    ((sum(margen_bruto) / nullif(sum(monto_total), 0)) * 100)::float as margen_porcentaje,
                    ((sum(monto_descuento) / nullif(sum(monto_subtotal), 0)) * 100)::float as descuento_porcentaje
                from fact_ventas
                group by anio
                order by anio
                """
            )
        )

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
