import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const CartPage = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // Fetch from localStorage or API (replace with real logic)
    const stored = localStorage.getItem("cart");
    if (stored) {
      setCartItems(JSON.parse(stored));
    }
  }, []);

  const total = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleRemove = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cart", JSON.stringify(updated));
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🛒 Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-muted-foreground">Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center border p-4 rounded shadow-sm">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-contain mr-4" />
              <div className="flex-1">
                <h2 className="font-semibold">{item.name}</h2>
                <p>Quantity: {item.quantity}</p>
                <p>Price: ₹{item.price.toFixed(2)}</p>
              </div>
              <Button variant="destructive" onClick={() => handleRemove(item.id)}>Remove</Button>
            </div>
          ))}

          <div className="text-right mt-6">
            <h2 className="text-xl font-bold">Total: ₹{total.toFixed(2)}</h2>
            <Button className="mt-2">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
