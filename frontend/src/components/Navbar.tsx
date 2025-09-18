import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CompactThemeToggle } from "@/components/ThemeToggle";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();

  // Update cart count when component mounts and when localStorage changes
  useEffect(() => {
    const updateCartCount = () => {
      const cart = localStorage.getItem("cart");
      if (cart) {
        const cartItems = JSON.parse(cart);
        const totalItems = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
        setCartCount(totalItems);
      } else {
        setCartCount(0);
      }
    };

    updateCartCount();
    
    // Listen for storage changes (when cart is updated from other components)
    const handleStorageChange = () => {
      updateCartCount();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for changes periodically (for same-tab updates)
    const interval = setInterval(updateCartCount, 1000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false); // close menu on mobile
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <img src="/logo.png" alt="Shop-Pulse" className="h-8 w-8" />
            <span className="font-bold text-xl">Shop-Pulse</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/categories" className="text-foreground hover:text-primary">Categories</Link>
            <Link to="/deals" className="text-foreground hover:text-primary">Deals</Link>
            <Link to="/chatbot" className="text-foreground hover:text-primary">Chatbot</Link>
            <Link to="/orders" className="text-foreground hover:text-primary">Orders</Link>

            <CompactThemeToggle />
            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="flex items-center space-x-2 md:hidden">
            <CompactThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 py-3 space-y-1">
              {/* Search Bar */}
              <div className="flex gap-2 mb-4">
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} size="icon">
                  <Search className="h-4 w-4" />
                </Button>
              </div>

              {/* Navigation Links */}
              <Link
                to="/categories"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                to="/deals"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Deals
              </Link>
              <Link
                to="/chatbot"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Chatbot
              </Link>
              <Link
                to="/orders"
                className="block px-3 py-2 text-foreground hover:text-primary"
                onClick={() => setIsMenuOpen(false)}
              >
                Orders
              </Link>

              {/* User Actions */}
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
