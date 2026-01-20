import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserRole } from "@/types/booking";
import { User, Wrench, Shield, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { register } from "@/api/api";
import { z } from "zod";

// Validation schema
const registrationSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name must be less than 100 characters"),
  email: z.string().trim().email("Invalid email address").max(255, "Email must be less than 255 characters"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128, "Password must be less than 128 characters"),
  confirmPassword: z.string(),
  phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format").optional().or(z.literal("")),
  serviceArea: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Register() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);
  
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    serviceArea: "",
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    try {
      // Validate provider has serviceArea
      if (activeRole === UserRole.PROVIDER && !formData.serviceArea.trim()) {
        setErrors({ serviceArea: "Service area is required for providers" });
        return false;
      }
      registrationSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: activeRole,
        serviceArea: activeRole === UserRole.PROVIDER ? formData.serviceArea : undefined,
      });
      
      toast({ 
        title: "Registration Successful!", 
        description: "Please log in with your new account" 
      });
      
      navigate("/login");
    } catch (error: any) {
      const errorMessage = error?.message || "Registration failed. Please try again.";
      
      // Handle specific error cases
      if (error?.code === "USER_EXISTS") {
        toast({ 
          title: "Account Exists", 
          description: "An account with this email already exists. Please log in instead.", 
          variant: "destructive" 
        });
      } else {
        toast({ 
          title: "Registration Failed", 
          description: errorMessage, 
          variant: "destructive" 
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    [UserRole.CUSTOMER]: User,
    [UserRole.PROVIDER]: Wrench,
    [UserRole.ADMIN]: Shield,
  };

  const roleDescriptions = {
    [UserRole.CUSTOMER]: "Book professional home services",
    [UserRole.PROVIDER]: "Offer your services and grow your business",
    [UserRole.ADMIN]: "Manage and oversee platform operations",
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>Join Clean Fanatics today</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Role Tabs */}
            <Tabs value={activeRole} onValueChange={(v) => {
              setActiveRole(v as UserRole);
              setErrors({});
            }}>
              <TabsList className="grid grid-cols-3 w-full mb-6">
                {Object.values(UserRole).map((role) => {
                  const Icon = roleIcons[role];
                  return (
                    <TabsTrigger key={role} value={role} className="gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="hidden sm:inline">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>

              {Object.values(UserRole).map((role) => (
                <TabsContent key={role} value={role}>
                  <p className="text-sm text-muted-foreground text-center mb-4">
                    {roleDescriptions[role]}
                  </p>
                  
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={errors.name ? "border-destructive" : ""}
                      />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={errors.email ? "border-destructive" : ""}
                      />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="+1234567890"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={errors.phone ? "border-destructive" : ""}
                      />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    
                    {role === UserRole.PROVIDER && (
                      <div className="space-y-2">
                        <Label htmlFor="serviceArea">Service Area *</Label>
                        <Input
                          id="serviceArea"
                          name="serviceArea"
                          type="text"
                          placeholder="e.g., New York City"
                          value={formData.serviceArea}
                          onChange={handleInputChange}
                          className={errors.serviceArea ? "border-destructive" : ""}
                        />
                        {errors.serviceArea && <p className="text-sm text-destructive">{errors.serviceArea}</p>}
                      </div>
                    )}
                    
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="At least 8 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && <p className="text-sm text-destructive">{errors.confirmPassword}</p>}
                    </div>
                    
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        `Create ${role.charAt(0) + role.slice(1).toLowerCase()} Account`
                      )}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link to="/login" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-4">
          <Link to="/" className="hover:text-foreground inline-flex items-center gap-1">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
}
