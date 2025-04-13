import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Clock, AlertCircle } from "lucide-react";

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  question: string;
  choice_A : string;
  choice_B : string;
  choice_C : string;
  choice_D : string;
  correctOptionId: string;
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

  console.log(question);
  

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
          <RadioGroup value={selectedOption || ""} onValueChange={onSelectOption} className="space-y-3">
              <div className="flex items-center space-x-2 border rounded-md p-3 hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={question.choice_A} id={question.choice_A} />
                <Label htmlFor={question.choice_A} className="flex-1 cursor-pointer">{question.choice_A}</Label>
                <RadioGroupItem value={question.choice_B} id={question.choice_B} />
                <Label htmlFor={question.choice_B} className="flex-1 cursor-pointer">{question.choice_B}</Label>
                <RadioGroupItem value={question.choice_C} id={question.choice_C} />
                <Label htmlFor={question.choice_C} className="flex-1 cursor-pointer">{question.choice_C}</Label>
                <RadioGroupItem value={question.choice_D} id={question.choice_D} />
                <Label htmlFor={question.choice_D} className="flex-1 cursor-pointer">{question.choice_D}</Label>
              </div>
          </RadioGroup>

          {!selectedOption && (
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
              disabled={!selectedOption}
              className="bg-brand-purple hover:bg-purple-600 gap-1"
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              onClick={onNext}
              disabled={!selectedOption}
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
