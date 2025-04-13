
import React, { useState, useEffect } from "react";
import QuizPassword from "./QuizPassword";
import QuizInstructions from "./QuizInstructions";
import QuizQuestion from "./QuizQuestion";
import QuizResultModal from "./QuizResultModal";
import { toast } from "@/utils/toast";
import { Button } from "../ui/button";

// Sample quiz data structure
interface Quiz {
  id: string;
  name: string;
  topic: string;
  class: string;
  schoolBoard: string;
  numberOfQuestions: string;
  timeInMinutes: string;
  password: string;
  questions: Question[];
}

interface Option {
  id: string;
  text: string;
}

interface Question {
  id: string;
  text: string;
  options: Option[];
  correctOptionId: string;
}

interface QuizResult {
  quizName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: string;
  attemptedAt: string;
}

// Sample quiz data (in a real app this would come from an API)
const sampleQuiz: Quiz = {
  id: "quiz-123",
  name: "Mathematics Quiz",
  topic: "Algebra",
  class: "8",
  schoolBoard: "CBSE",
  numberOfQuestions: "5",
  timeInMinutes: "15",
  password: "quiz123",
  questions: [
    {
      id: "q1",
      text: "What is the value of x in the equation 2x + 5 = 15?",
      options: [
        { id: "q1-a", text: "5" },
        { id: "q1-b", text: "10" },
        { id: "q1-c", text: "15" },
        { id: "q1-d", text: "20" },
      ],
      correctOptionId: "q1-a"
    },
    {
      id: "q2",
      text: "Simplify: 3(2x - 4) = 18",
      options: [
        { id: "q2-a", text: "x = 3" },
        { id: "q2-b", text: "x = 5" },
        { id: "q2-c", text: "x = 6" },
        { id: "q2-d", text: "x = 7" },
      ],
      correctOptionId: "q2-b"
    },
    {
      id: "q3",
      text: "Factor the expression: x² - 9",
      options: [
        { id: "q3-a", text: "(x-3)(x+3)" },
        { id: "q3-b", text: "(x-9)(x+1)" },
        { id: "q3-c", text: "(x-3)²" },
        { id: "q3-d", text: "(x+3)²" },
      ],
      correctOptionId: "q3-a"
    },
    {
      id: "q4",
      text: "Solve for x: 4x - 2 = 10",
      options: [
        { id: "q4-a", text: "x = 2" },
        { id: "q4-b", text: "x = 3" },
        { id: "q4-c", text: "x = 4" },
        { id: "q4-d", text: "x = 8" },
      ],
      correctOptionId: "q4-b"
    },
    {
      id: "q5",
      text: "What is the slope of the line passing through (2,3) and (4,7)?",
      options: [
        { id: "q5-a", text: "1" },
        { id: "q5-b", text: "2" },
        { id: "q5-c", text: "3" },
        { id: "q5-d", text: "4" },
      ],
      correctOptionId: "q5-b"
    }
  ]
};

enum QuizState {
  PASSWORD,
  INSTRUCTIONS,
  QUESTIONS,
  COMPLETED
}

const QuizInterface = () => {
  // In a real app, we'd fetch the quiz data based on URL params
  const quiz = sampleQuiz;
  
  const [quizState, setQuizState] = useState<QuizState>(QuizState.PASSWORD);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(parseInt(quiz.timeInMinutes) * 60);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Timer effect
  useEffect(() => {
    let timer: number | undefined;
    
    if (quizState === QuizState.QUESTIONS && timeRemaining > 0) {
      timer = window.setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [quizState, timeRemaining]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handlePasswordVerified = () => {
    setQuizState(QuizState.INSTRUCTIONS);
  };

  const handleStartQuiz = () => {
    setQuizState(QuizState.QUESTIONS);
    setStartTime(new Date());
  };

  const handleSelectOption = (optionId: string) => {
    setAnswers(prev => ({
      ...prev,
      [quiz.questions[currentQuestionIndex].id]: optionId
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const endTime = new Date();
    const startTimeValue = startTime || endTime; // Fallback
    
    // Calculate time taken
    const timeTakenMs = endTime.getTime() - startTimeValue.getTime();
    const timeTakenMinutes = Math.floor(timeTakenMs / 60000);
    const timeTakenSeconds = Math.floor((timeTakenMs % 60000) / 1000);
    const timeTakenFormatted = `${timeTakenMinutes}m ${timeTakenSeconds}s`;
    
    // Calculate score
    let correctCount = 0;
    let incorrectCount = 0;
    
    quiz.questions.forEach(question => {
      const userAnswer = answers[question.id];
      if (userAnswer === question.correctOptionId) {
        correctCount++;
      } else if (userAnswer) {
        incorrectCount++;
      }
    });

    // Create result object
    const result: QuizResult = {
      quizName: quiz.name,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      timeTaken: timeTakenFormatted,
      attemptedAt: endTime.toISOString()
    };
    
    setQuizResult(result);
    setQuizState(QuizState.COMPLETED);
    setShowResults(true);
    
    // Show score in toast
    const percentage = Math.round((correctCount / quiz.questions.length) * 100);
    toast.success(`Quiz completed with score: ${percentage}%`);
  };

  const renderCurrentView = () => {
    switch (quizState) {
      case QuizState.PASSWORD:
        return (
          <QuizPassword 
            quizName={quiz.name} 
            password={quiz.password} 
            onPasswordVerified={handlePasswordVerified} 
          />
        );
        
      case QuizState.INSTRUCTIONS:
        return (
          <QuizInstructions 
            quiz={quiz} 
            onStartQuiz={handleStartQuiz} 
          />
        );
        
      case QuizState.QUESTIONS:
        return (
          <QuizQuestion
            question={quiz.questions[currentQuestionIndex]}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quiz.questions.length}
            selectedOption={answers[quiz.questions[currentQuestionIndex].id] || null}
            timeRemaining={formatTime(timeRemaining)}
            onSelectOption={handleSelectOption}
            onNext={handleNextQuestion}
            onPrevious={handlePreviousQuestion}
            onSubmit={handleSubmitQuiz}
          />
        );
        
      case QuizState.COMPLETED:
        return (
          <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-md text-center">
              <h2 className="text-2xl font-bold mb-2">Quiz Completed!</h2>
              <p className="mb-6 text-gray-600">Your results have been recorded.</p>
              <Button 
                onClick={() => setShowResults(true)}
                className="bg-brand-purple hover:bg-purple-600"
              >
                View Results
              </Button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Simple header */}
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-purple-600">
            Quizly
          </span>
        </div>
      </header>

      {/* Quiz content */}
      <main className="flex-1">
        {renderCurrentView()}
      </main>

      {/* Quiz result modal */}
      {quizResult && (
        <QuizResultModal
          open={showResults}
          onOpenChange={setShowResults}
          result={quizResult}
        />
      )}
    </div>
  );
};

export default QuizInterface;
