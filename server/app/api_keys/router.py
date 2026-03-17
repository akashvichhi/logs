from typing import Annotated, List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api_keys.schemas import APIKeyCreate, APIKeyOut, APIKeyWithSecret
from app.api_keys.service import APIKeyService
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.core.database import get_db

router = APIRouter()

@router.post("", response_model=APIKeyWithSecret)
def create_api_key(
    data: APIKeyCreate,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return APIKeyService.create_api_key(db, current_user, data)

@router.get("", response_model=List[APIKeyOut])
def list_api_keys(
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return APIKeyService.list_api_keys(db, current_user)

@router.delete("/{api_key_id}", status_code=204)
def revoke_api_key(
    api_key_id: int,
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    APIKeyService.revoke_api_key(db, current_user, api_key_id)
    return None
