from datetime import datetime, timezone
from typing import List, Tuple

from sqlalchemy import and_, or_
from sqlalchemy.orm import Session

from app.auth.models import User
from app.logs.models import Log
from app.logs.schemas import LogIngest, LogOut, LogSearchParams, LogSearchResponse


class LogService:
    @staticmethod
    def _normalize_level(level: str | None) -> str | None:
        if level is None:
            return None
        level_upper = level.upper()
        if level_upper == "WARNING":
            return "WARN"
        return level_upper

    @staticmethod
    def ingest_log(db: Session, user: User, data: LogIngest) -> LogOut:
        level = LogService._normalize_level(data.level) if data.level is not None else None
        timestamp = data.timestamp or datetime.now(timezone.utc)

        log = Log(
            user_id=user.id,
            level=level,
            service=data.service,
            message=data.message,
            metadata=data.metadata,
            timestamp=timestamp,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return LogOut.model_validate(log)  # type: ignore[arg-type]

    @staticmethod
    def _build_query_filters(params: LogSearchParams) -> Tuple:
        filters = []

        if params.level:
            filters.append(Log.level == LogService._normalize_level(params.level))

        if params.service:
            filters.append(Log.service == params.service)

        if params.from_:
            filters.append(Log.timestamp >= params.from_)

        if params.to:
            filters.append(Log.timestamp <= params.to)

        if params.query:
            text = params.query
            conditions = []
            if " OR " in text:
                parts = [p.strip() for p in text.split(" OR ") if p.strip()]
                for part in parts:
                    conditions.append(Log.message.ilike(f"%{part}%"))
                if conditions:
                    filters.append(or_(*conditions))
            elif " AND " in text:
                parts = [p.strip() for p in text.split(" AND ") if p.strip()]
                for part in parts:
                    filters.append(Log.message.ilike(f"%{part}%"))
            else:
                words = [w for w in text.split() if w]
                for word in words:
                    filters.append(Log.message.ilike(f"%{word}%"))

        return tuple(filters)

    @staticmethod
    def search_logs(db: Session, user: User, params: LogSearchParams) -> LogSearchResponse:
        page = max(params.page, 1)
        limit = min(max(params.limit, 1), 500)

        base_query = db.query(Log).filter(Log.user_id == user.id)

        filters = LogService._build_query_filters(params)
        if filters:
            base_query = base_query.filter(and_(*filters))

        total = base_query.count()

        items = (
            base_query.order_by(Log.timestamp.desc())
            .offset((page - 1) * limit)
            .limit(limit)
            .all()
        )

        results: List[LogOut] = [LogOut.model_validate(item) for item in items]  # type: ignore[arg-type]

        return LogSearchResponse(total=total, page=page, limit=limit, results=results)

