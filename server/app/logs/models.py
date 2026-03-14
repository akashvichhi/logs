from datetime import datetime

from sqlalchemy import BigInteger, Column, DateTime, ForeignKey, Integer, String, Text, Index
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.sql import func

from app.core.database import Base


class Log(Base):
    __tablename__ = "logs"

    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    timestamp = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), default=datetime.utcnow)
    level = Column(String(10), nullable=True, index=True)
    service = Column(String(255), nullable=True, index=True)
    message = Column(Text, nullable=False)
    extra = Column("metadata", JSONB, nullable=True)
    created_at = Column(DateTime(timezone=True), nullable=False, server_default=func.now(), default=datetime.utcnow)

    __table_args__ = (
        Index("ix_logs_user_id", "user_id"),
        Index("ix_logs_timestamp", "timestamp"),
        Index("ix_logs_level", "level"),
        Index("ix_logs_service", "service"),
    )

