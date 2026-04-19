from datetime import datetime

from pydantic import BaseModel, EmailStr, model_validator

class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserOut(UserBase):
    id: int
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class ChangePasswordIn(BaseModel):
    current_password: str
    new_password: str

    @model_validator(mode="after")
    def validate_password_complexity(self) -> "ChangePasswordIn":
        if len(self.new_password) < 8:
            raise ValueError("New password must be at least 8 characters long.")
        return self


class ChangePasswordOut(BaseModel):
    message: str = "Password changed successfully."
