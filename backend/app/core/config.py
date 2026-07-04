from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


BACKEND_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BACKEND_DIR / ".env", encoding="utf-8-sig")


def get_database_url() -> str | None:
    value = os.getenv("DATABASE_URL", "").strip()
    return value or None


def has_database_url() -> bool:
    return get_database_url() is not None


def get_cors_origins() -> list[str]:
    value = os.getenv("BACKEND_CORS_ORIGINS", "").strip()
    if value:
        return [origin.strip() for origin in value.split(",") if origin.strip()]
    return [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]
