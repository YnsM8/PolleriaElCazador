from __future__ import annotations

from functools import lru_cache
from pathlib import Path

import pandas as pd
from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.engine import Engine

from app.services.database import get_engine, require_engine
from app.services.data_generator import processed_file, warehouse_file


DIMENSION_TABLES = ["dim_fecha", "dim_local", "dim_plato", "dim_turno"]
WAREHOUSE_TABLES = [*DIMENSION_TABLES, "fact_ventas"]


def get_storage_mode() -> str:
    return "postgres" if get_engine() is not None else "csv"


def load_fact_sales() -> pd.DataFrame:
    return _load_fact_sales_cached()


def load_locations() -> pd.DataFrame:
    return _load_locations_cached()


def load_processed_sales() -> pd.DataFrame:
    return _load_processed_sales_cached()


def clear_repository_cache() -> None:
    _load_fact_sales_cached.cache_clear()
    _load_locations_cached.cache_clear()
    _load_processed_sales_cached.cache_clear()


def read_sql_dataframe(query: str) -> pd.DataFrame:
    return pd.read_sql_query(text(query), require_engine())


@lru_cache(maxsize=1)
def _load_fact_sales_cached() -> pd.DataFrame:
    engine = get_engine()
    if engine is not None:
        return _read_sql(engine, "select * from fact_ventas")
    return _read_csv_or_404(warehouse_file("fact_ventas"), "fact_ventas.csv")


@lru_cache(maxsize=1)
def _load_locations_cached() -> pd.DataFrame:
    engine = get_engine()
    if engine is not None:
        return _read_sql(engine, "select * from dim_local")
    return _read_csv_or_404(warehouse_file("dim_local"), "dim_local.csv")


@lru_cache(maxsize=1)
def _load_processed_sales_cached() -> pd.DataFrame:
    engine = get_engine()
    if engine is not None:
        return _read_sql(
            engine,
            """
            select
                f.id_venta,
                f.fecha::text as fecha,
                f.anio,
                f.mes,
                f.id_local,
                l.local,
                f.id_turno,
                t.turno,
                df.dia_semana,
                f.es_feriado::int as es_feriado,
                f.temporada,
                f.id_plato,
                p.plato,
                p.categoria,
                f.cantidad,
                f.precio_unitario,
                f.costo_total,
                f.descuento,
                f.monto_subtotal,
                f.monto_descuento,
                f.monto_total,
                f.margen_bruto
            from fact_ventas f
            join dim_local l on l.id_local = f.id_local
            join dim_turno t on t.id_turno = f.id_turno
            join dim_plato p on p.id_plato = f.id_plato
            join dim_fecha df on df.id_fecha = f.id_fecha
            """,
        )
    return _read_csv_or_404(processed_file("ventas_cazador.csv"), "ventas_cazador.csv")


def get_table_counts() -> dict[str, int]:
    engine = get_engine()
    if engine is not None:
        with engine.connect() as connection:
            return {
                table: int(connection.execute(text(f"select count(*) from {table}")).scalar_one())
                for table in WAREHOUSE_TABLES
            }

    counts: dict[str, int] = {}
    for table in WAREHOUSE_TABLES:
        path = warehouse_file(table)
        counts[table] = int(len(pd.read_csv(path))) if path.exists() else 0
    return counts


def get_schema_metadata() -> dict[str, list[dict[str, object]]]:
    engine = get_engine()
    if engine is not None:
        return _postgres_schema_metadata(engine)
    return _csv_schema_metadata()


def get_orphan_counts() -> dict[str, int]:
    engine = get_engine()
    if engine is not None:
        queries = {
            "missing_dim_fecha": "select count(*) from fact_ventas f left join dim_fecha d on d.id_fecha = f.id_fecha where d.id_fecha is null",
            "missing_dim_local": "select count(*) from fact_ventas f left join dim_local d on d.id_local = f.id_local where d.id_local is null",
            "missing_dim_plato": "select count(*) from fact_ventas f left join dim_plato d on d.id_plato = f.id_plato where d.id_plato is null",
            "missing_dim_turno": "select count(*) from fact_ventas f left join dim_turno d on d.id_turno = f.id_turno where d.id_turno is null",
        }
        with engine.connect() as connection:
            return {
                name: int(connection.execute(text(query)).scalar_one())
                for name, query in queries.items()
            }

    fact = load_fact_sales()
    return {
        "missing_dim_fecha": int((~fact["id_fecha"].isin(_read_csv_or_404(warehouse_file("dim_fecha"), "dim_fecha.csv")["id_fecha"])).sum()),
        "missing_dim_local": int((~fact["id_local"].isin(load_locations()["id_local"])).sum()),
        "missing_dim_plato": int((~fact["id_plato"].isin(_read_csv_or_404(warehouse_file("dim_plato"), "dim_plato.csv")["id_plato"])).sum()),
        "missing_dim_turno": int((~fact["id_turno"].isin(_read_csv_or_404(warehouse_file("dim_turno"), "dim_turno.csv")["id_turno"])).sum()),
    }


def _read_sql(engine: Engine, query: str) -> pd.DataFrame:
    return pd.read_sql_query(text(query), engine)


def _read_csv_or_404(path: Path, friendly_name: str) -> pd.DataFrame:
    if not path.exists():
        raise HTTPException(
            status_code=404,
            detail=f"{friendly_name} no existe. Ejecuta POST /api/data/generate primero.",
        )
    return pd.read_csv(path)


def _postgres_schema_metadata(engine: Engine) -> dict[str, list[dict[str, object]]]:
    query = """
        select table_name, column_name, data_type, is_nullable
        from information_schema.columns
        where table_schema = 'public'
          and table_name = any(:tables)
        order by table_name, ordinal_position
    """
    dataframe = pd.read_sql_query(text(query), engine, params={"tables": WAREHOUSE_TABLES})
    return {
        table: dataframe[dataframe["table_name"] == table]
        .drop(columns=["table_name"])
        .to_dict(orient="records")
        for table in WAREHOUSE_TABLES
    }


def _csv_schema_metadata() -> dict[str, list[dict[str, object]]]:
    metadata: dict[str, list[dict[str, object]]] = {}
    for table in WAREHOUSE_TABLES:
        path = warehouse_file(table)
        if not path.exists():
            metadata[table] = []
            continue
        dataframe = pd.read_csv(path, nrows=10)
        metadata[table] = [
            {"column_name": column, "data_type": str(dtype), "is_nullable": "YES"}
            for column, dtype in dataframe.dtypes.items()
        ]
    return metadata
