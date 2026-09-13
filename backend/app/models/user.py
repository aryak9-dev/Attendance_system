import enum

from sqlalchemy import Column, Integer, String, LargeBinary, TIMESTAMP
from sqlalchemy import Enum as SqlEnum
from sqlalchemy.sql import func

from app.database import Base


class UserRole(str, enum.Enum):
    """
    Mirrors the PostgreSQL ENUM defined in schema.sql:

        CREATE TYPE user_role AS ENUM ('student', 'teacher');
    """
    student = "student"
    teacher = "teacher"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)

    registration_number = Column(
        String(50),
        unique=True,
        nullable=True,
    )

    name = Column(
        String(100),
        nullable=False,
    )

    email = Column(
        String(150),
        unique=True,
        nullable=True,
    )

    # Never store plain-text passwords.
    password_hash = Column(
        String(255),
        nullable=True,
    )

    # PostgreSQL already has this ENUM type.
    role = Column(
        SqlEnum(
            UserRole,
            name="user_role",
            create_type=False,
        ),
        nullable=False,
    )

    # PostgreSQL BYTEA
    profile_photo = Column(
        LargeBinary,
        nullable=True,
    )

    created_at = Column(
        TIMESTAMP,
        server_default=func.now(),
    )