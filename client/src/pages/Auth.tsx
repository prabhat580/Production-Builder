import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

// Schemas
const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

const registerSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  name: z.string().min(2, "Name is required"),
  role: z.enum(["customer", "admin"]).default("customer"),
});

export default function Auth() {
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const [location, setLocation] = useLocation();
  
  // Parse tab from URL
  const searchParams = new URLSearchParams(window.location.search);
  const defaultTab = searchParams.get("tab") === "register" ? "register" : "login";

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const loginForm = useForm({
    resolver: zodResolver(loginSchema),
  });

  const registerForm = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { role: "customer" }
  });

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Visuals */}
      <div className="hidden lg:flex flex-col bg-primary text-primary-foreground p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557821552-17105176677c?w=1600&h=900&fit=crop')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        {/* Unsplash abstract shopping cart/pattern background */}
        
        <div className="relative z-10 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-3xl font-display font-medium leading-relaxed">
              "The best way to predict the future is to create it. Join thousands of shoppers discovering the extraordinary."
            </p>
            <footer className="text-lg opacity-80 pt-4">— ShopFlow Team</footer>
          </blockquote>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex items-center justify-center p-6 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold font-display tracking-tight">Welcome to ShopFlow</h1>
            <p className="text-sm text-muted-foreground mt-2">Enter your credentials to continue</p>
          </div>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-none shadow-none">
                <form onSubmit={loginForm.handleSubmit((data) => login(data))}>
                  <CardContent className="space-y-4 px-0">
                    <div className="space-y-2">
                      <Label htmlFor="username">Username</Label>
                      <Input id="username" {...loginForm.register("username")} />
                      {loginForm.formState.errors.username && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.username.message as string}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input id="password" type="password" {...loginForm.register("password")} />
                      {loginForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{loginForm.formState.errors.password.message as string}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="px-0 flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={isLoggingIn}>
                      {isLoggingIn && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-none shadow-none">
                <form onSubmit={registerForm.handleSubmit((data) => register(data as any))}>
                  <CardContent className="space-y-4 px-0">
                    <div className="space-y-2">
                      <Label htmlFor="reg-name">Full Name</Label>
                      <Input id="reg-name" {...registerForm.register("name")} />
                      {registerForm.formState.errors.name && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.name.message as string}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-username">Username</Label>
                      <Input id="reg-username" {...registerForm.register("username")} />
                      {registerForm.formState.errors.username && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.username.message as string}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reg-password">Password</Label>
                      <Input id="reg-password" type="password" {...registerForm.register("password")} />
                      {registerForm.formState.errors.password && (
                        <p className="text-xs text-destructive">{registerForm.formState.errors.password.message as string}</p>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="px-0 flex flex-col gap-4">
                    <Button type="submit" className="w-full h-11" disabled={isRegistering}>
                      {isRegistering && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
