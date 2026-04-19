from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.auth import schemas
from app.auth.dependencies import get_current_user
from app.auth.models import User
from app.auth.service import AuthService
from app.core.database import get_db

router = APIRouter()

@router.post("/register", response_model=schemas.UserOut, status_code=status.HTTP_201_CREATED)
def register(user_in: schemas.UserCreate, db: Annotated[Session, Depends(get_db)]):
    existing_user_error = AuthService.check_user_exists(db, user_in.username, user_in.email)
    
    if existing_user_error:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=existing_user_error
        )
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


@router.patch("/me/password", response_model=schemas.ChangePasswordOut)
def change_password(
    payload: schemas.ChangePasswordIn,
    db: Annotated[Session, Depends(get_db)],
    current_user: Annotated[User, Depends(get_current_user)],
) -> schemas.ChangePasswordOut:
    AuthService.change_password(
        db=db,
        user=current_user,
        current_password=payload.current_password,
        new_password=payload.new_password,
    )
    return schemas.ChangePasswordOut()
