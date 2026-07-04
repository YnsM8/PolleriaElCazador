from __future__ import annotations

import math
from functools import lru_cache

import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler

from app.schemas.model import PredictionRequest
from app.services.analytics import load_processed_sales
from app.services.repository import get_storage_mode, read_sql_dataframe


FEATURE_COLUMNS = ["anio", "mes", "id_local", "descuento_promedio", "temporada"]
TARGET_COLUMN = "ventas_totales"


def get_model_metrics() -> dict[str, object]:
    artifacts = _train_model()
    metrics = artifacts["metrics"]
    return {
        **metrics,
        "interpretacion": (
            f"El modelo explica aproximadamente {metrics['r2_porcentaje']}% de la variabilidad "
            "de las ventas mensuales por local en el set de prueba."
        ),
    }


def get_feature_importance() -> list[dict[str, object]]:
    artifacts = _train_model()
    model: Pipeline = artifacts["model"]
    feature_names = model.named_steps["preprocessor"].get_feature_names_out()
    coefficients = model.named_steps["regressor"].coef_
    importance = pd.DataFrame({"variable": feature_names, "coeficiente": coefficients})
    importance["impacto"] = importance["coeficiente"].apply(_impact_label)
    importance["coeficiente"] = importance["coeficiente"].round(2)
    return importance.sort_values("coeficiente", ascending=False).to_dict(orient="records")


def get_predictions_vs_real() -> list[dict[str, object]]:
    artifacts = _train_model()
    result = artifacts["test_data"].copy()
    result["real"] = artifacts["y_test"].to_numpy()
    result["predicho"] = artifacts["y_pred"]
    result["residuo"] = result["real"] - result["predicho"]
    result = result[["anio", "mes", "id_local", "local", "temporada", "real", "predicho", "residuo"]]
    for column in ["real", "predicho", "residuo"]:
        result[column] = result[column].round(2)
    return result.sort_values(["anio", "mes", "id_local"]).to_dict(orient="records")


def predict_sales(request: PredictionRequest) -> dict[str, object]:
    artifacts = _train_model()
    model: Pipeline = artifacts["model"]
    input_data = pd.DataFrame(
        [
            {
                "anio": request.anio,
                "mes": request.mes,
                "id_local": request.id_local,
                "descuento_promedio": request.descuento_promedio,
                "temporada": request.temporada,
            }
        ]
    )
    estimated_sales = float(model.predict(input_data)[0])
    estimated_sales = max(0.0, estimated_sales)

    return {
        "venta_estimada": round(estimated_sales, 2),
        "interpretacion": _prediction_interpretation(request, estimated_sales),
        "recomendacion_inventario": _inventory_recommendation(request, estimated_sales),
        "recomendacion_personal": _staff_recommendation(request, estimated_sales),
        "recomendacion_marketing": _marketing_recommendation(request),
    }


@lru_cache(maxsize=1)
def _train_model() -> dict[str, object]:
    monthly_sales = _build_monthly_sales()
    x = monthly_sales[FEATURE_COLUMNS]
    y = monthly_sales[TARGET_COLUMN]

    x_train, x_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

    preprocessor = ColumnTransformer(
        [
            ("cat", OneHotEncoder(drop="first", sparse_output=False, handle_unknown="ignore"), ["id_local", "temporada"]),
            ("num", StandardScaler(), ["anio", "mes", "descuento_promedio"]),
        ]
    )
    model = Pipeline(
        [
            ("preprocessor", preprocessor),
            ("regressor", LinearRegression()),
        ]
    )
    model.fit(x_train, y_train)
    y_pred = model.predict(x_test)

    mae = mean_absolute_error(y_test, y_pred)
    rmse = math.sqrt(mean_squared_error(y_test, y_pred))
    r2 = r2_score(y_test, y_pred)

    return {
        "model": model,
        "monthly_sales": monthly_sales,
        "test_data": monthly_sales.loc[x_test.index],
        "y_test": y_test,
        "y_pred": y_pred,
        "metrics": {
            "mae": round(float(mae), 2),
            "rmse": round(float(rmse), 2),
            "r2": round(float(r2), 4),
            "r2_porcentaje": round(float(r2) * 100, 2),
            "registros_entrenamiento": int(len(x_train)),
            "registros_prueba": int(len(x_test)),
        },
    }


