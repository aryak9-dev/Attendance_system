from datetime import date, datetime, time
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import UserRole, WeekDay


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


class UserCreate(BaseModel):
    name: str = Field(max_length=100)
    registration_number: str = Field(max_length=50)
    email: EmailStr
    password: str = Field(min_length=1)
    role: UserRole


class UserUpdate(BaseModel):
    name: str | None = Field(default=None, max_length=100)
    registration_number: str | None = Field(default=None, max_length=50)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=1)
    role: UserRole | None = None


class UserRead(ORMModel):
    id: int
    name: str
    registration_number: str | None
    email: str | None
    role: UserRole
    created_at: datetime | None


class ClassCreate(BaseModel):
    name: str = Field(max_length=100)
    description: str | None = None
    teacher_id: int
    capacity: int = Field(gt=0)


class ClassRead(ORMModel):
    id: int
    name: str
    description: str | None
    teacher_id: int
    capacity: int
    created_at: datetime | None


class SlotCreate(BaseModel):
    day: WeekDay
    start_time: time
    end_time: time


class SlotRead(ORMModel):
    id: int
    class_id: int
    day: WeekDay
    start_time: time
    end_time: time


class EnrollmentCreate(BaseModel):
    student_id: int
    class_id: int


class EnrollmentRead(ORMModel):
    id: int
    student_id: int
    class_id: int
    enrolled_at: datetime | None


class AttendanceCreate(BaseModel):
    enrollment_id: int
    slot_id: int
    date: date
    status: Literal["present", "absent"]


class AttendanceRead(ORMModel):
    id: int
    enrollment_id: int
    slot_id: int
    date: date
    status: Literal["present", "absent"]
