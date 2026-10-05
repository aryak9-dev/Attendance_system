import logging

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy.exc import SQLAlchemyError

from app.routers import attendance, classes, enrollments, slots, users

logger = logging.getLogger(__name__)

app = FastAPI(title="AttendAI API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router)
app.include_router(classes.router)
app.include_router(slots.router)
app.include_router(enrollments.router)
app.include_router(attendance.router)


@app.exception_handler(SQLAlchemyError)
async def database_error_handler(
    request: Request,
    exc: SQLAlchemyError,
) -> JSONResponse:
    logger.exception("Database request failed for %s", request.url.path, exc_info=exc)
    return JSONResponse(
        status_code=503,
        content={"detail": "Database unavailable. Check DATABASE_URL and PostgreSQL."},
    )


@app.get("/")
def healthcheck() -> dict[str, str]:
    return {"status": "ok", "message": "AttendAI API is running"}
