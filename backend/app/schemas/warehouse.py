from pydantic import BaseModel


class WarehouseRebuildRequest(BaseModel):
    confirm_replace: bool = False
