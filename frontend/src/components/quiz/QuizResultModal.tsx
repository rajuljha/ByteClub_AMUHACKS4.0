
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, Clock, Award, BarChart } from "lucide-react";

interface QuizResultModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  result: {
    quizName: string;
    totalQuestions: number;
    correctAnswers: number;
    incorrectAnswers: number;
    timeTaken: string;
    attemptedAt: string;
  } | null;
}

const QuizResultModal = ({ open, onOpenChange, result }: QuizResultModalProps) => {
  if (!result) return null;

  const percentageScore = Math.round((result.correctAnswers / result.totalQuestions) * 100);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl">Quiz Results: {result.quizName}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Score Percentage */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Score</h3>
              <span className="text-lg font-bold">{percentageScore}%</span>
            </div>
            <Progress value={percentageScore} className="h-2" />
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-500">Correct</p>
                <p className="font-medium">{result.correctAnswers}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg">
              <XCircle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm text-gray-500">Incorrect</p>
                <p className="font-medium">{result.incorrectAnswers}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Clock className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-500">Time Taken</p>
                <p className="font-medium">{result.timeTaken}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Award className="h-5 w-5 text-brand-purple" />
              <div>
                <p className="text-sm text-gray-500">Questions</p>
                <p className="font-medium">{result.totalQuestions}</p>
              </div>
            </div>
          </div>

          {/* Attempted Date */}
          <div className="text-sm text-gray-500 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Attempted on {formatDate(result.attemptedAt)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResultModal;
