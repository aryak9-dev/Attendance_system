from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])


@router.post("", response_model=UserResponse, status_code=201)
def create_user(user_in: UserCreate, db: Session = Depends(get_db)):
    new_user = User(
        name=user_in.name,
        registration_number=user_in.registration_number,
        email=user_in.email,
        role=user_in.role,
        # Stored as plain text per current project decision — see the
        # note on password_hash in models/user.py.
        password_hash=user_in.password,
    )

    db.add(new_user)
    try:
        db.commit()
    except IntegrityError:
        # Most likely cause: email or registration_number UNIQUE violation.
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A user with this email or registration number already exists.",
        )

    db.refresh(new_user)
    return new_user


@router.get("", response_model=List[UserResponse])
def get_users(db: Session = Depends(get_db)):
    return db.query(User).all()



@router.get(
    "/registration/{registration_number}",
    response_model=UserResponse,
)
def get_user_by_registration_number(
    registration_number: str,
    db: Session = Depends(get_db),
):
    user = (
        db.query(User)
        .filter(User.registration_number == registration_number)
        .first()
    )

    if not user:
        raise HTTPException(
            status_code=404,
            detail="User with this registration number not found.",
        )

    return user



@router.get("/{user_id}", response_model=UserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_user(user_id: int, user_in: UserUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    # exclude_unset=True means: only include fields the client actually
    # sent in the request body. This is what makes partial updates work.
    update_data = user_in.model_dump(exclude_unset=True)

    # The Pydantic field is called "password" but the DB column is
    # "password_hash" — map the name across before the generic loop below.
    # Stored as plain text per current project decision (see models/user.py).
    if "password" in update_data:
        user.password_hash = update_data.pop("password")

    for field, value in update_data.items():
        setattr(user, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="A user with this email or registration number already exists.",
        )

    db.refresh(user)
    return user