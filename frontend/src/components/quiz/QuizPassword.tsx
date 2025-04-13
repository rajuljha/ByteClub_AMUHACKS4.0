import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Lock, KeyRound, Eye, EyeOff } from "lucide-react"; // Importing eye icons for visibility toggle
import { toast } from "@/utils/toast";
import axios from "axios";

interface QuizPasswordProps {
  quizId: string;
  quizName: string;
  password: string;
  // onPasswordVerified: () => void;
  onPasswordVerified: (name: string) => void; // Changed to pass the name
}

const QuizPassword = ({ quizId, quizName, password, onPasswordVerified }: QuizPasswordProps) => {
  const [enteredPassword, setEnteredPassword] = useState("");
  const [enteredName, setEnteredName] = useState(""); 
  const [isChecking, setIsChecking] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleVerifyPassword = async () => {
    setIsChecking(true);

    console.log(quizId, password);
    
    if (enteredPassword == password) {
      try {
        const response = await axios.post(
          `http://localhost:8000/quiz/quizzes/start/${quizId}`,
          {
            password: enteredPassword,
            name: enteredName,
          }
        );

        console.log(response);
        

        if (response.status === 200) {
          toast.success("Quiz started successfully!");
          onPasswordVerified(enteredName); // Pass name to parent
        }
      } catch (error) {
        console.error("Error starting the quiz:", error);
        toast.error("Failed to start the quiz. Please try again.");
      }
    } else {
      toast.error("Incorrect password. Please try again.");
    }

    setIsChecking(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleVerifyPassword();
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
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
            {/* Name input field */}
            <Input
              type="text"
              placeholder="Enter your name"
              value={enteredName}
              onChange={(e) => setEnteredName(e.target.value)}
              onKeyDown={handleKeyDown}
              className="border-gray-300"
            />
            {/* Password input field */}
            <div className="relative">
              <Input
                type={passwordVisible ? "text" : "password"} 
                placeholder="Enter quiz password"
                value={enteredPassword}
                onChange={(e) => setEnteredPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                className="border-gray-300 pr-10"
              />
              {/* Eye icon to toggle password visibility */}
              <Button
                type="button"
                className="absolute right-1 top-0.5 text-gray-600"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? (
                  <EyeOff className="h-3 w-3" />
                ) : (
                  <Eye className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full bg-brand-purple hover:bg-purple-600 flex gap-2 items-center"
            onClick={handleVerifyPassword}
            disabled={isChecking || !enteredPassword || !enteredName} 
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
