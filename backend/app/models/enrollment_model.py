from sqlalchemy import Column, Integer, TIMESTAMP, ForeignKey
from sqlalchemy.sql import func

from app.database import Base


class EnrollmentModel(Base):
    __tablename__ = "enrollments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    student_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    class_id = Column(
        Integer,
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
    )

    enrolled_at = Column(
        TIMESTAMP,
        server_default=func.now(),
    )