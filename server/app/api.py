from fastapi import APIRouter

from app.auth.router import router as auth_router
from app.api_keys.router import router as api_keys_router
from app.logs.router import router as logs_router

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth_router, prefix="/auth", tags=["auth"])
api_router.include_router(api_keys_router, prefix="/api-keys", tags=["api-keys"])
api_router.include_router(logs_router, prefix="/logs", tags=["logs"])
