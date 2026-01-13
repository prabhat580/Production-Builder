import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { setupAuth } from "./auth";

function isAdmin(req: any, res: any, next: any) {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  res.status(403).send("Unauthorized");
}

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Auth
  setupAuth(app);

  // Products
  app.get(api.products.list.path, async (req, res) => {
    const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined;
    const search = req.query.search as string | undefined;
    const products = await storage.getProducts(categoryId, search);
    res.json(products);
  });

  app.get(api.products.get.path, async (req, res) => {
    const product = await storage.getProduct(Number(req.params.id));
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  });

  app.post(api.products.create.path, isAdmin, async (req, res) => {
    const product = await storage.createProduct(req.body);
    res.status(201).json(product);
  });

  app.put(api.products.update.path, isAdmin, async (req, res) => {
    const product = await storage.updateProduct(Number(req.params.id), req.body);
    res.json(product);
  });

  app.delete(api.products.delete.path, isAdmin, async (req, res) => {
    await storage.deleteProduct(Number(req.params.id));
    res.sendStatus(204);
  });

  // Categories
  app.get(api.categories.list.path, async (req, res) => {
    const categories = await storage.getCategories();
    res.json(categories);
  });

  app.post(api.categories.create.path, isAdmin, async (req, res) => {
    const category = await storage.createCategory(req.body);
    res.status(201).json(category);
  });

  app.put(api.categories.update.path, isAdmin, async (req, res) => {
    const category = await storage.updateCategory(Number(req.params.id), req.body);
    res.json(category);
  });

  app.delete(api.categories.delete.path, isAdmin, async (req, res) => {
    await storage.deleteCategory(Number(req.params.id));
    res.sendStatus(204);
  });

  // Cart
  app.get(api.cart.get.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const cart = await storage.getCart(req.user.id);
    res.json(cart);
  });

  app.post(api.cart.add.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const item = await storage.addToCart({ ...req.body, userId: req.user.id });
    res.status(201).json(item);
  });

  app.patch(api.cart.update.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const item = await storage.updateCartItem(Number(req.params.id), req.body.quantity);
    res.json(item);
  });

  app.delete(api.cart.remove.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    await storage.removeFromCart(Number(req.params.id));
    res.sendStatus(204);
  });

  // Orders
  app.get(api.orders.list.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // If admin, show all? For now, stick to personal unless admin route
    const userId = req.user.role === 'admin' ? undefined : req.user.id;
    const orders = await storage.getOrders(userId);
    res.json(orders);
  });

  app.post(api.orders.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    
    // Get cart items
    const cartItems = await storage.getCart(req.user.id);
    if (cartItems.length === 0) return res.status(400).send("Cart is empty");

    // Calculate total and prepare order items
    let total = 0;
    const orderItemsData = cartItems.map(item => {
      const price = Number(item.product.price);
      total += price * item.quantity;
      return {
        productId: item.product.id,
        quantity: item.quantity,
        price
      };
    });

    // Create order
    const order = await storage.createOrder({
      userId: req.user.id,
      address: req.body.address,
      total: total.toString(),
      status: 'pending'
    }, orderItemsData);

    // Clear cart
    await storage.clearCart(req.user.id);

    res.status(201).json(order);
  });

  app.patch(api.orders.updateStatus.path, isAdmin, async (req, res) => {
    const order = await storage.updateOrderStatus(Number(req.params.id), req.body.status);
    res.json(order);
  });

  // Stats
  app.get(api.stats.get.path, isAdmin, async (req, res) => {
    const stats = await storage.getStats();
    res.json(stats);
  });

  // Seed Data
  if (process.env.NODE_ENV !== "production") {
    await seedDatabase();
  }

  return httpServer;
}

async function seedDatabase() {
  const users = await storage.getUserByUsername("admin");
  if (!users) {
    console.log("Seeding database...");
    
    // Create admin
    // Note: Password hashing is handled in auth.ts usually, but for seed we need to do it manually or skip auth flow
    // Ideally use the same hash function. For simplicity here I'll assume a helper or just insert a raw hash if I knew it.
    // I'll skip creating users via storage directly if they need hashing.
    // Instead, I'll rely on registration or manual creation.
    // Actually, I should create categories and products.
    
    const cats = await storage.getCategories();
    if (cats.length === 0) {
        const c1 = await storage.createCategory({ name: "Electronics", slug: "electronics", description: "Gadgets and devices" });
        const c2 = await storage.createCategory({ name: "Clothing", slug: "clothing", description: "Apparel and fashion" });
        
        await storage.createProduct({
            categoryId: c1.id,
            name: "Smartphone X",
            description: "Latest model with high-res camera",
            price: "999.00",
            stock: 50,
            imageUrl: "https://placehold.co/600x400?text=Smartphone"
        });
        
        await storage.createProduct({
            categoryId: c1.id,
            name: "Laptop Pro",
            description: "Powerful laptop for professionals",
            price: "1499.00",
            stock: 20,
            imageUrl: "https://placehold.co/600x400?text=Laptop"
        });

        await storage.createProduct({
            categoryId: c2.id,
            name: "Classic T-Shirt",
            description: "Cotton t-shirt",
            price: "29.99",
            stock: 100,
            imageUrl: "https://placehold.co/600x400?text=T-Shirt"
        });
    }
    
    console.log("Database seeded!");
  }
}
