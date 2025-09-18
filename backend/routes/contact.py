from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr

router = APIRouter(prefix="/contact", tags=["contact"])

class ContactMessage(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    message: str

@router.post("/")
async def send_message(msg: ContactMessage):
    # Here you could save to DB, send an email, etc.
    # For now, just print/log and return success.
    print(f"Contact message from {msg.first_name} {msg.last_name} <{msg.email}>: {msg.message}")
    return {"success": True, "message": "Message received. We'll get back to you soon!"}
