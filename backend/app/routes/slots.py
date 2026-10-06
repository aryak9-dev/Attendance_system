from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.class_model import ClassModel
from app.models.slot_model import SlotModel
from app.schemas.slot_schema import SlotCreate, SlotUpdate, SlotResponse

router = APIRouter(prefix="/slots", tags=["Slots"])


def _ensure_class_exists(db: Session, class_id: int) -> None:
    class_obj = db.query(ClassModel).filter(ClassModel.id == class_id).first()

    if not class_obj:
        raise HTTPException(
            status_code=400,
            detail=f"Class with id {class_id} does not exist.",
        )


@router.post("", response_model=SlotResponse, status_code=201)
def create_slot(
    slot_in: SlotCreate,
    db: Session = Depends(get_db),
):
    _ensure_class_exists(db, slot_in.class_id)

    new_slot = SlotModel(
        class_id=slot_in.class_id,
        day=slot_in.day,
        start_time=slot_in.start_time,
        end_time=slot_in.end_time,
    )

    db.add(new_slot)
    db.commit()
    db.refresh(new_slot)

    return new_slot


@router.get("", response_model=List[SlotResponse])
def get_slots(db: Session = Depends(get_db)):
    return db.query(SlotModel).all()


@router.get("/{slot_id}", response_model=SlotResponse)
def get_slot(
    slot_id: int,
    db: Session = Depends(get_db),
):
    slot = db.query(SlotModel).filter(SlotModel.id == slot_id).first()

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found.",
        )

    return slot


@router.put("/{slot_id}", response_model=SlotResponse)
def update_slot(
    slot_id: int,
    slot_in: SlotUpdate,
    db: Session = Depends(get_db),
):
    slot = db.query(SlotModel).filter(SlotModel.id == slot_id).first()

    if not slot:
        raise HTTPException(
            status_code=404,
            detail="Slot not found.",
        )

    update_data = slot_in.model_dump(exclude_unset=True)

    if "class_id" in update_data:
        _ensure_class_exists(db, update_data["class_id"])

    # If start_time or end_time is being changed,
    # validate the final combination.
    new_start = update_data.get("start_time", slot.start_time)
    new_end = update_data.get("end_time", slot.end_time)

    if new_end <= new_start:
        raise HTTPException(
            status_code=400,
            detail="end_time must be after start_time.",
        )

    for field, value in update_data.items():
        setattr(slot, field, value)

    db.commit()
    db.refresh(slot)

    return slot