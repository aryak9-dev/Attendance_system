from datetime import date as Date
from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.models.attendance_model import AttendanceStatus


class AttendanceBase(BaseModel):
    enrollment_id: int
    slot_id: int
    date: date
    status: AttendanceStatus


class AttendanceCreate(AttendanceBase):
    """Shape of the JSON body for POST /attendance."""
    pass


class AttendanceUpdate(BaseModel):
    """
    Shape of the JSON body for PUT /attendance/{attendance_id}.
    All fields are optional.
    """
    enrollment_id: Optional[int] = None
    slot_id: Optional[int] = None
    date: Optional[Date] = None
    status: Optional[AttendanceStatus] = None


class AttendanceResponse(AttendanceBase):
    id: int

    model_config = ConfigDict(from_attributes=True)