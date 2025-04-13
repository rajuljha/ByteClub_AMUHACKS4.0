
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound } from "lucide-react";
import { toast } from "@/utils/toast";

interface QuizPasswordProps {
  quizName: string;
  password: string;
  onPasswordVerified: () => void;
}

const QuizPassword = ({ quizName, password, onPasswordVerified }: QuizPasswordProps) => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  const handleVerifyPassword = () => {
    setIsChecking(true);
    
    // Simulate verification delay
    setTimeout(() => {
      if (enteredPassword === password) {
        onPasswordVerified();
      } else {
        toast.error("Incorrect password. Please try again.");
      }
      setIsChecking(false);
    }, 500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyPassword();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{quizName}</CardTitle>
          <CardDescription className="text-center">
            This quiz is password protected
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-center mb-4">
            <div className="bg-brand-lightPurple p-3 rounded-full">
              <Lock className="h-6 w-6 text-brand-purple" />
            </div>
          </div>
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter quiz password"
              value={enteredPassword}
              onChange={(e) => setEnteredPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-300"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-brand-purple hover:bg-purple-600 flex gap-2 items-center" 
            onClick={handleVerifyPassword}
            disabled={isChecking || !enteredPassword}
          >
            {isChecking ? (
              <>
                <div className="h-4 w-4 border-t-2 border-white rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <KeyRound className="h-4 w-4" />
                Start Quiz
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizPassword;
