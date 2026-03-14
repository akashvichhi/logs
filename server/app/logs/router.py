from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api_keys.dependencies import get_user_by_api_key
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.core.database import get_db
from app.logs.schemas import LogIngest, LogOut, LogSearchParams, LogSearchResponse
from app.logs.service import LogService

router = APIRouter()


@router.post("/ingest", response_model=LogOut)
def ingest_log(
    payload: LogIngest,
    owner: Annotated[User, Depends(get_user_by_api_key)],
    db: Annotated[Session, Depends(get_db)],
):
    return LogService.ingest_log(db, owner, payload)


@router.get("/search", response_model=LogSearchResponse)
def search_logs(
    params: Annotated[LogSearchParams, Depends()],
    current_user: Annotated[User, Depends(get_current_user)],
    db: Annotated[Session, Depends(get_db)],
):
    return LogService.search_logs(db, current_user, params)

