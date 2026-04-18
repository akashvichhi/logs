from datetime import datetime, timezone
import secrets
from typing import List, Optional

from sqlalchemy.orm import Session

from app.api_keys.models import APIKey
from app.api_keys.schemas import APIKeyCreate, APIKeyOut, APIKeyWithSecret
from app.auth.models import User
from app.core.security import get_password_hash, verify_password

class APIKeyService:
    @staticmethod
    def _generate_key() -> str:
        suffix = secrets.token_urlsafe(32)[:32]
        return f"logs_{suffix}"

    @staticmethod
    def create_api_key(db: Session, user: User, data: APIKeyCreate) -> APIKeyWithSecret:
        full_key = APIKeyService._generate_key()
        prefix = full_key[:10]
        key_hash = get_password_hash(full_key)

        api_key = APIKey(
            user_id=user.id,
            name=data.name,
            key_hash=key_hash,
            prefix=prefix,
            is_active=True,
        )
        db.add(api_key)
        db.commit()
        db.refresh(api_key)

        return APIKeyWithSecret(
            id=api_key.id,
            name=api_key.name,
            prefix=api_key.prefix,
            is_active=api_key.is_active,
            created_at=api_key.created_at,
            last_used=api_key.last_used,
            full_key=full_key,
        )

    @staticmethod
    def list_api_keys(db: Session, user: User) -> List[APIKeyOut]:
        keys = (
            db.query(APIKey)
            .filter(APIKey.user_id == user.id)
            .order_by(APIKey.created_at.desc())
            .all()
        )
        return [APIKeyOut.model_validate(k) for k in keys]  # type: ignore[arg-type]

    @staticmethod
    def revoke_api_key(db: Session, user: User, api_key_id: int) -> None:
        api_key = db.query(APIKey).filter(APIKey.id == api_key_id, APIKey.user_id == user.id).first()
        if api_key is None:
            return
        db.delete(api_key)
        db.commit()

    @staticmethod
    def get_user_by_api_key(db: Session, full_key: str) -> Optional[User]:
        if not full_key:
            return None
        prefix = full_key[:10]
        api_key = (
            db.query(APIKey)
            .filter(APIKey.prefix == prefix, APIKey.is_active.is_(True))
            .first()
        )
        if api_key is None:
            return None
        if not verify_password(full_key, api_key.key_hash):
            return None
        api_key.last_used = datetime.now(timezone.utc)
        db.add(api_key)
        db.commit()
        return api_key.user

