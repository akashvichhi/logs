from functools import lru_cache
from urllib.parse import quote_plus

from pydantic import Field
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    postgres_user: str = Field(..., alias="POSTGRES_USER")
    postgres_password: str = Field(..., alias="POSTGRES_PASSWORD")
    postgres_db: str = Field(..., alias="POSTGRES_DB")
    postgres_host: str = Field("postgres", alias="POSTGRES_HOST")
    postgres_port: int = Field(5432, alias="POSTGRES_PORT")

    secret_key: str = Field(..., alias="SECRET_KEY")
    jwt_algorithm: str = Field("HS256", alias="JWT_ALGORITHM")
    jwt_expire_hours: int = Field(24, alias="JWT_EXPIRE_HOURS")

    first_admin_username: str = Field("admin", alias="FIRST_ADMIN_USERNAME")
    first_admin_password: str = Field("admin123", alias="FIRST_ADMIN_PASSWORD")
    first_admin_email: str = Field("admin@example.com", alias="FIRST_ADMIN_EMAIL")

    @property
    def database_url(self) -> str:
        password = quote_plus(self.postgres_password)
        return (
            f"postgresql+psycopg2://{self.postgres_user}:{password}"
            f"@{self.postgres_host}:{self.postgres_port}/{self.postgres_db}"
        )

    class Config:
        extra = "ignore"

@lru_cache
def get_settings() -> Settings:
    return Settings()  # type: ignore[arg-type]

settings = get_settings()
