from sqlalchemy import Column, Integer, String, Text, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class ClassModel(Base):
    __tablename__ = "classes"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)

    # References users.id. The DB does not check that this user is
    # actually a teacher (a plain FK can't express that) — that check
    # is done in routes/classes.py before every insert/update.
    teacher_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    capacity = Column(Integer, nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now())