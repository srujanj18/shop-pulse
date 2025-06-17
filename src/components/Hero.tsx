import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-r from-primary/10 via-background to-accent/10">
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-foreground leading-tight">
                Discover Amazing
                <span className="text-primary block">Products</span>
                for Your Lifestyle
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Shop the latest trends and find everything you need with unbeatable prices and fast delivery.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-lg">
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button variant="outline" size="lg" className="text-lg">
                Explore Categories
              </Button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 pt-8">
              <div>
                <div className="text-2xl font-bold text-foreground">10K+</div>
                <div className="text-sm text-muted-foreground">Products</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">50K+</div>
                <div className="text-sm text-muted-foreground">Customers</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">99%</div>
                <div className="text-sm text-muted-foreground">Satisfaction</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative">
            <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=600&h=600&fit=crop"
                alt="Shopping Hero"
                className="rounded-2xl object-cover w-full h-full"
              />
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-4 -right-4 bg-background rounded-lg p-4 shadow-lg border">
              <div className="text-sm font-medium text-foreground">Free Shipping</div>
              <div className="text-xs text-muted-foreground">On orders over $50</div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-background rounded-lg p-4 shadow-lg border">
              <div className="text-sm font-medium text-foreground">24/7 Support</div>
              <div className="text-xs text-muted-foreground">Always here to help</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;