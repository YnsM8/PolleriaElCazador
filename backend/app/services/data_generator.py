from __future__ import annotations

import random
from datetime import datetime, timedelta
from pathlib import Path

import numpy as np
import pandas as pd


PROJECT_ROOT = Path(__file__).resolve().parents[3]
PROCESSED_DIR = PROJECT_ROOT / "data" / "processed"
WAREHOUSE_DIR = PROJECT_ROOT / "data" / "warehouse"

RANDOM_SEED = 42
START_DATE = "2021-01-01"
END_DATE = "2026-06-01"

LOCALES = [
    {
        "id_local": 1,
        "local": "Calle Real #232",
        "factor_venta": 1.2,
        "antiguedad": "Aproximadamente 12 anos",
        "perfil": "Local matriz / consolidado",
    },
    {
        "id_local": 2,
        "local": "Avenida Huancavelica #587",
        "factor_venta": 0.9,
        "antiguedad": "Entre 6 y 8 anos",
        "perfil": "Local de crecimiento",
    },
    {
        "id_local": 3,
        "local": "Calle Real #976",
        "factor_venta": 1.1,
        "antiguedad": "Entre 3 y 5 anos",
        "perfil": "Local reciente / expansion",
    },
]

PLATOS = [
    {"id_plato": 1, "plato": "PARRILLA MIXTA", "categoria": "Parrillas", "precio_unitario": 72.0, "costo_unitario": 35.5},
    {"id_plato": 2, "plato": "PARRILLA ESPECIAL", "categoria": "Parrillas", "precio_unitario": 85.0, "costo_unitario": 42.0},
    {"id_plato": 3, "plato": "BISTEC A LA PARRILLA", "categoria": "Parrillas", "precio_unitario": 45.0, "costo_unitario": 22.0},
    {"id_plato": 4, "plato": "CHURRASCO", "categoria": "Parrillas", "precio_unitario": 55.0, "costo_unitario": 27.5},
    {"id_plato": 5, "plato": "ANTICUCHO", "categoria": "Parrillas", "precio_unitario": 38.0, "costo_unitario": 19.0},
    {"id_plato": 6, "plato": "KASLER", "categoria": "Especiales", "precio_unitario": 42.0, "costo_unitario": 18.0},
    {"id_plato": 7, "plato": "PIERNAS AL AJO", "categoria": "Especiales", "precio_unitario": 48.0, "costo_unitario": 20.0},
    {"id_plato": 8, "plato": "CHAUFA DE POLLO", "categoria": "Especiales", "precio_unitario": 24.0, "costo_unitario": 11.5},
    {"id_plato": 9, "plato": "TALLARIN SALTADO", "categoria": "Especiales", "precio_unitario": 28.0, "costo_unitario": 13.5},
    {"id_plato": 10, "plato": "POLLO BRASA 1/4", "categoria": "Brasas", "precio_unitario": 22.0, "costo_unitario": 10.5},
    {"id_plato": 11, "plato": "POLLO BRASA 1/2", "categoria": "Brasas", "precio_unitario": 32.0, "costo_unitario": 15.5},
    {"id_plato": 12, "plato": "POLLO BRASA FAMILIAR", "categoria": "Brasas", "precio_unitario": 65.0, "costo_unitario": 32.5},
    {"id_plato": 13, "plato": "1/4 POLLO + PAPA", "categoria": "Brasas", "precio_unitario": 28.0, "costo_unitario": 14.5},
    {"id_plato": 14, "plato": "BEBIDA 1L", "categoria": "Bebidas", "precio_unitario": 10.0, "costo_unitario": 3.2},
    {"id_plato": 15, "plato": "BEBIDA 2L", "categoria": "Bebidas", "precio_unitario": 15.0, "costo_unitario": 4.8},
    {"id_plato": 16, "plato": "CHICHA MORADA", "categoria": "Bebidas", "precio_unitario": 8.0, "costo_unitario": 2.5},
    {"id_plato": 17, "plato": "PAPAS FRITAS", "categoria": "Complementos", "precio_unitario": 12.0, "costo_unitario": 4.5},
    {"id_plato": 18, "plato": "ENSALADA RUSA", "categoria": "Complementos", "precio_unitario": 18.0, "costo_unitario": 6.5},
    {"id_plato": 19, "plato": "ARROZ CHAUFA", "categoria": "Complementos", "precio_unitario": 10.0, "costo_unitario": 3.8},
]

TURNOS = [
    {"id_turno": 1, "turno": "Manana", "probabilidad": 0.20},
    {"id_turno": 2, "turno": "Tarde", "probabilidad": 0.45},
    {"id_turno": 3, "turno": "Noche", "probabilidad": 0.35},
]

