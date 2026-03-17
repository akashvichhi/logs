from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, Field

class LogIngest(BaseModel):
    level: Optional[str] = None
    service: Optional[str] = None
    message: str
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[datetime] = None

class LogOut(BaseModel):
    id: int
    timestamp: datetime
    level: Optional[str] = None
    service: Optional[str] = None
    message: str
    metadata: Optional[Dict[str, Any]] = None
    created_at: datetime

    class Config:
        from_attributes = True

class LogSearchParams(BaseModel):
    query: Optional[str] = None
    from_: Optional[datetime] = Field(default=None, alias="from")
    to: Optional[datetime] = None
    level: Optional[str] = None
    service: Optional[str] = None
    page: int = 1
    limit: int = 50

    class Config:
        populate_by_name = True

class LogSearchResponse(BaseModel):
    total: int
    page: int
    limit: int
    results: List[LogOut]
