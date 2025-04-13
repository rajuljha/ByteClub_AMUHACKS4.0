
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/utils/toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface EmailLoginButtonProps {
  onSuccess: (userData: any) => void;
  switchToRegister: () => void;
}

const EmailLoginButton = ({ onSuccess, switchToRegister }: EmailLoginButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // This is a mock implementation - in a real app we would connect to a backend
    setTimeout(() => {
      // Simple validation
      if (!email || !password) {
        toast.error("Please enter both email and password");
        setIsLoading(false);
        return;
      }
      
      // Mock user data - in a real implementation this would be from a database
      const mockUserData = {
        id: "user_123",
        name: email.split('@')[0], // Use part of email as name for demo
        email: email,
        picture: `https://i.pravatar.cc/150?u=${email}`
      };
      
      localStorage.setItem("user", JSON.stringify(mockUserData));
      onSuccess(mockUserData);
      toast.success("Logged in successfully!");
      setIsLoading(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input 
          id="email"
          type="email" 
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password"
          type="password" 
          placeholder="Your password"
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
          "Log In"
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
  );
};

export default EmailLoginButton;
