from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Wishlist
from schemas import WishlistSchema
from typing import List

router = APIRouter(prefix="/wishlist", tags=["wishlist"])

@router.get("/user/{user_id}", response_model=List[WishlistSchema])
def get_user_wishlist(user_id: int, db: Session = Depends(get_db)):
    return db.query(Wishlist).filter(Wishlist.user_id == user_id).all()

@router.post("/", response_model=WishlistSchema)
def add_to_wishlist(item: WishlistSchema, db: Session = Depends(get_db)):
    wishlist_item = Wishlist(
        user_id=item.user_id,
        product_id=item.product_id
    )
    db.add(wishlist_item)
    db.commit()
    db.refresh(wishlist_item)
    return wishlist_item

@router.delete("/{wishlist_id}")
def remove_from_wishlist(wishlist_id: int, db: Session = Depends(get_db)):
    item = db.query(Wishlist).filter(Wishlist.id == wishlist_id).first()
    if not item:
        raise HTTPException(status_code=404, detail="Wishlist item not found")
    db.delete(item)
    db.commit()
    return {"message": "Removed from wishlist"} 