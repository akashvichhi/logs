from datetime import datetime, timedelta, timezone
from typing import Any, Dict, Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def _truncate_for_bcrypt(password: str) -> str:
    """
    Bcrypt only supports passwords up to 72 bytes.
    Truncate longer passwords in a deterministic way.
    """
    raw = password.encode("utf-8")
    if len(raw) <= 72:
        return password
    truncated = raw[:72]
    return truncated.decode("utf-8", errors="ignore")


def get_password_hash(password: str) -> str:
    safe_password = _truncate_for_bcrypt(password)
    return pwd_context.hash(safe_password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    safe_password = _truncate_for_bcrypt(plain_password)
    return pwd_context.verify(safe_password, hashed_password)

def create_access_token(data: Dict[str, Any], expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + (
        expires_delta if expires_delta is not None else timedelta(hours=settings.jwt_expire_hours)
    )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.secret_key, algorithm=settings.jwt_algorithm)
    return encoded_jwt

def decode_access_token(token: str) -> Optional[Dict[str, Any]]:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return payload
    except JWTError:
        return None
