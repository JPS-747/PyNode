from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class UserRegister(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=100)
    password: str = Field(min_length=8, max_length=72)


class UserLogin(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=72)


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    telegram_bot_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None
    preferred_ai_provider: Optional[str] = None


class MessageResponse(BaseModel):
    message: str


class TelegramSettings(BaseModel):
    telegram_bot_token: str = Field(min_length=10)
    telegram_chat_id: str


class AISettings(BaseModel):
    preferred_ai_provider: str = Field(min_length=1, max_length=20)  # "anthropic" or "openai"
    anthropic_api_key: Optional[str] = None
    openai_api_key: Optional[str] = None


class AITestMessage(BaseModel):
    message: str = Field(min_length=1, max_length=5000)


class QuestionCreate(BaseModel):
    question: str = Field(min_length=1, max_length=10000)


class QuestionResponse(BaseModel):
    id: int
    user_id: int
    question: str
    answer: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
