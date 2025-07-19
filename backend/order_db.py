from datetime import datetime
from models import Order

orders = []  # In-memory store

def get_orders_by_user(user_id: str):
    return [order for order in orders if order.user_id == user_id]

def get_order_by_id(order_id: str):
    for order in orders:
        if order.order_id == order_id:
            return order
    return None

def add_order(order: Order):
    orders.append(order)
    return order

def update_order_status(order_id: str, status: str):
    order = get_order_by_id(order_id)
    if order:
        order.status = status
        order.updated_at = datetime.utcnow()
        return order
    return None
