from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Class, Enrollment, User, UserRole
from app.schemas import ClassCreate, ClassRead, UserRead

router = APIRouter(tags=["classes"])


@router.get("/classes", response_model=list[ClassRead])
def get_classes(db: Session = Depends(get_db)) -> list[Class]:
    return list(db.scalars(select(Class).order_by(Class.id)))


@router.get("/classes/{class_id}", response_model=ClassRead)
def get_class(class_id: int, db: Session = Depends(get_db)) -> Class:
    class_record = db.get(Class, class_id)
    if class_record is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return class_record


@router.post("/classes", response_model=ClassRead, status_code=201)
def create_class(class_data: ClassCreate, db: Session = Depends(get_db)) -> Class:
    teacher = db.get(User, class_data.teacher_id)
    if teacher is None or teacher.role != UserRole.teacher:
        raise HTTPException(status_code=400, detail="Teacher does not exist")

    class_record = Class(**class_data.model_dump())
    db.add(class_record)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to create class") from exc
    db.refresh(class_record)
    return class_record


@router.put("/classes/{class_id}", response_model=ClassRead)
def update_class(
    class_id: int,
    class_data: ClassCreate,
    db: Session = Depends(get_db),
) -> Class:
    class_record = db.get(Class, class_id)
    if class_record is None:
        raise HTTPException(status_code=404, detail="Class not found")

    teacher = db.get(User, class_data.teacher_id)
    if teacher is None or teacher.role != UserRole.teacher:
        raise HTTPException(status_code=400, detail="Teacher does not exist")

    for field, value in class_data.model_dump().items():
        setattr(class_record, field, value)
    db.commit()
    db.refresh(class_record)
    return class_record


@router.get("/classes/{class_id}/students", response_model=list[UserRead])
def get_class_students(
    class_id: int,
    db: Session = Depends(get_db),
) -> list[User]:
    if db.get(Class, class_id) is None:
        raise HTTPException(status_code=404, detail="Class not found")
    statement = (
        select(User)
        .join(Enrollment, Enrollment.student_id == User.id)
        .where(Enrollment.class_id == class_id, User.role == UserRole.student)
        .order_by(User.id)
    )
    return list(db.scalars(statement))
