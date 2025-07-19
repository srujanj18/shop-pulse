from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, models, database, crud, auth
from ..utils import hashing  # 👈 Make sure you have a hashing utility
from typing import Optional

router = APIRouter(prefix="/users", tags=["users"])

# Dependency to get DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 🔐 Signup (Manual registration)
@router.post("/signup")
def signup(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    user.hashed_password = hashing.hash_password(user.hashed_password)
    return crud.create_user(db, user)

# 🔐 Login
@router.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    db_user = crud.authenticate_user(db, user.email, user.password)
    if not db_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = auth.create_access_token({"sub": db_user.email})
    return {"access_token": token, "token_type": "bearer"}

# ✅ Firebase-compatible: Register (fallback endpoint)
@router.post("/register")
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, user.email)
    if db_user:
        return db_user

    # For Firebase, password might be UID (or empty string)
    hashed = hashing.hash_password(user.hashed_password or "firebase-placeholder")
    new_user = models.User(email=user.email, hashed_password=hashed)
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
