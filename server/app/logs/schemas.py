from datetime import datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field

class LogIngest(BaseModel):
    level: Optional[str] = None
    service: Optional[str] = None
    message: str
    metadata: Optional[Dict[str, Any]] = None
    timestamp: Optional[datetime] = None

class LogOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    timestamp: datetime
    level: Optional[str] = None
    service: Optional[str] = None
    message: str
    # The ORM attribute is named `extra` (metadata is reserved by SQLAlchemy).
    # validation_alias makes Pydantic read `log.extra` when validating from ORM
    # objects, while the serialised JSON field name remains `metadata`.
    metadata: Optional[Dict[str, Any]] = Field(default=None, validation_alias="extra")
    created_at: datetime

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
