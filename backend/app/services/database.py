from __future__ import annotations

from functools import lru_cache

from sqlalchemy import create_engine, text
from sqlalchemy.engine import Engine
from sqlalchemy.pool import NullPool

from app.core.config import get_database_url


@lru_cache(maxsize=1)
def get_engine() -> Engine | None:
    database_url = get_database_url()
    if not database_url:
        return None
    return create_engine(
        database_url,
        pool_pre_ping=True,
        poolclass=NullPool,
        connect_args={"connect_timeout": 10},
    )


def require_engine() -> Engine:
    engine = get_engine()
    if engine is None:
        raise RuntimeError("DATABASE_URL no esta configurado.")
    return engine


def check_database_connection() -> dict[str, object]:
    engine = get_engine()
    if engine is None:
        return {
            "configured": False,
            "ok": False,
            "error": "DATABASE_URL no esta configurado en el entorno del backend.",
        }

    try:
        with engine.connect() as connection:
            connection.execute(text("select 1")).scalar_one()
        return {
            "configured": True,
            "ok": True,
            "error": None,
        }
    except Exception as exc:
        return {
            "configured": True,
            "ok": False,
            "error": f"{type(exc).__name__}: {str(exc).splitlines()[0]}",
        }
