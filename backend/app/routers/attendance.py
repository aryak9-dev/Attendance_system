from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Attendance, Class, Enrollment, Slot, User
from app.schemas import AttendanceCreate, AttendanceRead

router = APIRouter(tags=["attendance"])


@router.get("/attendance", response_model=list[AttendanceRead])
def get_all_attendance(db: Session = Depends(get_db)) -> list[Attendance]:
    return list(db.scalars(select(Attendance).order_by(Attendance.id)))


@router.get("/attendance/{attendance_id}", response_model=AttendanceRead)
def get_attendance(
    attendance_id: int,
    db: Session = Depends(get_db),
) -> Attendance:
    attendance = db.get(Attendance, attendance_id)
    if attendance is None:
        raise HTTPException(status_code=404, detail="Attendance record not found")
    return attendance


@router.get(
    "/students/{student_id}/attendance",
    response_model=list[AttendanceRead],
)
def get_student_attendance(
    student_id: int,
    db: Session = Depends(get_db),
) -> list[Attendance]:
    if db.get(User, student_id) is None:
        raise HTTPException(status_code=404, detail="Student not found")
    statement = (
        select(Attendance)
        .join(Enrollment, Enrollment.id == Attendance.enrollment_id)
        .where(Enrollment.student_id == student_id)
        .order_by(Attendance.date, Attendance.id)
    )
    return list(db.scalars(statement))


@router.get(
    "/classes/{class_id}/attendance",
    response_model=list[AttendanceRead],
)
def get_class_attendance(
    class_id: int,
    db: Session = Depends(get_db),
) -> list[Attendance]:
    if db.get(Class, class_id) is None:
        raise HTTPException(status_code=404, detail="Class not found")
    statement = (
        select(Attendance)
        .join(Enrollment, Enrollment.id == Attendance.enrollment_id)
        .where(Enrollment.class_id == class_id)
        .order_by(Attendance.date, Attendance.id)
    )
    return list(db.scalars(statement))


@router.post("/attendance", response_model=AttendanceRead, status_code=201)
def create_attendance(
    attendance_data: AttendanceCreate,
    db: Session = Depends(get_db),
) -> Attendance:
    enrollment = db.get(Enrollment, attendance_data.enrollment_id)
    if enrollment is None:
        raise HTTPException(status_code=404, detail="Enrollment not found")
    if db.get(Slot, attendance_data.slot_id) is None:
        raise HTTPException(status_code=404, detail="Slot not found")

    attendance = Attendance(**attendance_data.model_dump())
    db.add(attendance)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Attendance already recorded for this slot/date",
        ) from exc
    db.refresh(attendance)
    return attendance
