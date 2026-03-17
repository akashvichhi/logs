from datetime import datetime
from typing import Optional

from pydantic import BaseModel

class APIKeyCreate(BaseModel):
    name: str

class APIKeyOut(BaseModel):
    id: int
    name: str
    prefix: str
    is_active: bool
    created_at: datetime
    last_used: Optional[datetime] = None

    class Config:
        from_attributes = True

class APIKeyWithSecret(APIKeyOut):
    full_key: str
