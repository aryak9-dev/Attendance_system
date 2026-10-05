from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User
from app.schemas import UserCreate, UserRead, UserUpdate
from app.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])


@router.get("", response_model=list[UserRead])
def get_users(db: Session = Depends(get_db)) -> list[User]:
    return list(db.scalars(select(User).order_by(User.id)))


@router.get("/registration/{registration_number}", response_model=UserRead)
def get_user_by_registration_number(
    registration_number: str,
    db: Session = Depends(get_db),
) -> User:
    user = db.scalar(
        select(User).where(
            User.registration_number == registration_number.strip().upper()
        )
    )
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.get("/{user_id}", response_model=UserRead)
def get_user(user_id: int, db: Session = Depends(get_db)) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user


@router.post("", response_model=UserRead, status_code=201)
def create_user(user_data: UserCreate, db: Session = Depends(get_db)) -> User:
    user = User(
        name=user_data.name,
        registration_number=user_data.registration_number.strip().upper(),
        email=str(user_data.email),
        password_hash=hash_password(user_data.password),
        role=user_data.role,
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Registration number or email already exists",
        ) from exc
    db.refresh(user)
    return user


@router.put("/{user_id}", response_model=UserRead)
def update_user(
    user_id: int,
    user_data: UserUpdate,
    db: Session = Depends(get_db),
) -> User:
    user = db.get(User, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")

    updates = user_data.model_dump(exclude_unset=True)
    for field, value in updates.items():
        if value is None:
            continue
        if field == "registration_number":
            value = value.strip().upper()
        elif field == "email":
            value = str(value)
        elif field == "password":
            field = "password_hash"
            value = hash_password(value)
        setattr(user, field, value)

    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Registration number or email already exists",
        ) from exc
    db.refresh(user)
    return user
