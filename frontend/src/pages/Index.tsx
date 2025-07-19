import Hero from "@/components/Hero";
import ProductCategories from "@/components/ProductCategories";
import FeaturedProducts from "@/components/FeaturedProducts";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <ProductCategories />
      <FeaturedProducts />
    </div>
  );
};

export default Index;
