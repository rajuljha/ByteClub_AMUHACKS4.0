
import React from "react";
import QuizInterface from "@/components/quiz/QuizInterface";
import { Toaster } from "@/components/ui/sonner";

const QuizPlayerPage = () => {
  return (
    <>
      <Toaster position="top-right" />
      <QuizInterface />
    </>
  );
};

export default QuizPlayerPage;
