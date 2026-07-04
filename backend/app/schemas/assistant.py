from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="Pregunta del usuario.")


class ChatResponse(BaseModel):
    answer: str
    category: str
    suggested_questions: list[str]