DAY_FACTORS = {
    "Monday": 0.70,
    "Tuesday": 0.80,
    "Wednesday": 0.85,
    "Thursday": 0.90,
    "Friday": 1.20,
    "Saturday": 1.50,
    "Sunday": 1.40,
}

HOLIDAYS = {
    "2021-01-01", "2021-04-01", "2021-04-02", "2021-05-01", "2021-06-29", "2021-07-28", "2021-07-29", "2021-08-30", "2021-10-08", "2021-11-01", "2021-12-08", "2021-12-25",
    "2022-01-01", "2022-04-14", "2022-04-15", "2022-05-01", "2022-06-29", "2022-07-28", "2022-07-29", "2022-08-30", "2022-10-08", "2022-11-01", "2022-12-08", "2022-12-25",
    "2023-01-01", "2023-04-06", "2023-04-07", "2023-05-01", "2023-06-29", "2023-07-28", "2023-07-29", "2023-08-30", "2023-10-08", "2023-11-01", "2023-12-08", "2023-12-25",
    "2024-01-01", "2024-03-28", "2024-03-29", "2024-05-01", "2024-06-29", "2024-07-28", "2024-07-29", "2024-08-30", "2024-10-08", "2024-11-01", "2024-12-08", "2024-12-25",
    "2025-01-01", "2025-04-17", "2025-04-18", "2025-05-01", "2025-06-29", "2025-07-28", "2025-07-29", "2025-08-30", "2025-10-08", "2025-11-01", "2025-12-08", "2025-12-25",
    "2026-01-01", "2026-04-02", "2026-04-03", "2026-05-01",
}


def temporada_for_month(month: int) -> str:
    if month in (7, 12):
        return "Alta"
    if month in (1, 2, 3):
        return "Baja"
    return "Media"


def ensure_data_dirs() -> None:
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    WAREHOUSE_DIR.mkdir(parents=True, exist_ok=True)


def generate_sales() -> pd.DataFrame:
    np.random.seed(RANDOM_SEED)
    random.seed(RANDOM_SEED)

    current_date = datetime.strptime(START_DATE, "%Y-%m-%d")
    end_date = datetime.strptime(END_DATE, "%Y-%m-%d")
    sales: list[list[object]] = []
    sale_id = 1
    base_orders = 330

    while current_date <= end_date:
        date_text = current_date.strftime("%Y-%m-%d")
        day_name = current_date.strftime("%A")
        month = current_date.month
        year = current_date.year
        is_holiday = 1 if date_text in HOLIDAYS else 0

        demand_factor = DAY_FACTORS[day_name]
        demand_factor *= 1.0 + (year - 2021) * 0.08

        if temporada_for_month(month) == "Alta":
            demand_factor *= 1.3
        elif temporada_for_month(month) == "Baja":
            demand_factor *= 0.85

        if is_holiday:
            demand_factor *= 1.4

        daily_orders = int(np.random.normal(base_orders * demand_factor, base_orders * 0.12 * demand_factor))
        daily_orders = max(80, min(700, daily_orders))

        for location in LOCALES:
            location_orders = int(daily_orders * location["factor_venta"] / 3.2)
            location_orders = max(15, location_orders)

            for shift in TURNOS:
                shift_orders = max(1, int(location_orders * shift["probabilidad"]))

                if year >= 2025:
                    discount_probability = 0.70
                    discounts = [0.0, 0.15, 0.25]
                    discount_weights = [0.3, 0.4, 0.3]
                else:
                    discount_probability = 0.30
                    discounts = [0.0, 0.10, 0.15]
                    discount_weights = [0.7, 0.2, 0.1]

                for _ in range(shift_orders):
                    if day_name in ("Friday", "Saturday", "Sunday"):
                        dish_weights = [0.10, 0.07, 0.06, 0.05, 0.04, 0.05, 0.04, 0.04, 0.04, 0.05, 0.05, 0.08, 0.04, 0.02, 0.02, 0.02, 0.02, 0.01, 0.01]
                    else:
                        dish_weights = [0.06, 0.04, 0.04, 0.03, 0.03, 0.06, 0.05, 0.06, 0.05, 0.08, 0.07, 0.10, 0.06, 0.02, 0.02, 0.02, 0.03, 0.02, 0.02]

                    dish_weights_array = np.array(dish_weights) / sum(dish_weights)
                    dish = np.random.choice(PLATOS, p=dish_weights_array)

                    if dish["categoria"] in ("Parrillas", "Brasas"):
                        quantity = int(np.random.choice([1, 2, 3, 4], p=[0.4, 0.35, 0.15, 0.10]))
                    else:
                        quantity = int(np.random.choice([1, 2, 3], p=[0.6, 0.3, 0.1]))

                    has_discount = np.random.random() < discount_probability
                    discount = float(np.random.choice(discounts, p=discount_weights)) if has_discount else 0.0

                    unit_price = float(dish["precio_unitario"])
                    total_cost = float(dish["costo_unitario"]) * quantity
                    subtotal = unit_price * quantity
                    discount_amount = subtotal * discount
                    total_amount = subtotal - discount_amount
                    gross_margin = total_amount - total_cost

                    sales.append(
                        [
                            sale_id,
                            date_text,
                            year,
                            month,
                            location["id_local"],
                            location["local"],
                            shift["id_turno"],
                            shift["turno"],
                            day_name,
                            is_holiday,
                            temporada_for_month(month),
                            dish["id_plato"],
                            dish["plato"],
                            dish["categoria"],
                            quantity,
                            round(unit_price, 2),
                            round(total_cost, 2),
                            round(discount, 3),
                            round(subtotal, 2),
                            round(discount_amount, 2),
                            round(total_amount, 2),
                            round(gross_margin, 2),
                        ]
                    )
                    sale_id += 1

        current_date += timedelta(days=1)

    columns = [
        "id_venta",
        "fecha",
        "anio",
        "mes",
        "id_local",
        "local",
        "id_turno",
        "turno",
        "dia_semana",
        "es_feriado",
        "temporada",
        "id_plato",
        "plato",
        "categoria",
        "cantidad",
        "precio_unitario",
        "costo_total",
        "descuento",
        "monto_subtotal",
        "monto_descuento",
        "monto_total",
        "margen_bruto",
    ]
    return pd.DataFrame(sales, columns=columns)


