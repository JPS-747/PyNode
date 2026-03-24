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
from app.models import User, Question, DatabaseSkill
from app.schemas import (
    AISettings,
    AITestMessage,
    MessageResponse,
    QuestionCreate,
    QuestionResponse,
    CreateDatabaseSkill,
    DatabaseSkillResponse,
    TestDatabaseSkill,
    TestDatabaseSkillResponse,
    RefreshTokenRequest,
    TelegramSettings,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from app.telegram_service import TelegramService
from app.ai_service import AIService

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


@app.post("/auth/telegram/test", response_model=MessageResponse)
async def send_test_telegram_message(
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    """Send a test message to user's Telegram bot"""
    if not current_user.telegram_bot_token or not current_user.telegram_chat_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Telegram bot not configured. Please set it up first.",
        )

    telegram = TelegramService(
        bot_token=current_user.telegram_bot_token,
        chat_id=current_user.telegram_chat_id,
    )

    try:
        await telegram.send_message(
            f"✅ <b>Test Message Successful!</b>\n\n"
            f"Your Telegram bot is correctly configured.\n"
            f"<b>User:</b> {current_user.full_name}\n"
            f"<b>Email:</b> {current_user.email}"
        )
        return MessageResponse(message="Test message sent successfully to your Telegram bot!")
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send test message: {str(e)}",
        )


@app.post("/auth/ai", response_model=UserResponse)
def set_ai_settings(
    payload: AISettings,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> UserResponse:
    """Store user's AI provider credentials"""
    if payload.preferred_ai_provider == "anthropic":
        if not payload.anthropic_api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Anthropic API key is required for Anthropic provider",
            )
        current_user.anthropic_api_key = payload.anthropic_api_key
    elif payload.preferred_ai_provider == "openai":
        if not payload.openai_api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="OpenAI API key is required for OpenAI provider",
            )
        current_user.openai_api_key = payload.openai_api_key
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid AI provider. Must be 'anthropic' or 'openai'",
        )

    current_user.preferred_ai_provider = payload.preferred_ai_provider
    session.add(current_user)
    session.commit()
    session.refresh(current_user)

    return UserResponse(
        id=current_user.id,
        email=current_user.email,
        full_name=current_user.full_name,
        anthropic_api_key=current_user.anthropic_api_key,
        openai_api_key=current_user.openai_api_key,
        preferred_ai_provider=current_user.preferred_ai_provider,
    )


@app.get("/auth/ai", response_model=MessageResponse)
def check_ai_settings(
    current_user: User = Depends(get_current_user),
) -> MessageResponse:
    """Check if user has configured an AI provider"""
    is_configured = bool(
        current_user.preferred_ai_provider
        and (
            (
                current_user.preferred_ai_provider == "anthropic"
                and current_user.anthropic_api_key
            )
            or (
                current_user.preferred_ai_provider == "openai"
                and current_user.openai_api_key
            )
        )
    )
    return MessageResponse(message=f"AI configured: {is_configured}")


@app.post("/auth/ai/test", response_model=MessageResponse)
async def send_test_ai_message(
    payload: AITestMessage, current_user: User = Depends(get_current_user)
) -> MessageResponse:
    """Send a test message to the configured AI provider"""
    if not current_user.preferred_ai_provider:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="AI provider not configured. Please set it up first.",
        )

    try:
        ai = AIService(
            provider=current_user.preferred_ai_provider,
            anthropic_api_key=current_user.anthropic_api_key,
            openai_api_key=current_user.openai_api_key,
        )

        response = await ai.chat(payload.message)
        return MessageResponse(message=response)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to get AI response: {str(e)}",
        )


