import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/utils/toast";
import { api } from "@/api";
import RegistrationForm from "./RegistrationForm";

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const switchToRegister = () => setIsRegistering(true);
  const switchToLogin = () => setIsRegistering(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.post("/parent/login", {
        username: email,
        password: password,
      });

      if (response.status === 200) {
        const userData = {
          email,
          name: response.data.name || "User",
          access_token: response.data.access_token,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        onLogin(userData);
        toast.success("Login successful!");
      }
    } catch (err: any) {
      toast.error("Login failed. Please check your credentials.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{isRegistering ? "Create an Account" : "Login to Your Account"}</CardTitle>
        <CardDescription>
          {isRegistering
            ? "Fill out the form below to create your account"
            : "Enter your credentials to access your account"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isRegistering ? (
          <RegistrationForm onSuccess={onLogin} switchToLogin={switchToLogin} />
        ) : (
          <form onSubmit={handleLogin} className="space-y-4 w-full">
            <div className="space-y-2">
              <Label htmlFor="login-email">Email</Label>
              <Input
                id="login-email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="login-password">Password</Label>
              <Input
                id="login-password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-purple hover:bg-purple-600"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 border-t-2 border-b-2 border-white rounded-full animate-spin"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </Button>

            <div className="text-center mt-4">
              <Button
                type="button"
                variant="link"
                onClick={switchToRegister}
                className="text-brand-purple hover:text-purple-600"
              >
                Don't have an account? Register
              </Button>
            </div>
          </form>
        )}
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2">
        <p className="text-center text-sm text-muted-foreground mt-2">
          By {isRegistering ? "registering" : "logging in"}, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
