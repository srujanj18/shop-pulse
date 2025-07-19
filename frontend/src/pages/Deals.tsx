// pages/Deals.tsx
import React, { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const ALL_BRANDS = [
  "OnePlus", "iQOO", "Samsung", "Redmi", "HP", "LG", "Xiaomi", "Sony", "VIVO",
  "realme", "Apple", "RR", "POCO", "Vu", "HONOR", "TCL", "Lava", "Lenovo", "acer", "Bosch"
];

const Deals = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);

  useEffect(() => {
    // Fetch products from public JSON
    const fetchData = async () => {
      const res = await fetch("/products.json");
      const data = await res.json();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedBrands]);

  const filterProducts = () => {
    let updated = [...products];

    if (searchQuery) {
      updated = updated.filter((item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedBrands.length > 0) {
      updated = updated.filter((item) =>
        selectedBrands.some((brand) =>
          item.title.toLowerCase().includes(brand.toLowerCase())
        )
      );
    }

    setFilteredProducts(updated);
  };

  const toggleBrand = (brand: string) => {
    if (selectedBrands.includes(brand)) {
      setSelectedBrands(selectedBrands.filter((b) => b !== brand));
    } else {
      setSelectedBrands([...selectedBrands, brand]);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">🔥 Today's Best Deals</h1>

      {/* Search Bar */}
      <Input
        type="text"
        placeholder="Search products..."
        className="mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Filter by Brand */}
      <div className="flex flex-wrap gap-4 mb-6">
        {ALL_BRANDS.map((brand) => (
          <label
            key={brand}
            className="flex items-center space-x-2 text-sm"
          >
            <Checkbox
              checked={selectedBrands.includes(brand)}
              onCheckedChange={() => toggleBrand(brand)}
            />
            <span>{brand}</span>
          </label>
        ))}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredProducts.map((product, idx) => (
          <ProductCard key={idx} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <p className="mt-6 text-center text-muted-foreground">No products found.</p>
      )}
    </div>
  );
};

export default Deals;
