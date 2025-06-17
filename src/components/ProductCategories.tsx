import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Laptop, Watch, Headphones, Camera, Gamepad2 } from "lucide-react";

const categories = [
  {
    id: 1,
    name: "Electronics",
    icon: Smartphone,
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=300&h=200&fit=crop",
    count: "2,500+ items"
  },
  {
    id: 2,
    name: "Laptops",
    icon: Laptop,
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=300&h=200&fit=crop",
    count: "850+ items"
  },
  {
    id: 3,
    name: "Wearables",
    icon: Watch,
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=300&h=200&fit=crop",
    count: "1,200+ items"
  },
  {
    id: 4,
    name: "Audio",
    icon: Headphones,
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=300&h=200&fit=crop",
    count: "900+ items"
  },
  {
    id: 5,
    name: "Cameras",
    icon: Camera,
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=200&fit=crop",
    count: "650+ items"
  },
  {
    id: 6,
    name: "Gaming",
    icon: Gamepad2,
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901?w=300&h=200&fit=crop",
    count: "750+ items"
  }
];

const ProductCategories = () => {
  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our wide range of products across different categories
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-background">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute top-4 left-4 bg-background/90 rounded-full p-2">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-foreground group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count}
                    </p>
                  </div>
                  
                  <Button 
                    variant="ghost" 
                    className="w-full mt-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                  >
                    Browse {category.name}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;