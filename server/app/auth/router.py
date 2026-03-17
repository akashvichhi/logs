from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import schemas
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.auth.service import AuthService
from app.core.database import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.UserOut)
def register(user_in: schemas.UserCreate, db: Annotated[Session, Depends(get_db)]):
    existingUsername = AuthService.get_user_by_username(db, user_in.username)
    existingEmail = AuthService.get_user_by_email(db, user_in.email)
    if existingUsername:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already registered")
    if existingEmail:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")
    user = AuthService.create_user(db, user_in)
    return user


@router.post("/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Annotated[Session, Depends(get_db)]):
    user = AuthService.authenticate_user(db, user_in.username, user_in.password)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password")
    token = AuthService.create_access_token_for_user(user)
    return schemas.Token(access_token=token)


@router.get("/me", response_model=schemas.UserOut)
def read_me(current_user: Annotated[User, Depends(get_current_user)]):
    return current_user
