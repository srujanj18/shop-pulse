from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.chat import router as chat_router
from routes import orders, wishlist, payment_methods, contact
app = FastAPI()

# ✅ Allow CORS from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080"],  # React app origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Prefix so /api/chat works
app.include_router(chat_router, prefix="/api") 
app.include_router(orders.router, prefix="/api")
app.include_router(wishlist.router, prefix="/api")
app.include_router(payment_methods.router, prefix="/api")
app.include_router(contact.router, prefix="/api")