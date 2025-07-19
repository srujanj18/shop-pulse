import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, Laptop, Watch, Headphones, Camera, Gamepad2, Store } from "lucide-react";
import { useNavigate } from "react-router-dom";

const categoryIcons: Record<string, any> = {
  "Mobile Phones": Smartphone,
  "Laptops": Laptop,
  "Smart Watches": Watch,
  "Wearables": Watch,
  "Bluetooth Earbuds": Headphones,
  "Audio": Headphones,
  "Cameras": Camera,
  "Gaming Gear": Gamepad2,
  "Gaming": Gamepad2,
  "Home Appliances": Store,
  "Fashion": Store,
  "Storage Devices": Store,
  "Fitness & Health": Store,
};

const categories = [
  {
    name: "Mobile Phones",
    count: "50+ items",
    image: "https://images.unsplash.com/photo-1616410011236-7a42121dd981?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bW9iaWxlJTIwcGhvbmVzfGVufDB8fDB8fHww"
  },
  {
    name: "Laptops",
    count: "40+ items",
    image: "https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Smart Watches",
    count: "30+ items",
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8c21hcnQlMjB3YXRjaGVzfGVufDB8fDB8fHww"
  },
  {
    name: "Wearables",
    count: "28+ items",
    image: "https://images.unsplash.com/photo-1575125069494-6a0c5819d340?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8d2VhcmFibGVzfGVufDB8fDB8fHww"
  },
  {
    name: "Bluetooth Earbuds",
    count: "25+ items",
    image: "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8ZWFyYnVkc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    name: "Audio",
    count: "30+ items",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGF1ZGlvfGVufDB8fDB8fHwwg"
  },
  {
    name: "Cameras",
    count: "20+ items",
    image: "https://images.unsplash.com/photo-1579535984712-92fffbbaa266?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  },
  {
    name: "Gaming Gear",
    count: "35+ items",
    image: "https://images.unsplash.com/photo-1597840900616-664e930c29df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGdhbWluZyUyMGdlYXJ8ZW58MHx8MHx8fDA%3D://upload.wikimedia.org/wikipedia/commons/8/8b/PlayStation_DualSense_Controller.jpg"
  },
  {
    name: "Gaming",
    count: "32+ items",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Z2FtaW5nfGVufDB8fDB8fHww"
  },
  {
    name: "Home Appliances",
    count: "22+ items",
    image: "https://images.unsplash.com/photo-1617355186172-c32925aea7b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGhvbWUlMjBhcHBsaWFuY2VzfGVufDB8fDB8fHww"
  },
  {
    name: "Fashion",
    count: "100+ items",
    image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8ZmFzaGlvbnxlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    name: "Storage Devices",
    count: "18+ items",
    image: "https://images.unsplash.com/photo-1611153730462-e84a16b8c6e1?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3RvcmFnZSUyMGRldmljZXN8ZW58MHx8MHx8fDA%3D://upload.wikimedia.org/wikipedia/commons/0/0c/SD_and_USB_Drives.jpg"
  },
  {
    name: "Fitness & Health",
    count: "22+ items",
    image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8Zml0bmVzc3xlbnwwfHwwfHx8MA%3D%3D://upload.wikimedia.org/wikipedia/commons/9/9e/Yoga_mat.jpg"
  }
];


const ProductCategories = () => {
  const navigate = useNavigate();

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
            const Icon = categoryIcons[category.name] || Store;

            return (
              <Card key={category.name} className="group cursor-pointer hover:shadow-lg transition-all duration-300 border-0 bg-background">
                <CardContent className="p-6">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                    <div className="absolute top-4 left-4 bg-background/90 rounded-full p-2">
                      <Icon className="h-6 w-6 text-primary" />
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
                    onClick={() => navigate(`/category/${encodeURIComponent(category.name)}`)}
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
