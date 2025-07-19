import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

const ProductCard = ({ product }: { product: any }) => {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200">
      <CardContent className="p-4">
        <div className="relative mb-3">
          <img
            src={product.image || "https://via.placeholder.com/300x200?text=No+Image"}
            alt={product.title}
            className="h-48 w-full object-cover rounded"
            onError={(e: any) => (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")}
          />
        </div>
        <h3 className="font-semibold text-base line-clamp-2 min-h-[48px]">{product.title}</h3>
        <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
        <p className="text-primary font-bold mb-2">₹{product.price}</p>
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-blue-600 hover:underline text-sm"
        >
          View on Amazon <ExternalLink size={14} />
        </a>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
