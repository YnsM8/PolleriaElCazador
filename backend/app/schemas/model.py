from pydantic import BaseModel, ConfigDict, Field


class PredictionRequest(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    anio: int = Field(..., alias="año", ge=2021, le=2030, description="Anio de prediccion.")
    mes: int = Field(..., ge=1, le=12, description="Mes de prediccion.")
    id_local: int = Field(..., ge=1, le=3, description="Identificador del local.")
    descuento_promedio: float = Field(..., ge=0, le=100, description="Descuento promedio porcentual.")
    temporada: str = Field(..., description="Temporada: Alta, Media o Baja.")
