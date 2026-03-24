from typing import Optional
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


class MessageResponse(BaseModel):
    message: str


class TelegramSettings(BaseModel):
    telegram_bot_token: str = Field(min_length=10)
    telegram_chat_id: str
