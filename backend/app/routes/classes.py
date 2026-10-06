from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.class_model import ClassModel
from app.models.user import User, UserRole
from app.schemas.class_schema import ClassCreate, ClassUpdate, ClassResponse

router = APIRouter(prefix="/classes", tags=["Classes"])


def _ensure_teacher_exists(db: Session, teacher_id: int) -> None:
    """
    schema.sql only guarantees teacher_id points at *some* row in users —
    it can't express "and that row must have role='teacher'". So we check
    that ourselves before letting a create/update through.
    """
    teacher = db.query(User).filter(User.id == teacher_id).first()
    if not teacher:
        raise HTTPException(status_code=400, detail=f"No user with id {teacher_id} exists.")
    if teacher.role != UserRole.teacher:
        raise HTTPException(
            status_code=400,
            detail=f"User {teacher_id} is not a teacher (role is '{teacher.role.value}').",
        )


@router.post("", response_model=ClassResponse, status_code=201)
def create_class(class_in: ClassCreate, db: Session = Depends(get_db)):
    _ensure_teacher_exists(db, class_in.teacher_id)

    new_class = ClassModel(
        name=class_in.name,
        description=class_in.description,
        teacher_id=class_in.teacher_id,
        capacity=class_in.capacity,
    )
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class


@router.get("", response_model=List[ClassResponse])
def get_classes(db: Session = Depends(get_db)):
    return db.query(ClassModel).all()


@router.get("/{class_id}", response_model=ClassResponse)
def get_class(class_id: int, db: Session = Depends(get_db)):
    class_obj = db.query(ClassModel).filter(ClassModel.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found.")
    return class_obj


@router.put("/{class_id}", response_model=ClassResponse)
def update_class(class_id: int, class_in: ClassUpdate, db: Session = Depends(get_db)):
    class_obj = db.query(ClassModel).filter(ClassModel.id == class_id).first()
    if not class_obj:
        raise HTTPException(status_code=404, detail="Class not found.")

    update_data = class_in.model_dump(exclude_unset=True)

    if "teacher_id" in update_data:
        _ensure_teacher_exists(db, update_data["teacher_id"])

    for field, value in update_data.items():
        setattr(class_obj, field, value)

    db.commit()
    db.refresh(class_obj)
    return class_obj