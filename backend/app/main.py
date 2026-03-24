from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from app.auth import (
    authenticate_user,
    create_access_token,
    create_refresh_token,
    get_current_user,
    get_password_hash,
    verify_refresh_token,
)
from app.config import settings
from app.database import create_db_and_tables, get_session
from app.models import User
from app.schemas import (
    MessageResponse,
    RefreshTokenRequest,
    TelegramSettings,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.telegram_service import TelegramService

app = FastAPI(title=settings.app_name)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    create_db_and_tables()


@app.get("/health", response_model=MessageResponse)
def healthcheck() -> MessageResponse:
    return MessageResponse(message="API is healthy")


@app.post(
    "/auth/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED
)
def register_user(
    payload: UserRegister, session: Session = Depends(get_session)
) -> UserResponse:
    existing_user = session.exec(
        select(User).where(User.email == payload.email)
    ).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered",
        )

    try:
        user = User(
            email=payload.email,
            full_name=payload.full_name,
            hashed_password=get_password_hash(payload.password),
        )
        session.add(user)
        session.commit()
        session.refresh(user)
        return UserResponse(id=user.id, email=user.email, full_name=user.full_name)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@app.post("/auth/login", response_model=TokenResponse)
def login_user(
    payload: UserLogin, session: Session = Depends(get_session)
) -> TokenResponse:
    user = authenticate_user(session, payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password"
        )

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@app.post("/auth/refresh", response_model=TokenResponse)
def refresh_access_token(
    payload: RefreshTokenRequest, session: Session = Depends(get_session)
) -> TokenResponse:
    email = verify_refresh_token(payload.refresh_token)
    if not email:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token"
        )

    user = session.exec(select(User).where(User.email == email)).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found"
        )

    access_token = create_access_token(user.email)
    refresh_token = create_refresh_token(user.email)
    return TokenResponse(access_token=access_token, refresh_token=refresh_token)


@app.get("/auth/me", response_model=UserResponse)
def read_current_user(current_user: User = Depends(get_current_user)) -> UserResponse:
    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        telegram_bot_token=current_user.telegram_bot_token,
        telegram_chat_id=current_user.telegram_chat_id,
    )


@app.post("/auth/telegram", response_model=UserResponse)
def set_telegram_settings(
    payload: TelegramSettings,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> UserResponse:
    """Store user's Telegram bot credentials"""
    current_user.telegram_bot_token = payload.telegram_bot_token
    current_user.telegram_chat_id = payload.telegram_chat_id
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        telegram_bot_token=current_user.telegram_bot_token,
        telegram_chat_id=current_user.telegram_chat_id,
    )


@app.get("/auth/telegram", response_model=MessageResponse)
def check_telegram_settings(
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    """Check if user has configured Telegram bot"""
    is_configured = bool(
        current_user.telegram_bot_token and current_user.telegram_chat_id
    )
    return MessageResponse(
        message=f"Telegram configured: {is_configured}"
    )
