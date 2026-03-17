from datetime import datetime, timezone
from typing import Optional

from sqlalchemy.orm import Session

from app.auth import schemas
from app.auth.models import User
from app.core.config import settings
from app.core.security import create_access_token, get_password_hash, verify_password
from app.core.database import SessionLocal

class AuthService:
    @staticmethod
    def get_user_by_username(db: Session, username: str) -> Optional[User]:
        return db.query(User).filter(User.username == username).first()
    
    @staticmethod
    def get_user_by_email(db: Session, email: str) -> Optional[User]:
        return db.query(User).filter(User.email == email).first()

    @staticmethod
    def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
        return db.query(User).filter(User.id == user_id).first()

    @staticmethod
    def create_user(db: Session, user_in: schemas.UserCreate) -> User:
        hashed_password = get_password_hash(user_in.password)
        user = User(
            username=user_in.username,
            email=user_in.email,
            password_hash=hashed_password,
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)
        return user

    @staticmethod
    def authenticate_user(db: Session, username: str, password: str) -> Optional[User]:
        user = AuthService.get_user_by_username(db, username)
        if not user:
            return None
        if not verify_password(password, user.password_hash):
            return None
        if not user.is_active:
            return None
        return user

    @staticmethod
    def create_access_token_for_user(user: User) -> str:
        return create_access_token({"sub": str(user.id)})


def seed_initial_admin() -> None:
    db: Session = SessionLocal()
    try:
        has_any_user = db.query(User.id).first() is not None
        if has_any_user:
            return

        admin = User(
            username=settings.first_admin_username,
            email=settings.first_admin_email,
            password_hash=get_password_hash(settings.first_admin_password),
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        db.add(admin)
        db.commit()
    finally:
        db.close()

