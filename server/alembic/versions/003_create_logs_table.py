from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision: str = "003_create_logs_table"
down_revision: Union[str, None] = "002_create_api_keys_table"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Ensure pg_trgm extension exists for GIN index on text column
    op.execute("CREATE EXTENSION IF NOT EXISTS pg_trgm")

    op.create_table(
        "logs",
        sa.Column("id", sa.BigInteger, primary_key=True),
        sa.Column("user_id", sa.Integer, sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column(
            "timestamp",
            postgresql.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
        sa.Column("level", sa.String(length=10), nullable=True),
        sa.Column("service", sa.String(length=255), nullable=True),
        sa.Column("message", sa.Text, nullable=False),
        sa.Column("metadata", postgresql.JSONB, nullable=True),
        sa.Column(
            "created_at",
            postgresql.TIMESTAMP(timezone=True),
            nullable=False,
            server_default=sa.text("CURRENT_TIMESTAMP"),
        ),
    )

    op.create_index("ix_logs_user_id", "logs", ["user_id"])
    op.create_index("ix_logs_timestamp", "logs", ["timestamp"])
    op.create_index("ix_logs_level", "logs", ["level"])
    op.create_index("ix_logs_service", "logs", ["service"])
    op.create_index(
        "ix_logs_message_gin",
        "logs",
        ["message"],
        postgresql_using="gin",
        postgresql_ops={"message": "gin_trgm_ops"},
    )
    op.create_index("ix_logs_metadata_gin", "logs", ["metadata"], postgresql_using="gin")

def downgrade() -> None:
    op.drop_index("ix_logs_metadata_gin", table_name="logs")
    op.drop_index("ix_logs_message_gin", table_name="logs")
    op.drop_index("ix_logs_service", table_name="logs")
    op.drop_index("ix_logs_level", table_name="logs")
    op.drop_index("ix_logs_timestamp", table_name="logs")
    op.drop_index("ix_logs_user_id", table_name="logs")
    op.drop_table("logs")
