from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
import time
import asyncio
from functools import lru_cache

router = APIRouter()

# ✅ Your API key (ensure this is kept secret in production!)
GEMINI_API_KEY = "AIzaSyDfOHSKloVVr__pb5Yyx2lrwSxrnTDaqRA"
genai.configure(api_key=GEMINI_API_KEY)

# ✅ Use faster Gemini model for better performance
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 0.7,
        "top_p": 0.8,
        "top_k": 40,
        "max_output_tokens": 1024,  # Limit response length for faster replies
    }
)

# ✅ Define message format for history
class Message(BaseModel):
    role: str  # "user" or "model"
    parts: List[str]

# ✅ Define request structure
class ChatRequest(BaseModel):
    message: str
    history: List[Message]
    user_id: Optional[str] = None

# ✅ Cache for common responses
@lru_cache(maxsize=100)
def get_cached_response(message: str) -> Optional[str]:
    """Cache common responses for instant replies"""
    common_responses = {
        "hello": "Hello! How can I help you today?",
        "hi": "Hi there! What can I assist you with?",
        "help": "I'm here to help! You can ask me about products, deals, or any shopping-related questions.",
        "thanks": "You're welcome! Is there anything else I can help you with?",
        "thank you": "You're welcome! Is there anything else I can help you with?",
    }
    return common_responses.get(message.lower().strip())

def optimize_history(history: List[dict], max_messages: int = 10) -> List[dict]:
    """Optimize history by keeping only recent messages to reduce context size"""
    if len(history) <= max_messages:
        return history
    
    # Keep the most recent messages
    return history[-max_messages:]

@router.post("/chat")
async def chat_with_bot(request: ChatRequest):
    try:
        start_time = time.time()
        print(f"📨 Received: {request.message}")

        # ✅ Check cache first for instant responses
        cached_response = get_cached_response(request.message)
        if cached_response:
            print(f"⚡ Cache hit! Response time: {time.time() - start_time:.2f}s")
            return {
                "response": cached_response,
                "updated_history": request.history + [
                    {"role": "user", "parts": [request.message]},
                    {"role": "model", "parts": [cached_response]}
                ]
            }

        # ✅ Optimize history to reduce context size
        raw_history = [msg.dict() for msg in request.history]
        optimized_history = optimize_history(raw_history)

        # ✅ Start chat with optimized history
        chat = model.start_chat(history=optimized_history)

        # ✅ Send message with timeout for faster error handling
        try:
            response = await asyncio.wait_for(
                chat.send_message_async(request.message),
                timeout=15.0  # 15 second timeout
            )
        except asyncio.TimeoutError:
            return {
                "response": "⏰ Sorry, the response is taking too long. Please try again with a shorter question.",
                "updated_history": request.history
            }

        print(f"📦 Gemini response time: {time.time() - start_time:.2f}s")

        if not hasattr(response, "text") or not response.text:
            return {"response": "⚠️ Gemini returned an empty response."}

        # ✅ Serialize updated history manually
        updated_history = [
            {
                "role": m.role,
                "parts": [p.text for p in m.parts]
            } for m in chat.history
        ]

        # ✅ Optimize the updated history before returning
        final_history = optimize_history(updated_history)

        return {
            "response": response.text,
            "updated_history": final_history,
            "response_time": round(time.time() - start_time, 2)
        }

    except Exception as e:
        print(f"❌ Gemini error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

# ✅ Health check endpoint for monitoring
@router.get("/health")
async def health_check():
    return {"status": "healthy", "model": "gemini-1.5-flash"}
