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
        
