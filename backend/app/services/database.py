from __future__ import annotations

from functools import lru_cache

from sqlalchemy import create_engine
from sqlalchemy.engine import Engine

from app.core.config import get_database_url


@lru_cache(maxsize=1)
def get_engine() -> Engine | None:
    database_url = get_database_url()
    if not database_url:
        return None
    return create_engine(database_url, pool_pre_ping=True)


def require_engine() -> Engine:
    engine = get_engine()
    if engine is None:
        raise RuntimeError("DATABASE_URL no esta configurado.")
    return engine
