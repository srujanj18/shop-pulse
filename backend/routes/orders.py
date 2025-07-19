from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Order
from schemas import OrderSchema  # ✅ import schema
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from order_db import get_orders_by_user

from order_db import get_order_by_id, update_order_status
router = APIRouter()

@router.get("/orders", response_model=List[OrderSchema])  # ✅ declare response_model
def get_all_orders(db: Session = Depends(get_db)):
    return db.query(Order).all()

@router.get("/orders/user/{user_id}")
def user_orders(user_id: str):
    return get_orders_by_user(user_id)

@router.get("/orders/{order_id}")
def order_detail(order_id: str):
    order = get_order_by_id(order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/orders/{order_id}/status")
def update_status(order_id: str, status: str):
    updated = update_order_status(order_id, status)
    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")
    return updated
