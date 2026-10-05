from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Class, Enrollment, User, UserRole
from app.schemas import EnrollmentCreate, EnrollmentRead

router = APIRouter(tags=["enrollments"])


@router.get("/enrollments", response_model=list[EnrollmentRead])
def get_enrollments(db: Session = Depends(get_db)) -> list[Enrollment]:
    return list(db.scalars(select(Enrollment).order_by(Enrollment.id)))


@router.post("/enrollments", response_model=EnrollmentRead, status_code=201)
def create_enrollment(
    enrollment_data: EnrollmentCreate,
    db: Session = Depends(get_db),
) -> Enrollment:
    student = db.get(User, enrollment_data.student_id)
    if student is None or student.role != UserRole.student:
        raise HTTPException(status_code=404, detail="Student not found")
    if db.get(Class, enrollment_data.class_id) is None:
        raise HTTPException(status_code=404, detail="Class not found")

    enrollment = Enrollment(**enrollment_data.model_dump())
    db.add(enrollment)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Student is already enrolled in this class",
        ) from exc
    db.refresh(enrollment)
    return enrollment


@router.get(
    "/students/{student_id}/enrollments",
    response_model=list[EnrollmentRead],
)
def get_student_enrollments(
    student_id: int,
    db: Session = Depends(get_db),
) -> list[Enrollment]:
    if db.get(User, student_id) is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return list(
        db.scalars(
            select(Enrollment)
            .where(Enrollment.student_id == student_id)
            .order_by(Enrollment.id)
        )
    )


@router.delete("/enrollments/{enrollment_id}")
def delete_enrollment(
    enrollment_id: int,
    db: Session = Depends(get_db),
) -> dict[str, str]:
    enrollment = db.get(Enrollment, enrollment_id)
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    db.delete(enrollment)
    db.commit()
    return {"status": "deleted"}
