import { Product, Category } from "@shared/schema";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface ProductCardProps {
  product: Product & { category: Category | null };
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, isPending } = useAddToCart(); // Assuming hook returns this
  const { mutate: addItem } = useAddToCart();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to add items to your cart.",
        variant: "destructive"
      });
      return;
    }

    addItem({ productId: product.id, quantity: 1 });
  };

  return (
    <Link href={`/products/${product.id}`} className="group h-full block">
      <Card className="h-full flex flex-col overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 bg-card">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.stock <= 0 && (
            <div className="absolute top-2 right-2 z-10">
              <Badge variant="destructive">Out of Stock</Badge>
            </div>
          )}
          {product.category && (
            <div className="absolute top-2 left-2 z-10">
              <Badge variant="secondary" className="bg-background/80 backdrop-blur-sm text-xs font-normal">
                {product.category.name}
              </Badge>
            </div>
          )}
          
          {/* Dynamic Image with Fallback */}
          <img
            src={product.imageUrl || "https://placehold.co/600x400/png?text=Product"}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          
          {/* Quick Add Overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 bg-gradient-to-t from-black/60 to-transparent flex justify-center">
            <Button 
              size="sm" 
              className="w-full rounded-full font-semibold shadow-lg" 
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </Button>
          </div>
        </div>

        <CardContent className="flex-1 p-5">
          <h3 className="font-display text-lg font-bold leading-tight text-foreground line-clamp-1 mb-2 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
            {product.description}
          </p>
        </CardContent>
        
        <CardFooter className="p-5 pt-0 flex items-center justify-between border-t bg-muted/20 mt-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground font-medium">Price</span>
            <span className="text-xl font-bold font-display text-primary">
              ${Number(product.price).toFixed(2)}
            </span>
          </div>
          {product.stock < 5 && product.stock > 0 && (
            <span className="text-xs font-medium text-orange-500">
              Only {product.stock} left!
            </span>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