def _build_monthly_sales() -> pd.DataFrame:
    if get_storage_mode() == "postgres":
        monthly = read_sql_dataframe(
            """
            select
                f.anio,
                f.mes,
                f.id_local,
                l.local,
                sum(f.monto_total)::float as ventas_totales,
                sum(f.monto_subtotal)::float as ventas_sin_descuento,
                sum(f.monto_descuento)::float as total_descuentos,
                count(f.id_venta)::int as numero_pedidos
            from fact_ventas f
            join dim_local l on l.id_local = f.id_local
            group by f.anio, f.mes, f.id_local, l.local
            order by f.anio, f.mes, f.id_local
            """
        )
        monthly["descuento_promedio"] = (monthly["total_descuentos"] / monthly["ventas_sin_descuento"]) * 100
        monthly["temporada"] = monthly["mes"].apply(_season_for_month)
        return monthly

    sales = load_processed_sales()
    monthly = (
        sales.groupby(["anio", "mes", "id_local", "local"])
        .agg(
            ventas_totales=("monto_total", "sum"),
            ventas_sin_descuento=("monto_subtotal", "sum"),
            total_descuentos=("monto_descuento", "sum"),
            numero_pedidos=("id_venta", "count"),
        )
        .reset_index()
    )
    monthly["descuento_promedio"] = (monthly["total_descuentos"] / monthly["ventas_sin_descuento"]) * 100
    monthly["temporada"] = monthly["mes"].apply(_season_for_month)
    return monthly


def clear_model_cache() -> None:
    _train_model.cache_clear()


def _season_for_month(month: int) -> str:
    if month in (7, 12):
        return "Alta"
    if month in (1, 2, 3):
        return "Baja"
    return "Media"


def _impact_label(coefficient: float) -> str:
    if coefficient > 0:
        return "Aumenta ventas estimadas"
    if coefficient < 0:
        return "Reduce ventas estimadas"
    return "Impacto neutro"


def _prediction_interpretation(request: PredictionRequest, estimated_sales: float) -> str:
    return (
        f"Para {request.anio}-{request.mes:02d}, local {request.id_local}, temporada {request.temporada}, "
        f"el modelo estima ventas mensuales de S/ {estimated_sales:,.2f}."
    )


def _inventory_recommendation(request: PredictionRequest, estimated_sales: float) -> str:
    if request.temporada == "Alta" or estimated_sales >= 300000:
        return "Preparar inventario alto de pollo, papas y carbon; reforzar compras antes de fines de semana."
    if estimated_sales >= 240000:
        return "Mantener inventario medio-alto y revisar rotacion semanal de insumos criticos."
    return "Planificar inventario conservador y evitar sobrestock de perecibles."


def _staff_recommendation(request: PredictionRequest, estimated_sales: float) -> str:
    if request.temporada == "Alta" or estimated_sales >= 300000:
        return "Reforzar cocina y atencion en turnos tarde y noche."
    if request.id_local == 3:
        return "Monitorear demanda del local reciente y ajustar personal por picos."
    return "Mantener dotacion base con refuerzo puntual en fines de semana."


def _marketing_recommendation(request: PredictionRequest) -> str:
    if request.descuento_promedio >= 20:
        return "Controlar descuentos para no erosionar margen; priorizar combos de alto valor."
    if request.temporada == "Baja":
        return "Activar promociones moderadas para sostener demanda sin sacrificar margen."
    return "Usar campanas locales y combos selectivos segun platos de mayor margen."
