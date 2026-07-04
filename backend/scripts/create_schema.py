from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app.services.warehouse import apply_schema


def main() -> None:
    apply_schema()
    print("Schema creado/verificado correctamente.")


if __name__ == "__main__":
    main()
