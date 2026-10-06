from datetime import time
from typing import Optional

from pydantic import BaseModel, ConfigDict, field_validator

from app.models.slot_model import WeekDay


class SlotBase(BaseModel):
    class_id: int
    day: WeekDay
    start_time: time
    end_time: time

    @field_validator("end_time")
    @classmethod
    def validate_end_time(cls, end_time: time, info):
        start_time = info.data.get("start_time")

        if start_time is not None and end_time <= start_time:
            raise ValueError("end_time must be after start_time")

        return end_time


class SlotCreate(SlotBase):
    """Shape of the JSON body for POST /slots."""
    pass


class SlotUpdate(BaseModel):
    """Shape of the JSON body for PUT /slots/{slot_id}."""

    class_id: Optional[int] = None
    day: Optional[WeekDay] = None
    start_time: Optional[time] = None
    end_time: Optional[time] = None


class SlotResponse(SlotBase):
    id: int

    model_config = ConfigDict(from_attributes=True)