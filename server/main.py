from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api import api_router
from app.auth.service import seed_initial_admin


@asynccontextmanager
async def lifespan(app: FastAPI):
    seed_initial_admin()
    yield


app = FastAPI(title="logs", lifespan=lifespan)

app.include_router(api_router)


@app.get("/")
def root() -> dict:
    return {"status": "ok"}

