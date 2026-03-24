from datetime import datetime
from typing import Optional

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    email: EmailStr = Field(index=True, unique=True)
    full_name: str
    hashed_password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    # Telegram bot credentials (optional)
    telegram_bot_token: Optional[str] = Field(default=None)
    telegram_chat_id: Optional[str] = Field(default=None)
    # AI provider credentials (optional)
    anthropic_api_key: Optional[str] = Field(default=None)
    openai_api_key: Optional[str] = Field(default=None)
    preferred_ai_provider: Optional[str] = Field(default=None)  # "anthropic" or "openai"
