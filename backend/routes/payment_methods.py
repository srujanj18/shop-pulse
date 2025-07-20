from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import PaymentMethod
from schemas import PaymentMethodSchema
from typing import List

router = APIRouter(prefix="/payment-methods", tags=["payment-methods"])

@router.get("/user/{user_id}", response_model=List[PaymentMethodSchema])
def get_user_payment_methods(user_id: int, db: Session = Depends(get_db)):
    return db.query(PaymentMethod).filter(PaymentMethod.user_id == user_id).all()

@router.post("/", response_model=PaymentMethodSchema)
def add_payment_method(method: PaymentMethodSchema, db: Session = Depends(get_db)):
    payment_method = PaymentMethod(
        user_id=method.user_id,
        card_last4=method.card_last4,
        card_brand=method.card_brand,
        expiry_month=method.expiry_month,
        expiry_year=method.expiry_year
    )
    db.add(payment_method)
    db.commit()
    db.refresh(payment_method)
    return payment_method

@router.delete("/{method_id}")
def remove_payment_method(method_id: int, db: Session = Depends(get_db)):
    method = db.query(PaymentMethod).filter(PaymentMethod.id == method_id).first()
    if not method:
        raise HTTPException(status_code=404, detail="Payment method not found")
    db.delete(method)
    db.commit()
    return {"message": "Removed payment method"} 