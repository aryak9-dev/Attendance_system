import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Reads the .env file (if present) and loads its variables into the
# process environment, so os.getenv() below can see DATABASE_URL.
load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not set. Copy .env.example to .env and fill in "
        "your local PostgreSQL connection string."
    )

# The engine manages the connection pool to PostgreSQL. Creating it does
# NOT connect immediately — the connection happens on first query.
engine = create_engine(DATABASE_URL)

# Factory for creating new DB sessions. One session is created per request
# (see get_db below) and closed again once the request finishes.
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# All SQLAlchemy models inherit from this Base class.
#
# IMPORTANT: We deliberately never call Base.metadata.create_all().
# The database structure already exists via database/schema.sql, which is
# the single source of truth. SQLAlchemy is only used here to talk to
# tables that already exist, not to create them.
Base = declarative_base()


def get_db():
    """
    FastAPI dependency that hands each request its own DB session and
    guarantees it gets closed afterward, even if the request raises
    an error. Routes use it like:

        def some_route(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()