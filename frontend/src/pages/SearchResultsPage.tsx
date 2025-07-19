import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import productsDataRaw from "@/data/products1.json"; // Update path if needed
import { Input } from "@/components/ui/input"; // If using ShadCN or custom component
import { Button } from "@/components/ui/button"; // Optional for search button

interface Product {
  title: string;
  price: string;
  category: string;
  image: string;
  url: string;
}

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const SearchResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParam = useQuery().get("q")?.toLowerCase() || "";

  const [searchInput, setSearchInput] = useState(queryParam);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    const productsData: Product[] = productsDataRaw.map((product, index) => ({
      ...product,
      id: index, // Add ID if not in JSON
    }));

    const results = productsData.filter(
      (product) =>
        product.title.toLowerCase().includes(queryParam) ||
        product.category.toLowerCase().includes(queryParam)
    );

    setFilteredProducts(results);
  }, [queryParam]);

  const handleSearch = () => {
    if (searchInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="container mx-auto p-6">
      {/* Search bar */}
      <div className="mb-6 flex items-center gap-2 max-w-md">
        <Input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder="Search products..."
          className="w-full"
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>

      <h1 className="text-2xl font-bold mb-4">
        🔍 Results for: <span className="text-primary">{queryParam}</span>
      </h1>

      {filteredProducts.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              key={product.title}
              className="border rounded-lg shadow-sm p-4 bg-white hover:shadow-md transition block"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-40 object-contain mb-3 rounded"
              />
              <h2 className="text-lg font-semibold">{product.title}</h2>
              <p className="text-sm text-muted-foreground mb-1">
                Category: {product.category}
              </p>
              <p className="font-bold text-primary">{product.price}</p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResultsPage;