# Q&A Endpoints
@app.post("/api/questions", response_model=QuestionResponse)
async def ask_question(
    question_data: QuestionCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> QuestionResponse:
    """Ask a question and get a response from the AI."""
    try:
        # Check if user has AI configured
        if not current_user.anthropic_api_key and not current_user.openai_api_key:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="AI not configured. Please set up AI settings first.",
            )

        # Initialize AI service with user's keys
        ai_service = AIService(
            provider=current_user.preferred_ai_provider or "anthropic",
            anthropic_api_key=current_user.anthropic_api_key,
            openai_api_key=current_user.openai_api_key,
        )

        # Get AI response
        answer = await ai_service.chat(question_data.question)

        # Save to database
        db_question = Question(
            user_id=current_user.id,
            question=question_data.question,
            answer=answer,
        )
        session.add(db_question)
        session.commit()
        session.refresh(db_question)

        return QuestionResponse(
            id=db_question.id,
            user_id=db_question.user_id,
            question=db_question.question,
            answer=db_question.answer,
            created_at=db_question.created_at,
            updated_at=db_question.updated_at,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to process question: {str(e)}",
        )


@app.get("/api/questions", response_model=list[QuestionResponse])
def get_questions(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[QuestionResponse]:
    """Get all questions and answers for the current user."""
    try:
        questions = session.exec(
            select(Question).where(Question.user_id == current_user.id)
        ).all()
        
        return [
            QuestionResponse(
                id=q.id,
                user_id=q.user_id,
                question=q.question,
                answer=q.answer,
                created_at=q.created_at,
                updated_at=q.updated_at,
            )
            for q in questions
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve questions: {str(e)}",
        )


# Database Skills Endpoints
@app.post("/api/database-skills", response_model=DatabaseSkillResponse)
def create_database_skill(
    skill_data: CreateDatabaseSkill,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> DatabaseSkillResponse:
    """Create a new database skill."""
    try:
        db_skill = DatabaseSkill(
            user_id=current_user.id,
            skill_name=skill_data.skill_name,
            db_type=skill_data.db_type,
            tables=skill_data.tables,
            queries=skill_data.queries,
        )
        session.add(db_skill)
        session.commit()
        session.refresh(db_skill)

        return DatabaseSkillResponse(
            id=db_skill.id,
            user_id=db_skill.user_id,
            skill_name=db_skill.skill_name,
            db_type=db_skill.db_type,
            tables=db_skill.tables,
            queries=db_skill.queries,
            created_at=db_skill.created_at,
            updated_at=db_skill.updated_at,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create database skill: {str(e)}",
        )


@app.get("/api/database-skills", response_model=list[DatabaseSkillResponse])
def get_database_skills(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> list[DatabaseSkillResponse]:
    """Get all database skills for the current user."""
    try:
        skills = session.exec(
            select(DatabaseSkill).where(DatabaseSkill.user_id == current_user.id)
        ).all()

        return [
            DatabaseSkillResponse(
                id=s.id,
                user_id=s.user_id,
                skill_name=s.skill_name,
                db_type=s.db_type,
                tables=s.tables,
                queries=s.queries,
                created_at=s.created_at,
                updated_at=s.updated_at,
            )
            for s in skills
        ]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to retrieve database skills: {str(e)}",
        )


@app.post("/api/database-skills/{skill_id}/test", response_model=TestDatabaseSkillResponse)
def test_database_skill(
    skill_id: int,
    test_data: TestDatabaseSkill,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
) -> TestDatabaseSkillResponse:
    """Test execute a query on a database skill."""
    try:
        skill = session.exec(
            select(DatabaseSkill).where(
                (DatabaseSkill.id == skill_id) & (DatabaseSkill.user_id == current_user.id)
            )
        ).first()

        if not skill:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Database skill not found",
            )

        # Simple query execution (in production, use proper database connection)
        # For now, return a mock result
        result = f"Query executed on {skill.db_type} database.\nTables: {skill.tables}\n\nTest Query: {test_data.test_query}\n\nNote: This is a mock result. Implement actual database connection for real queries."

        return TestDatabaseSkillResponse(result=result)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to test database skill: {str(e)}",
        )
