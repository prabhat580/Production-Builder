import { useProduct } from "@/hooks/use-products";
import { useRoute } from "wouter";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingCart, Heart, Share2, Truck, RotateCcw } from "lucide-react";
import { useAddToCart } from "@/hooks/use-cart";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const id = params ? parseInt(params.id) : null;
  const { data: product, isLoading, error } = useProduct(id);
  const { mutate: addToCart, isPending } = useAddToCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-12">
          <div className="grid md:grid-cols-2 gap-12">
            <Skeleton className="aspect-square rounded-3xl" />
            <div className="space-y-4">
              <Skeleton className="h-10 w-3/4" />
              <Skeleton className="h-6 w-1/4" />
              <Skeleton className="h-32 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <Button className="mt-4" onClick={() => window.history.back()}>Go Back</Button>
          </div>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to add items to your cart.",
        variant: "destructive"
      });
      return;
    }
    addToCart({ productId: product.id, quantity });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery Side */}
          <div className="space-y-4">
            <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-white border shadow-sm relative">
              <img 
                src={product.imageUrl || "https://placehold.co/800x600/png?text=Product"} 
                alt={product.name}
                className="w-full h-full object-contain p-4"
              />
              {product.stock === 0 && (
                <div className="absolute top-4 right-4">
                  <Badge variant="destructive" className="text-lg py-1 px-3">Out of Stock</Badge>
                </div>
              )}
            </div>
          </div>

          {/* Product Info Side */}
          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="secondary" className="text-primary bg-primary/10 hover:bg-primary/20">
                  {product.category?.name || "Uncategorized"}
                </Badge>
                <span className="text-sm text-muted-foreground">SKU: {product.id.toString().padStart(6, '0')}</span>
              </div>
              
              <h1 className="text-4xl font-display font-bold text-foreground mb-4 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex items-end gap-4 mb-6">
                <span className="text-3xl font-bold text-primary">
                  ${Number(product.price).toFixed(2)}
                </span>
              </div>
            </div>

            <Separator className="mb-6" />

            <div className="prose prose-sm text-muted-foreground mb-8 max-w-none">
              <p>{product.description}</p>
            </div>

            {/* Actions */}
            <div className="bg-muted/30 p-6 rounded-2xl border border-border/50 mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border rounded-lg bg-background">
                  <button 
                    className="px-3 py-2 hover:bg-muted text-lg font-medium"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button 
                    className="px-3 py-2 hover:bg-muted text-lg font-medium"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-muted-foreground">
                  {product.stock > 0 ? (
                    <span className="text-green-600 font-medium flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-green-500" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-red-500 font-medium">Out of Stock</span>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="lg" 
                  className="flex-1 text-base font-semibold shadow-lg shadow-primary/25"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0 || isPending}
                >
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  {isPending ? "Adding..." : "Add to Cart"}
                </Button>
                <Button size="lg" variant="outline" className="px-4">
                  <Heart className="h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="px-4">
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Value Props */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/20">
                <Truck className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">Free Delivery</h4>
                  <p className="text-xs text-muted-foreground mt-1">For all orders over $50</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-xl bg-secondary/20">
                <RotateCcw className="h-6 w-6 text-primary mt-1" />
                <div>
                  <h4 className="font-semibold text-sm">30 Days Return</h4>
                  <p className="text-xs text-muted-foreground mt-1">If goods have problems</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
