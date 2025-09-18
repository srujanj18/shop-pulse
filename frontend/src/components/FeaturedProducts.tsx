import { useEffect, useState } from "react";
import { Star, Heart, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Product = {
  title: string;
  price: string;
  image: string;
  url: string;
  category?: string;
};

const FeaturedProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isAdding, setIsAdding] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("/products.json");
        const data = await response.json();
        // Take first 6 products as featured
        setProducts(data.slice(0, 6));
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product: Product) => {
    setIsAdding(prev => ({ ...prev, [product.title]: true }));
    
    // Get existing cart from localStorage
    const existingCart = localStorage.getItem("cart");
    const cartItems = existingCart ? JSON.parse(existingCart) : [];
    
    // Check if product already exists in cart
    const existingItem = cartItems.find((item: any) => item.name === product.title);
    
    if (existingItem) {
      // Increment quantity if item already exists
      existingItem.quantity += 1;
    } else {
      // Add new item to cart
      cartItems.push({
        id: Date.now(),
        name: product.title,
        price: parseFloat(product.price.replace(/[^\d.]/g, '')),
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
      setIsAdding(prev => ({ ...prev, [product.title]: false }));
    }, 1000);
  };

  return (
    <section className="w-full py-16">
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Featured Products
          </h2>
          <p className="max-w-[600px] mx-auto text-gray-600 dark:text-gray-300">
            Discover our handpicked selection of trending products with the best deals.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <a key={index} href={product.url} target="_blank" rel="noopener noreferrer">
              <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 bg-background">
                <CardContent className="p-4">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="bg-background/80 hover:bg-background"
                      >
                        <Heart className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Button 
                        size="sm" 
                        className="shadow-lg"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        disabled={isAdding[product.title]}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isAdding[product.title] ? "Added!" : "Add to Cart"}
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {product.title}
                    </h3>
                    <div className="text-lg font-bold text-foreground">
                      {product.price}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
