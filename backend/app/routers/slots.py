from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Class, Slot
from app.schemas import SlotCreate, SlotRead

router = APIRouter(tags=["slots"])


@router.get("/classes/{class_id}/slots", response_model=list[SlotRead])
def get_class_slots(class_id: int, db: Session = Depends(get_db)) -> list[Slot]:
    if db.get(Class, class_id) is None:
        raise HTTPException(status_code=404, detail="Class not found")
    return list(
        db.scalars(
            select(Slot).where(Slot.class_id == class_id).order_by(Slot.id)
        )
    )


@router.post("/classes/{class_id}/slots", response_model=SlotRead, status_code=201)
def create_slot(
    class_id: int,
    slot_data: SlotCreate,
    db: Session = Depends(get_db),
) -> Slot:
    if db.get(Class, class_id) is None:
        raise HTTPException(status_code=404, detail="Class not found")
    if slot_data.end_time <= slot_data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    slot = Slot(class_id=class_id, **slot_data.model_dump())
    db.add(slot)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=400, detail="Unable to create slot") from exc
    db.refresh(slot)
    return slot


@router.put("/slots/{slot_id}", response_model=SlotRead)
def update_slot(
    slot_id: int,
    slot_data: SlotCreate,
    db: Session = Depends(get_db),
) -> Slot:
    slot = db.get(Slot, slot_id)
    if slot is None:
        raise HTTPException(status_code=404, detail="Slot not found")
    if slot_data.end_time <= slot_data.start_time:
        raise HTTPException(status_code=400, detail="End time must be after start time")

    for field, value in slot_data.model_dump().items():
        setattr(slot, field, value)
    db.commit()
    db.refresh(slot)
    return slot


@router.delete("/slots/{slot_id}")
def delete_slot(slot_id: int, db: Session = Depends(get_db)) -> dict[str, str]:
    slot = db.get(Slot, slot_id)
    if slot is None:
        raise HTTPException(status_code=404, detail="Slot not found")
    db.delete(slot)
    db.commit()
    return {"status": "deleted"}
