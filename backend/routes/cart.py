from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from .. import schemas, models, database

router = APIRouter(prefix="/cart", tags=["cart"])

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/add")
def add_to_cart(item: schemas.CartItem, db: Session = Depends(get_db)):
    db_item = models.CartItem(user_id=1, product_id=item.product_id)
    db.add(db_item)
    db.commit()
    return {"message": "Added to cart"}

@router.delete("/remove")
def remove_from_cart(item: schemas.CartItem, db: Session = Depends(get_db)):
    db.query(models.CartItem).filter_by(user_id=1, product_id=item.product_id).delete()
    db.commit()
    return {"message": "Removed from cart"}
