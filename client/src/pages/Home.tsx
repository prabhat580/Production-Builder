import { Navbar } from "@/components/Navbar";
import { useProducts } from "@/hooks/use-products";
import { useCategories } from "@/hooks/use-categories";
import { ProductCard } from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";

export default function Home() {
  const [search, setSearch] = useState("");
  const { data: featuredProducts, isLoading } = useProducts(); // Default fetches all
  const { data: categories } = useCategories();

  // Simple client-side slice for featured section
  const displayProducts = featuredProducts?.slice(0, 4) || [];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary/5 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-6xl font-display mb-6">
              Discover Quality <br/>
              <span className="text-primary">That Defines You</span>
            </h1>
            <p className="text-lg leading-8 text-muted-foreground mb-10">
              Shop the latest trends in electronics, fashion, and home essentials. 
              Curated collections for the modern lifestyle.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Link href="/products">
                <Button size="lg" className="rounded-full text-base h-12 px-8">
                  Shop Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button variant="outline" size="lg" className="rounded-full text-base h-12 px-8 bg-background">
                  Join Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-12 bg-white border-y">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Truck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Free Shipping</h3>
                <p className="text-sm text-muted-foreground">On orders over $100</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Secure Payment</h3>
                <p className="text-sm text-muted-foreground">100% secure checkout</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/30">
              <div className="p-3 bg-primary/10 rounded-full text-primary">
                <Star className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold">Quality Guarantee</h3>
                <p className="text-sm text-muted-foreground">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold font-display">Shop by Category</h2>
            <Link href="/products">
              <Button variant="ghost" className="text-primary hover:text-primary/80">View All</Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories?.map((category) => (
              <Link key={category.id} href={`/products?categoryId=${category.id}`}>
                <div className="group cursor-pointer rounded-2xl overflow-hidden bg-white border shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="h-32 bg-secondary/50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    {/* Placeholder Icon based on category name logic could go here */}
                    <span className="text-4xl opacity-50">📦</span>
                  </div>
                  <div className="p-4 text-center">
                    <h3 className="font-semibold group-hover:text-primary transition-colors">{category.name}</h3>
                  </div>
                </div>
              </Link>
            )) || [1,2,3,4].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-3xl font-bold font-display">Featured Products</h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[4/3] rounded-xl bg-muted animate-pulse" />
                  <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                  <div className="h-4 w-1/3 bg-muted animate-pulse rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter / Footer Lite */}
      <footer className="mt-auto bg-slate-900 text-slate-200 py-12">
        <div className="container-custom grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <span className="text-2xl font-bold font-display text-white mb-4 block">ShopFlow</span>
            <p className="text-slate-400">
              Your one-stop destination for premium products and exceptional shopping experiences.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-slate-400">
              <li><Link href="/products" className="hover:text-white">Shop</Link></li>
              <li><Link href="/auth" className="hover:text-white">Account</Link></li>
              <li><Link href="/cart" className="hover:text-white">Cart</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-white mb-4">Stay Updated</h4>
            <div className="flex gap-2">
              <Input placeholder="Enter your email" className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
