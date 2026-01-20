import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useApp } from "@/contexts/AppContext";
import { UserRole } from "@/types/booking";
import { User, Wrench, Shield, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { login, isMockMode, setMockMode } = useApp();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeRole, setActiveRole] = useState<UserRole>(UserRole.CUSTOMER);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email || `demo@${activeRole.toLowerCase()}.com`, password || "demo123", activeRole);
      
      toast({ title: "Welcome!", description: `Logged in as ${activeRole}` });
      
      // Navigate to appropriate dashboard
      switch (activeRole) {
        case UserRole.CUSTOMER:
          navigate("/customer");
          break;
        case UserRole.PROVIDER:
          navigate("/provider");
          break;
        case UserRole.ADMIN:
          navigate("/admin");
          break;
      }
    } catch (error) {
      toast({ title: "Error", description: `${error.message}`, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const roleIcons = {
    [UserRole.CUSTOMER]: User,
    [UserRole.PROVIDER]: Wrench,
    [UserRole.ADMIN]: Shield,
  };

  return (
    <div className="min-h-screen bg-muted/30 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        <Card>
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Demo Mode Toggle */}
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg mb-6">
              <div>
                <p className="font-medium text-sm">Demo Mode</p>
                <p className="text-xs text-muted-foreground">Use mock data for testing</p>
              </div>
              <Switch checked={isMockMode} onCheckedChange={setMockMode} />
            </div>

            {/* Role Tabs */}
            <Tabs value={activeRole} onValueChange={(v) => setActiveRole(v as UserRole)}>
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
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder={`demo@${role.toLowerCase()}.com`}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <Button type="submit" className="w-full" disabled={loading}>
                      {loading ? "Signing in..." : `Sign in as ${role.charAt(0) + role.slice(1).toLowerCase()}`}
                    </Button>
                  </form>
                </TabsContent>
              ))}
            </Tabs>

            <p className="text-center text-sm text-muted-foreground mt-4">
              Demo mode: Leave fields empty to use demo credentials
            </p>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link to="/register" className="text-primary hover:underline font-medium">
                Create one
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
