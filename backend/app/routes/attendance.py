from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.attendance_model import AttendanceModel
from app.models.enrollment_model import EnrollmentModel
from app.models.slot_model import SlotModel
from app.schemas.attendance_schema import (
    AttendanceCreate,
    AttendanceUpdate,
    AttendanceResponse,
)

router = APIRouter(prefix="/attendance", tags=["Attendance"])


def _get_enrollment(db: Session, enrollment_id: int) -> EnrollmentModel:
    enrollment = (
        db.query(EnrollmentModel)
        .filter(EnrollmentModel.id == enrollment_id)
        .first()
    )

    if not enrollment:
        raise HTTPException(
            status_code=400,
            detail=f"Enrollment with id {enrollment_id} does not exist.",
        )

    return enrollment


def _get_slot(db: Session, slot_id: int) -> SlotModel:
    slot = (
        db.query(SlotModel)
        .filter(SlotModel.id == slot_id)
        .first()
    )

    if not slot:
        raise HTTPException(
            status_code=400,
            detail=f"Slot with id {slot_id} does not exist.",
        )

    return slot


def _validate_enrollment_slot(
    db: Session,
    enrollment_id: int,
    slot_id: int,
) -> None:
    enrollment = _get_enrollment(db, enrollment_id)
    slot = _get_slot(db, slot_id)

    # Attendance can only be recorded for a slot
    # belonging to the student's enrolled class.
    if enrollment.class_id != slot.class_id:
        raise HTTPException(
            status_code=400,
            detail="The slot does not belong to the student's enrolled class.",
        )


@router.post(
    "",
    response_model=AttendanceResponse,
    status_code=201,
)
def create_attendance(
    attendance_in: AttendanceCreate,
    db: Session = Depends(get_db),
):
    _validate_enrollment_slot(
        db,
        attendance_in.enrollment_id,
        attendance_in.slot_id,
    )

    # A student should have only one attendance record
    # for a particular enrollment, slot, and date.
    existing = (
        db.query(AttendanceModel)
        .filter(
            AttendanceModel.enrollment_id
            == attendance_in.enrollment_id,
            AttendanceModel.slot_id
            == attendance_in.slot_id,
            AttendanceModel.date
            == attendance_in.date,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Attendance has already been recorded for this date and slot.",
        )

    new_attendance = AttendanceModel(
        enrollment_id=attendance_in.enrollment_id,
        slot_id=attendance_in.slot_id,
        date=attendance_in.date,
        status=attendance_in.status,
    )

    db.add(new_attendance)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not create attendance record.",
        )

    db.refresh(new_attendance)

    return new_attendance


@router.get(
    "",
    response_model=List[AttendanceResponse],
)
def get_attendance(
    db: Session = Depends(get_db),
):
    return db.query(AttendanceModel).all()


@router.get(
    "/{attendance_id}",
    response_model=AttendanceResponse,
)
def get_attendance_record(
    attendance_id: int,
    db: Session = Depends(get_db),
):
    attendance = (
        db.query(AttendanceModel)
        .filter(AttendanceModel.id == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found.",
        )

    return attendance


@router.put(
    "/{attendance_id}",
    response_model=AttendanceResponse,
)
def update_attendance(
    attendance_id: int,
    attendance_in: AttendanceUpdate,
    db: Session = Depends(get_db),
):
    attendance = (
        db.query(AttendanceModel)
        .filter(AttendanceModel.id == attendance_id)
        .first()
    )

    if not attendance:
        raise HTTPException(
            status_code=404,
            detail="Attendance record not found.",
        )

    update_data = attendance_in.model_dump(exclude_unset=True)

    new_enrollment_id = update_data.get(
        "enrollment_id",
        attendance.enrollment_id,
    )

    new_slot_id = update_data.get(
        "slot_id",
        attendance.slot_id,
    )

    _validate_enrollment_slot(
        db,
        new_enrollment_id,
        new_slot_id,
    )

    new_date = update_data.get(
        "date",
        attendance.date,
    )

    # Prevent duplicate attendance for the same
    # enrollment, slot, and date.
    existing = (
        db.query(AttendanceModel)
        .filter(
            AttendanceModel.enrollment_id == new_enrollment_id,
            AttendanceModel.slot_id == new_slot_id,
            AttendanceModel.date == new_date,
            AttendanceModel.id != attendance_id,
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=409,
            detail="Attendance already exists for this enrollment, slot, and date.",
        )

    for field, value in update_data.items():
        setattr(attendance, field, value)

    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=409,
            detail="Could not update attendance record.",
        )

    db.refresh(attendance)

    return attendance