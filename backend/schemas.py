# schemas.py

from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from pydantic import BaseModel, EmailStr

class OrderSchema(BaseModel):
    id: int
    user_id: int
    product_id: int
    quantity: int
    status: str
    tracking_number: Optional[str] = None
    order_date: datetime

    class Config:
        orm_mode = True
       
class UserCreate(BaseModel):
    email: EmailStr
    hashed_password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str        
        
class WishlistSchema(BaseModel):
    id: int
    user_id: int
    product_id: int
    added_at: datetime
    class Config:
        orm_mode = True

class PaymentMethodSchema(BaseModel):
    id: int
    user_id: int
    card_last4: str
    card_brand: str
    expiry_month: int
    expiry_year: int
    added_at: datetime
    class Config:
        orm_mode = True
        