def build_dimensions(fact_sales: pd.DataFrame) -> dict[str, pd.DataFrame]:
    dates = pd.date_range(START_DATE, END_DATE, freq="D")
    dim_fecha = pd.DataFrame({"fecha": dates})
    dim_fecha["id_fecha"] = dim_fecha["fecha"].dt.strftime("%Y%m%d").astype(int)
    dim_fecha["fecha"] = dim_fecha["fecha"].dt.strftime("%Y-%m-%d")
    dim_fecha["anio"] = pd.to_datetime(dim_fecha["fecha"]).dt.year
    dim_fecha["mes"] = pd.to_datetime(dim_fecha["fecha"]).dt.month
    dim_fecha["dia"] = pd.to_datetime(dim_fecha["fecha"]).dt.day
    dim_fecha["dia_semana"] = pd.to_datetime(dim_fecha["fecha"]).dt.day_name()
    dim_fecha["es_feriado"] = dim_fecha["fecha"].isin(HOLIDAYS).astype(int)
    dim_fecha["temporada"] = dim_fecha["mes"].apply(temporada_for_month)

    dim_local = pd.DataFrame(LOCALES)[["id_local", "local", "antiguedad", "perfil", "factor_venta"]]
    dim_plato = pd.DataFrame(PLATOS)
    dim_turno = pd.DataFrame(TURNOS)

    fact_ventas = fact_sales.copy()
    fact_ventas["id_fecha"] = fact_ventas["fecha"].str.replace("-", "", regex=False).astype(int)
    fact_ventas = fact_ventas[
        [
            "id_venta",
            "id_fecha",
            "fecha",
            "anio",
            "mes",
            "id_local",
            "id_turno",
            "id_plato",
            "cantidad",
            "precio_unitario",
            "costo_total",
            "descuento",
            "monto_subtotal",
            "monto_descuento",
            "monto_total",
            "margen_bruto",
            "es_feriado",
            "temporada",
        ]
    ]

    return {
        "fact_ventas": fact_ventas,
        "dim_fecha": dim_fecha,
        "dim_local": dim_local,
        "dim_plato": dim_plato,
        "dim_turno": dim_turno,
    }


def generate_datasets() -> dict[str, object]:
    ensure_data_dirs()

    sales = generate_sales()
    platos = pd.DataFrame(PLATOS)

    sales.to_csv(PROCESSED_DIR / "ventas_cazador.csv", index=False)
    platos.to_csv(PROCESSED_DIR / "platos_cazador.csv", index=False)

    warehouse_tables = build_dimensions(sales)
    for table_name, table_df in warehouse_tables.items():
        table_df.to_csv(WAREHOUSE_DIR / f"{table_name}.csv", index=False)

    return {
        "message": "Datos generados correctamente",
        "ventas_rows": int(len(sales)),
        "periodo": f"{START_DATE} a {END_DATE}",
        "processed_files": ["ventas_cazador.csv", "platos_cazador.csv"],
        "warehouse_files": [f"{name}.csv" for name in warehouse_tables],
    }


def warehouse_file(name: str) -> Path:
    return WAREHOUSE_DIR / f"{name}.csv"


def processed_file(name: str) -> Path:
    return PROCESSED_DIR / name
