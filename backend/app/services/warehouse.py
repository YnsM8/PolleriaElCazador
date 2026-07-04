from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException
from sqlalchemy import text
from sqlalchemy.engine import Connection

from app.services.database import check_database_connection, get_engine, require_engine
from app.services.data_generator import generate_datasets, warehouse_file
from app.services.repository import (
    WAREHOUSE_TABLES,
    clear_repository_cache,
    get_orphan_counts,
    get_schema_metadata,
    get_storage_mode,
    get_table_counts,
)


PROJECT_ROOT = Path(__file__).resolve().parents[3]
MIGRATION_FILE = PROJECT_ROOT / "supabase" / "migrations" / "001_create_star_schema.sql"


def get_warehouse_status() -> dict[str, object]:
    database = check_database_connection()
    if get_engine() is not None and not database["ok"]:
        return {
            "mode": "postgres",
            "database_url_configured": database["configured"],
            "database_connection": database,
            "tables": {table: 0 for table in WAREHOUSE_TABLES},
            "orphan_counts": {},
            "ready": False,
        }

    counts = get_table_counts()
    orphan_counts = get_orphan_counts() if any(counts.values()) else {}
    return {
        "mode": get_storage_mode(),
        "database_url_configured": get_engine() is not None,
        "database_connection": database,
        "tables": counts,
        "orphan_counts": orphan_counts,
        "ready": all(counts.get(table, 0) > 0 for table in WAREHOUSE_TABLES) and not any(orphan_counts.values()),
    }


def get_warehouse_schema() -> dict[str, object]:
    return {
        "mode": get_storage_mode(),
        "tables": get_schema_metadata(),
    }


def rebuild_warehouse(confirm_replace: bool = False) -> dict[str, object]:
    generated = generate_datasets()
    engine = get_engine()
    if engine is None:
        return {
            **generated,
            "mode": "csv",
            "message": "Warehouse local CSV regenerado correctamente.",
        }

    if not confirm_replace:
        raise HTTPException(
            status_code=409,
            detail="DATABASE_URL esta configurado. Reintenta con confirm_replace=true para reemplazar datos del warehouse PostgreSQL.",
        )

    apply_schema()
    seed_postgres(replace=True)
    return {
        "mode": "postgres",
        "message": "Warehouse PostgreSQL reconstruido correctamente.",
        "tables": get_table_counts(),
        "orphan_counts": get_orphan_counts(),
    }


def apply_schema() -> None:
    engine = require_engine()
    sql = MIGRATION_FILE.read_text(encoding="utf-8")
    statements = [statement.strip() for statement in sql.split(";") if statement.strip()]
    with engine.begin() as connection:
        for statement in statements:
            connection.execute(text(statement))


def seed_postgres(replace: bool = False) -> None:
    engine = require_engine()
    table_order = ["dim_fecha", "dim_local", "dim_plato", "dim_turno", "fact_ventas"]

    if replace:
        with engine.begin() as connection:
            connection.execute(text("truncate table fact_ventas, dim_fecha, dim_local, dim_plato, dim_turno restart identity cascade"))

    for table in table_order:
        with engine.begin() as connection:
            _copy_csv_to_postgres(connection, table, warehouse_file(table))
    _clear_analysis_caches()


def _copy_csv_to_postgres(connection: Connection, table: str, path: Path) -> None:
    with path.open("r", encoding="utf-8", newline="") as source:
        header = source.readline().strip()
        source.seek(0)
        columns = ", ".join(f'"{column}"' for column in header.split(","))
        statement = f'copy "{table}" ({columns}) from stdin with (format csv, header true)'
        driver_connection = connection.connection.driver_connection
        with driver_connection.cursor() as cursor:
            with cursor.copy(statement) as copy:
                while chunk := source.read(1024 * 1024):
                    copy.write(chunk)


def _clear_analysis_caches() -> None:
    clear_repository_cache()
    try:
        from app.services.clustering import clear_cluster_cache
        from app.services.regression import clear_model_cache
    except ImportError:
        return
    clear_cluster_cache()
    clear_model_cache()
