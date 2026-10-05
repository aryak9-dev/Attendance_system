import os
from collections.abc import Generator
from pathlib import Path

from dotenv import load_dotenv
from fastapi import HTTPException
from sqlalchemy import create_engine
from sqlalchemy.engine import Engine, URL
from sqlalchemy.orm import Session, sessionmaker

load_dotenv()

_engine: Engine | None = None
_session_factory: sessionmaker[Session] | None = None


def _create_demo_session_factory() -> sessionmaker[Session]:
    from sqlalchemy import select

    from app.mock_data import seed_mock_data
    from app.models import Base, User

    database_path = (
        Path(__file__).resolve().parents[2]
        / "database"
        / "attendance_demo.db"
    )
    database_path.parent.mkdir(parents=True, exist_ok=True)
    engine = create_engine(URL.create("sqlite", database=str(database_path)))
    Base.metadata.create_all(engine)
    factory = sessionmaker(bind=engine, autoflush=False, expire_on_commit=False)
    with factory() as session:
        has_seed_data = session.scalar(select(User.id).limit(1)) is not None
    if not has_seed_data:
        seed_mock_data(factory)
    return factory


def get_session_factory() -> sessionmaker[Session]:
    global _engine, _session_factory

    if _session_factory is not None:
        return _session_factory

    if os.getenv("USE_MOCK_DATA", "").lower() == "true":
        _session_factory = _create_demo_session_factory()
        return _session_factory

    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise HTTPException(
            status_code=503,
            detail="Database is not configured. Set DATABASE_URL in backend/.env.",
        )

    _engine = create_engine(database_url, pool_pre_ping=True)
    _session_factory = sessionmaker(
        bind=_engine,
        autoflush=False,
        expire_on_commit=False,
    )
    return _session_factory


def get_db() -> Generator[Session, None, None]:
    session = get_session_factory()()
    try:
        yield session
    finally:
        session.close()
