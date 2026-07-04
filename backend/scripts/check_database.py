from __future__ import annotations

import json
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / "backend"))

from app.services.warehouse import get_warehouse_schema, get_warehouse_status


def main() -> None:
    result = {
        "status": get_warehouse_status(),
        "schema": get_warehouse_schema(),
    }
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == "__main__":
    main()
