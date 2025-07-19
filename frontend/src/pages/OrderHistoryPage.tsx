import { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  order_id: string;
  items: { name: string; quantity: number; price: number }[];
  status: string;
  tracking_number?: string;
  created_at: string;
}

const OrderHistoryPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const userId = "user-123"; // Get from auth/session

  useEffect(() => {
    axios.get(`http://localhost:8000/api/orders/user/${userId}`).then(res => {
      setOrders(res.data);
    });
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">📦 Order History</h1>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.order_id} className="p-4 border rounded-lg bg-white shadow-sm">
              <h2 className="font-semibold">Order ID: {order.order_id}</h2>
              <p>Status: <strong>{order.status}</strong></p>
              <p>Tracking: {order.tracking_number || "N/A"}</p>
              <p className="text-sm text-muted-foreground">
                Ordered at: {new Date(order.created_at).toLocaleString()}
              </p>
              <ul className="mt-2 pl-4 list-disc">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistoryPage;
