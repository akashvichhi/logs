from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse

from app.api import api_router

app = FastAPI(title="logs")

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    print(exc.errors())  # ← add this
    print(exc.body)
    messages = []
    for error in exc.errors():
        # Pydantic model_validator raises ValueError with our custom messages
        if error["type"] == "value_error":
            import ast
            try:
                # Parse the list we stringified in the validator
                messages = ast.literal_eval(error["msg"].replace("Value error, ", ""))
            except Exception:
                messages.append(error["msg"])
        else:
            field = error["loc"][-1]
            if isinstance(field, str):
                messages.append(f"{field.capitalize()} is required")

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"messages": messages},
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"messages": [exc.detail]},
    )

origins = [
    "*",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,            # Allows specific origins
    allow_credentials=True,           # Allows cookies/auth headers
    allow_methods=["*"],              # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],              # Allows all headers
)

app.include_router(api_router)

@app.get("/")
def root() -> dict:
    return {"status": "ok"}
