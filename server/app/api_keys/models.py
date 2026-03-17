from datetime import datetime

from sqlalchemy import Boolean, Column, DateTime, ForeignKey, Integer, String, Index
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.core.database import Base

class APIKey(Base):
    __tablename__ = "api_keys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    key_hash = Column(String(255), nullable=False)
    prefix = Column(String(10), nullable=False, index=True)
    is_active = Column(Boolean, nullable=False, server_default="true", default=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), default=datetime.utcnow)
    last_used = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", backref="api_keys")

    __table_args__ = (
        Index("ix_api_keys_prefix", "prefix"),
        Index("ix_api_keys_user_id", "user_id"),
    )
