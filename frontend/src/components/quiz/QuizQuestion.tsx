import React, { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface Question {
  id: string;
  question: string;
  choice_A: string;
  choice_B: string;
  choice_C: string;
  choice_D: string;
  answer: string;
}

interface QuizQuestionProps {
  question: Question;
  currentQuestion: number;
  totalQuestions: number;
  selectedOption: string | null;
  timeRemaining: string;
  onSelectOption: (optionId: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onSubmit: () => void;
}

const QuizQuestion = ({
  question,
  currentQuestion,
  totalQuestions,
  selectedOption,
  timeRemaining,
  onSelectOption,
  onNext,
  onPrevious,
  onSubmit
}: QuizQuestionProps) => {
  const isLastQuestion = currentQuestion === totalQuestions;
  

  const [localSelected, setLocalSelected] = useState<string | null>(selectedOption);
  
  
  console.log(question.question);
  
  useEffect(() => {
    setLocalSelected(selectedOption);
  }, [question, selectedOption]);
  
  const handleOptionSelect = (optionId: string) => {
    console.log(`Option selected: ${optionId}`);
    setLocalSelected(optionId);
    onSelectOption(optionId);
  };

  // Custom next handler to reset selection after moving to next question
  const handleNext = () => {
    onNext();
  };

  return (
    <div className="container max-w-2xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm font-medium">
          Question {currentQuestion} of {totalQuestions}
        </div>
        <div className="flex items-center gap-1 bg-gray-100 px-3 py-1 rounded-full text-sm">
          <Clock className="h-4 w-4 text-brand-purple" />
          <span>{timeRemaining} remaining</span>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            <span className="mr-2 text-brand-purple font-bold">{currentQuestion}.</span>
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Option A */}
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                localSelected === "A" ? "bg-purple-50 border-purple-300" : ""
              }`}
              onClick={() => handleOptionSelect("A")}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-300">
                {localSelected === "A" && (
                  <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                )}
              </div>
              <div className="flex-1">{question.choice_A}</div>
            </div>
            
            {/* Option B */}
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                localSelected === "B" ? "bg-purple-50 border-purple-300" : ""
              }`}
              onClick={() => handleOptionSelect("B")}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-300">
                {localSelected === "B" && (
                  <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                )}
              </div>
              <div className="flex-1">{question.choice_B}</div>
            </div>
            
            {/* Option C */}
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                localSelected === "C" ? "bg-purple-50 border-purple-300" : ""
              }`}
              onClick={() => handleOptionSelect("C")}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-300">
                {localSelected === "C" && (
                  <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                )}
              </div>
              <div className="flex-1">{question.choice_C}</div>
            </div>
            
            {/* Option D */}
            <div 
              className={`flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                localSelected === "D" ? "bg-purple-50 border-purple-300" : ""
              }`}
              onClick={() => handleOptionSelect("D")}
            >
              <div className="flex items-center justify-center w-4 h-4 rounded-full border border-gray-300">
                {localSelected === "D" && (
                  <div className="w-2 h-2 rounded-full bg-brand-purple"></div>
                )}
              </div>
              <div className="flex-1">{question.choice_D}</div>
            </div>
          </div>

          {!localSelected && (
            <div className="flex items-center gap-2 mt-4 text-amber-600 text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>Please select an answer to continue</span>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={currentQuestion === 1}
            className="gap-1"
          >
            <ChevronLeft className="h-4 w-4" /> Previous
          </Button>

          {isLastQuestion ? (
            <Button
              onClick={onSubmit}
              disabled={!localSelected}
              className="bg-brand-purple hover:bg-purple-600 gap-1"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              disabled={!localSelected}
              className="gap-1"
            >
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizQuestion;