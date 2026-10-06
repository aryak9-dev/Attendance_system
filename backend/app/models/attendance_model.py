import enum

from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy import Enum as SqlEnum

from app.database import Base


class AttendanceStatus(str, enum.Enum):
    present = "present"
    absent = "absent"


class AttendanceModel(Base):
    __tablename__ = "attendance"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    enrollment_id = Column(
        Integer,
        ForeignKey("enrollments.id", ondelete="CASCADE"),
        nullable=False,
    )

    slot_id = Column(
        Integer,
        ForeignKey("slots.id", ondelete="CASCADE"),
        nullable=False,
    )

    date = Column(
        Date,
        nullable=False,
    )

    status = Column(
        SqlEnum(
            AttendanceStatus,
            name="attendance_status",
            create_type=False,
        ),
        nullable=False,
    )