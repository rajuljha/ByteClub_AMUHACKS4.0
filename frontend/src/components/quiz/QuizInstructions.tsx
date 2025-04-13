
import React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, School, Award, PlayCircle } from "lucide-react";

interface QuizInstructionsProps {
  quiz: {
    name: string;
    topic: string;
    class: string;
    schoolBoard: string;
    numberOfQuestions: string;
    timeInMinutes: string;
  };
  onStartQuiz: () => void;
}

const QuizInstructions = ({ quiz, onStartQuiz }: QuizInstructionsProps) => {
  return (
    <div className="flex justify-center items-center min-h-[70vh] px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">{quiz.name}</CardTitle>
          <CardDescription className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" /> {quiz.topic}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-3">Instructions</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-brand-purple" />
                <div>
                  <p className="font-medium">Time Limit</p>
                  <p className="text-sm text-gray-500">{quiz.timeInMinutes} minutes to complete the quiz</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <Award className="h-5 w-5 text-brand-purple" />
                <div>
                  <p className="font-medium">Questions</p>
                  <p className="text-sm text-gray-500">{quiz.numberOfQuestions} questions to answer</p>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <School className="h-5 w-5 text-brand-purple" />
                <div>
                  <p className="font-medium">Curriculum</p>
                  <p className="text-sm text-gray-500">Grade {quiz.class} · {quiz.schoolBoard}</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 p-3 rounded-md text-sm">
            <p className="font-medium text-amber-800">Important Notes:</p>
            <ul className="list-disc list-inside mt-1 text-amber-700 space-y-1">
              <li>Once started, the timer cannot be paused</li>
              <li>Complete all questions before submitting</li>
              <li>Your results will be shown at the end</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-brand-purple hover:bg-purple-600 flex gap-2 items-center" 
            onClick={onStartQuiz}
          >
            <PlayCircle className="h-4 w-4" />
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default QuizInstructions;
