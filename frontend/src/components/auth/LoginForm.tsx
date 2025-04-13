
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import GoogleLoginButton from "./GoogleLoginButton";

interface LoginFormProps {
  onLogin: (userData: any) => void;
}

const LoginForm = ({ onLogin }: LoginFormProps) => {
  return (
    <Card className="w-full max-w-md">
      <CardContent className="grid gap-4 mt-5">
        <GoogleLoginButton onSuccess={onLogin} />
      </CardContent>
      <CardFooter className="flex flex-col items-center justify-center gap-2">
        <p className="text-center text-sm text-muted-foreground mt-2">
          By logging in, you agree to our Terms of Service and Privacy Policy.
        </p>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
