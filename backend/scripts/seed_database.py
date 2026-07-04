from __future__ import annotations

import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app.services.data_generator import generate_datasets
from app.services.warehouse import apply_schema, seed_postgres


def main() -> None:
    parser = argparse.ArgumentParser(description="Carga el modelo estrella en PostgreSQL/Supabase.")
    parser.add_argument(
        "--replace",
        action="store_true",
        help="TRUNCA y reemplaza datos existentes. Usar solo con confirmacion explicita.",
    )
    args = parser.parse_args()

    generate_datasets()
    apply_schema()
    seed_postgres(replace=args.replace)
    print("Datos cargados correctamente en PostgreSQL.")


if __name__ == "__main__":
    main()
