
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import EmailLoginButton from "./EmailLoginButton";
import RegistrationForm from "./RegistrationForm";

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  const [isRegistering, setIsRegistering] = useState(false);

  const switchToRegister = () => {
    setIsRegistering(true);
  };

  const switchToLogin = () => {
    setIsRegistering(false);
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
      <CardContent className="grid gap-4">
        {isRegistering ? (
          <RegistrationForm onSuccess={onLogin} switchToLogin={switchToLogin} />
        ) : (
          <EmailLoginButton onSuccess={onLogin} switchToRegister={switchToRegister} />
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
