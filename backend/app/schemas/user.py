from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, ConfigDict

from app.models.user import UserRole


class UserBase(BaseModel):
    name: str
    registration_number: Optional[str] = str
    email: Optional[EmailStr] = None
    role: UserRole


class UserCreate(UserBase):
    """Shape of the JSON body for POST /users."""

    password: Optional[str] = None


class UserUpdate(BaseModel):
    """
    Shape of the JSON body for PUT /users/{user_id}.

    Every field is optional. Only fields provided by the client
    will be updated.
    """

    name: Optional[str] = None
    registration_number: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    role: Optional[UserRole] = None


class UserResponse(UserBase):
    """
    Shape of a user object returned to the client.

    password_hash and profile_photo are intentionally excluded.
    """

    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)