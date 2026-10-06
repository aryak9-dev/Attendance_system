from datetime import datetime
from typing import Optional

from pydantic import BaseModel, ConfigDict


class EnrollmentBase(BaseModel):
    student_id: int
    class_id: int


class EnrollmentCreate(EnrollmentBase):
    """Shape of the JSON body for POST /enrollments."""
    pass


class EnrollmentUpdate(BaseModel):
    """
    Shape of the JSON body for PUT /enrollments/{enrollment_id}.
    """
    student_id: Optional[int] = None
    class_id: Optional[int] = None


class EnrollmentResponse(EnrollmentBase):
    id: int
    enrolled_at: datetime

    model_config = ConfigDict(from_attributes=True)