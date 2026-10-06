from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class ClassBase(BaseModel):
    name: str
    description: Optional[str] = None
    teacher_id: int

    # gt=0 isn't enforced by the DB (just INT NOT NULL) — added here as
    # a basic sanity check so a class can't be created with 0 or negative
    # capacity.
    capacity: int = Field(gt=0)


class ClassCreate(ClassBase):
    """Shape of the JSON body for POST /classes."""
    pass


class ClassUpdate(BaseModel):
    """
    Shape of the JSON body for PUT /classes/{class_id}.
    All fields optional — only what the client sends gets updated.
    """
    name: Optional[str] = None
    description: Optional[str] = None
    teacher_id: Optional[int] = None
    capacity: Optional[int] = Field(default=None, gt=0)


class ClassResponse(ClassBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)