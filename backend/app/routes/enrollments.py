from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.class_model import ClassModel
from app.models.enrollment_model import EnrollmentModel
from app.schemas.enrollment_schema import (
    EnrollmentCreate,
    EnrollmentUpdate,
    EnrollmentResponse,
)

router = APIRouter(prefix="/enrollments", tags=["Enrollments"])


def _ensure_student_exists(db: Session, student_id: int) -> None:
    student = db.query(User).filter(User.id == student_id).first()

    if not student:
        raise HTTPException(
            status_code=400,
            detail=f"No user with id {student_id} exists.",
        )

    if student.role != UserRole.student:
        raise HTTPException(
            status_code=400,
            detail=f"User {student_id} is not a student.",
        )


def _ensure_class_exists(db: Session, class_id: int) -> ClassModel:
    class_obj = (
        db.query(ClassModel)
        .filter(ClassModel.id == class_id)
        .first()
    )

    if not class_obj:
        raise HTTPException(
            status_code=400,
            detail=f"Class with id {class_id} does not exist.",
        )

    return class_obj


def _ensure_capacity_available(
    db: Session,
    class_id: int,
    exclude_enrollment_id: int | None = None,
) -> None:
    class_obj = _ensure_class_exists(db, class_id)

    query = db.query(EnrollmentModel).filter(
        EnrollmentModel.class_id == class_id
    )

    if exclude_enrollment_id is not None:
        query = query.filter(
            EnrollmentModel.id != exclude_enrollment_id
        )

    current_count = query.count()

    if current_count >= class_obj.capacity:
        raise HTTPException(
            status_code=400,
            detail="Class capacity is full.",
        )


@router.post(
    "",
    response_model=EnrollmentResponse,
    status_code=201,
)
def create_enrollment(
    enrollment_in: EnrollmentCreate,
    db: Session = Depends(get_db),
):
    _ensure_student_exists(db, enrollment_in.student_id)
    _ensure_class_exists(db, enrollment_in.class_id)

    # Prevent the same student from enrolling in the same class twice.
    existing = (
        db.query(EnrollmentModel)
        .filter(
            EnrollmentModel.student_id == enrollment_in.student_id,
            EnrollmentModel.class_id == enrollment_in.class_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Student is already enrolled in this class.",
        )

    _ensure_capacity_available(
        db,
        enrollment_in.class_id,
    )

    new_enrollment = EnrollmentModel(
        student_id=enrollment_in.student_id,
        class_id=enrollment_in.class_id,
    )

    db.add(new_enrollment)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not create enrollment.",
        )

    db.refresh(new_enrollment)

    return new_enrollment


@router.get(
    "",
    response_model=List[EnrollmentResponse],
)
def get_enrollments(
    db: Session = Depends(get_db),
):
    return db.query(EnrollmentModel).all()


@router.get(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
)
def get_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
):
    enrollment = (
        db.query(EnrollmentModel)
        .filter(EnrollmentModel.id == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found.",
        )

    return enrollment


@router.put(
    "/{enrollment_id}",
    response_model=EnrollmentResponse,
)
def update_enrollment(
    enrollment_id: int,
    enrollment_in: EnrollmentUpdate,
    db: Session = Depends(get_db),
):
    enrollment = (
        db.query(EnrollmentModel)
        .filter(EnrollmentModel.id == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=404,
            detail="Enrollment not found.",
        )

    update_data = enrollment_in.model_dump(exclude_unset=True)

    new_student_id = update_data.get(
        "student_id",
        enrollment.student_id,
    )

    new_class_id = update_data.get(
        "class_id",
        enrollment.class_id,
    )

    _ensure_student_exists(db, new_student_id)
    _ensure_class_exists(db, new_class_id)

    # Check duplicate enrollment if student/class changes.
    existing = (
        db.query(EnrollmentModel)
        .filter(
            EnrollmentModel.student_id == new_student_id,
            EnrollmentModel.class_id == new_class_id,
            EnrollmentModel.id != enrollment_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Student is already enrolled in this class.",
        )

    # Only check capacity if the enrollment is being moved
    # to another class.
    if new_class_id != enrollment.class_id:
        _ensure_capacity_available(
            db,
            new_class_id,
            exclude_enrollment_id=enrollment_id,
        )

    for field, value in update_data.items():
        setattr(enrollment, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update enrollment.",
        )

    db.refresh(enrollment)

    return enrollment