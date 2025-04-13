import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/utils/toast";
import axios from "axios";
import { api } from "@/api";


interface RegistrationFormProps {
  onSuccess: (userData: any) => void;
  switchToLogin: () => void;
}

const RegistrationForm = ({ onSuccess, switchToLogin }: RegistrationFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      setIsLoading(false);
      return;
    }
    
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await api.post('/parent/register', {
        username: email,
        password: password,
        name: name
      });

      console.log(response);

      if (response.status === 200) {
        const userData = {
          name: name,
          email: email,
          access_token: response.data.access_token,
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        onSuccess(userData);
        toast.success("Registration successful!");
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        const errorMessage = error.response.data.detail[0]?.msg || "Validation error occurred";
        toast.error(errorMessage);
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleRegister} className="space-y-4 w-full">
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name"
          type="text" 
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-email">Email</Label>
        <Input 
          id="register-email"
          type="email" 
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="register-password">Password</Label>
        <Input 
          id="register-password"
          type="password" 
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm Password</Label>
        <Input 
          id="confirm-password"
          type="password" 
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
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
            <span>Registering...</span>
          </div>
        ) : (
          "Register"
        )}
      </Button>
      
      <div className="text-center mt-4">
        <Button 
          type="button" 
          variant="link" 
          onClick={switchToLogin}
          className="text-brand-purple hover:text-purple-600"
        >
          Already have an account? Log in
        </Button>
      </div>
    </form>
  );
};

export default RegistrationForm;
