import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import productsData from "@/data/products.json";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    setProducts(productsData);
  }, []);

  const filtered = products.filter((p) => {
    const matchCategory = filter === "All" || p.category === filter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCategory && matchSearch;
  });

  const uniqueCategories = ["All", ...new Set(products.map((p) => p.category))];

  return (
    <section className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/2"
        />
        <Select onValueChange={setFilter}>
          <SelectTrigger className="md:w-64">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            {uniqueCategories.map((cat) => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filtered.map((product) => (
            <ProductCard key={product.title} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};

export default ProductsPage;
