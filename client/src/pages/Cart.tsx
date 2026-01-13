import { Navbar } from "@/components/Navbar";
import { useCart, useRemoveFromCart, useUpdateCartItem } from "@/hooks/use-cart";
import { useCreateOrder } from "@/hooks/use-orders";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Trash2, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function Cart() {
  const { data: cartItems, isLoading } = useCart();
  const { mutate: removeItem } = useRemoveFromCart();
  const { mutate: updateItem } = useUpdateCartItem();
  const { mutate: createOrder, isPending: isCheckingOut } = useCreateOrder();
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const subtotal = cartItems?.reduce((acc, item) => acc + (Number(item.product.price) * item.quantity), 0) || 0;
  const shipping = subtotal > 100 ? 0 : 15;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    // Simple direct checkout simulation
    // In a real app, this would redirect to a Checkout page with forms for address/payment
    // For this MVP, we'll simulate "1-click" ordering with a default address
    if (!user) return;

    createOrder({
      address: user.address || "123 Main St, Default City", // Fallback or use user's
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container-custom py-20 flex justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center container-custom text-center">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-6">
            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8 max-w-sm">
            Looks like you haven't added anything to your cart yet. Go ahead and explore our products!
          </p>
          <Link href="/products">
            <Button size="lg" className="rounded-full">Start Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container-custom py-12">
        <h1 className="text-3xl font-bold font-display mb-8">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-6 p-6 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-24 w-24 shrink-0 overflow-hidden rounded-xl border bg-white">
                  <img 
                    src={item.product.imageUrl || "https://placehold.co/200x200"} 
                    alt={item.product.name}
                    className="h-full w-full object-contain"
                  />
                </div>
                
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="font-semibold text-lg line-clamp-1">{item.product.name}</h3>
                      <button 
                        onClick={() => removeItem(item.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                      {item.product.description}
                    </p>
                  </div>
                  
                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border rounded-lg bg-background">
                      <button 
                        className="px-2 py-1 hover:bg-muted"
                        onClick={() => updateItem({ id: item.id, quantity: Math.max(1, item.quantity - 1) })}
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button 
                        className="px-2 py-1 hover:bg-muted"
                        onClick={() => updateItem({ id: item.id, quantity: item.quantity + 1 })}
                      >
                        +
                      </button>
                    </div>
                    <span className="font-bold text-lg">
                      ${(Number(item.product.price) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-lg sticky top-24">
              <h3 className="font-bold text-xl mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {shipping > 0 && (
                  <p className="text-xs text-primary bg-primary/10 p-2 rounded">
                    Add ${(100 - subtotal).toFixed(2)} more for free shipping!
                  </p>
                )}
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4">
                <Button 
                  className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" 
                  size="lg"
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                >
                  {isCheckingOut ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-center text-muted-foreground">
                  By proceeding, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
