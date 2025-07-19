import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsMenuOpen(false); // close menu on mobile
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="ShopPulse Logo" className="h-8 w-8 object-contain" />
          <span className="text-xl font-bold text-foreground">ShopPulse</span>
          </Link>


          {/* Search - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-8 items-center space-x-2">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-10"
              />
            </div>
            <Button onClick={handleSearch} variant="default">Search</Button>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/categories" className="text-foreground hover:text-primary">Categories</Link>
            <Link to="/deals" className="text-foreground hover:text-primary">Deals</Link>
            <Link to="/chatbot" className="text-foreground hover:text-primary">Chatbot</Link>
            <Link to="/orders" className="text-foreground hover:text-primary">Orders</Link>

            <Link to="/profile">
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                  0
                </span>
              </Button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Search */}
              <div className="relative flex items-center space-x-2">
                <div className="relative w-full">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search products..."
                    className="w-full pl-10"
                  />
                </div>
                <Button onClick={handleSearch} size="sm">Search</Button>
              </div>

              {/* Mobile Links */}
              <div className="space-y-2">
                <Link to="/categories" onClick={() => setIsMenuOpen(false)} className="block py-2 text-foreground hover:text-primary">Categories</Link>
                <Link to="/deals" onClick={() => setIsMenuOpen(false)} className="block py-2 text-foreground hover:text-primary">Deals</Link>
                <Link to="/chatbot" onClick={() => setIsMenuOpen(false)} className="block py-2 text-foreground hover:text-primary">Chatbot</Link>
                <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="block py-2 text-foreground hover:text-primary">Profile</Link>
              </div>

              {/* Mobile Icons */}
              <div className="flex items-center space-x-4 pt-2">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Link to="/cart">
                  <Button variant="ghost" size="icon" className="relative">
                    <ShoppingCart className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-xs text-primary-foreground flex items-center justify-center">
                      0
                    </span>
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
