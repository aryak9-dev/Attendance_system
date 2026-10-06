import enum

from sqlalchemy import Column, Integer, Time, ForeignKey
from sqlalchemy import Enum as SqlEnum

from app.database import Base


class WeekDay(str, enum.Enum):
    Monday = "Monday"
    Tuesday = "Tuesday"
    Wednesday = "Wednesday"
    Thursday = "Thursday"
    Friday = "Friday"
    Saturday = "Saturday"
    Sunday = "Sunday"


class SlotModel(Base):
    __tablename__ = "slots"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    class_id = Column(
        Integer,
        ForeignKey("classes.id", ondelete="CASCADE"),
        nullable=False,
    )

    day = Column(
        SqlEnum(
            WeekDay,
            name="week_day",
            create_type=False,
        ),
        nullable=False,
    )

    start_time = Column(
        Time,
        nullable=False,
    )

    end_time = Column(
        Time,
        nullable=False,
    )