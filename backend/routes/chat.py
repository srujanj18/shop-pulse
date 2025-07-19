from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import google.generativeai as genai

router = APIRouter()

# ✅ Your API key (ensure this is kept secret in production!)
GEMINI_API_KEY = "AIzaSyDfOHSKloVVr__pb5Yyx2lrwSxrnTDaqRA"
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Use Gemini Pro model
model = genai.GenerativeModel(model_name="gemini-1.5-flash")

# ✅ Define message format for history
class Message(BaseModel):
    role: str  # "user" or "model"
    parts: List[str]

# ✅ Define request structure
class ChatRequest(BaseModel):
    message: str
    history: List[Message]

# ✅ Chat route with memory
# ✅ Chat route with memory
@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    try:
        print(f"📨 Received: {request.message}")

        # Convert Pydantic models to raw dicts
        raw_history = [msg.dict() for msg in request.history]

        # Start chat with history
        chat = model.start_chat(history=raw_history)

        # ✅ Send message asynchronously (non-blocking & faster)
        response = await chat.send_message_async(request.message)

        print("📦 Gemini full response:", response)

        if not hasattr(response, "text") or not response.text:
            return {"response": "⚠️ Gemini returned an empty response."}

        # ✅ Serialize updated history manually
        return {
            "response": response.text,
            "updated_history": [
                {
                    "role": m.role,
                    "parts": [p.text for p in m.parts]
                } for m in chat.history
            ]
        }

    except Exception as e:
        print(f"❌ Gemini error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
