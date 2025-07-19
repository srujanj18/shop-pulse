import { useState } from "react";
import ProductCard from "@/components/ProductCard"; // Create this if not already
import { Input } from "@/components/ui/input";
import { categoriesData } from "@/lib/data"; // Your product data

const Categories = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const filteredProducts = categoriesData.filter((product) => {
    const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Get unique categories for filter options
  const uniqueCategories = ["All", ...new Set(categoriesData.map((p) => p.category))];

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Product Categories</h2>

      {/* Search & Filter */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search products..."
          className="md:w-1/2"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <select
          className="md:w-1/4 p-2 border rounded-md bg-background text-foreground"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {uniqueCategories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p>No products found.</p>
        )}
      </div>
    </div>
  );
};

export default Categories;
