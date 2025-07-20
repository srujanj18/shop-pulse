import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, ShoppingCart } from "lucide-react";
import { useState } from "react";

const ProductCard = ({ product }: { product: any }) => {
  const [isAdding, setIsAdding] = useState(false);

  const addToCart = () => {
    setIsAdding(true);
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product already exists in cart
    const existingItem = cartItems.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      // Increment quantity if item already exists
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        id: product.id || Date.now(),
        name: product.title,
        price: Number(product.price),
        quantity: 1,
        image: product.image,
        url: product.url,
        category: product.category
      });
    }
    
    // Save back to localStorage
    localStorage.setItem("cart", JSON.stringify(cartItems));
    
    // Show success feedback
    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img
            src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={product.title}
            className="h-48 w-full object-cover rounded"
            onError={(e: any) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
          />
        </div>
        <h3 className="font-semibold text-base line-clamp-2 min-h-[48px]">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
        <p className="text-primary font-bold mb-2">₹{product.price}</p>
        
        <div className="flex gap-2 mb-2">
          <Button 
            onClick={addToCart}
            disabled={isAdding}
            className="flex-1"
            size="sm"
          >
            <ShoppingCart className="h-4 w-4 mr-2" />
            {isAdding ? "Added!" : "Add to Cart"}
          </Button>
        </div>
        
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
        >
          View on Amazon <ExternalLink size={14} />
        </a>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
