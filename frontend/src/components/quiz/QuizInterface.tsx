import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import QuizPassword from "./QuizPassword";
import QuizInstructions from "./QuizInstructions";
import QuizQuestion from "./QuizQuestion";
import QuizResultModal from "./QuizResultModal";
import { toast } from "@/utils/toast";
import { Button } from "../ui/button";
import axios from "axios";
import { api } from "@/api";

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
  answer: string;
}

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

interface QuizResult {
  quizName: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: string;
  attemptedAt: string;
}

enum QuizState {
  PASSWORD,
  INSTRUCTIONS,
  QUESTIONS,
  COMPLETED
}

const QuizInterface = () => {
  const { quizId } = useParams<{ quizId: string }>(); 
  const [quizState, setQuizState] = useState<QuizState>(QuizState.PASSWORD);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  const [userName, setUserName] = useState<string>(""); 


  // Fetch quiz data based on quizId from URL
  useEffect(() => {
    const fetchQuizData = async () => {
      try {
        const response = await api.get(`/quiz/quizzes/${quizId}`);

        // Set the quiz data
        setQuiz(response.data);
        setTimeRemaining(parseInt(response.data.exec_time) * 60);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    };

    fetchQuizData();
  }, [quizId]); 

  console.log(quiz);
  

  const handlePasswordVerified = (name: string) => {
    setUserName(name); 
    setQuizState(QuizState.INSTRUCTIONS);
  };

  const handleStartQuiz = () => {
    setQuizState(QuizState.QUESTIONS);
    setStartTime(new Date());
  };
  const handleSelectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: optionId,
    }));
  };
  

  const handleNextQuestion = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleCloseQuiz = () => {
    window.close();
  };

  const handleSubmitQuiz = async () => {
    const endTime = new Date();
    const timeTakenMs = endTime.getTime() - (startTime?.getTime() || endTime.getTime());
    const timeTakenMinutes = Math.floor(timeTakenMs / 60000);
    const timeTakenSeconds = Math.floor((timeTakenMs % 60000) / 1000);
    const timeTakenFormatted = `${timeTakenMinutes}m ${timeTakenSeconds}s`;
  
    const evaluatedAnswers = quiz?.questions.map((question, index) => {
      return answers[index]; 
    });
  
    console.log("Submitting the following answers:", evaluatedAnswers); 
    
  
    try {
      
      const response = await api.post(
        `/quiz/quizzes/${quizId}/submit_answers`,
        {
          name: userName, 
          answers: evaluatedAnswers, 
        },
      );
  
      console.log("Response from server:", response.data); 
  
      const { score, total } = response.data;

      setQuizResult({
        quizName: quiz?.name || "",
        totalQuestions: total,
        correctAnswers: score,
        incorrectAnswers: total - score,
        timeTaken: timeTakenFormatted,
        attemptedAt: endTime.toISOString(),
      });
      setQuizState(QuizState.COMPLETED);
      setShowResults(true);
  
      toast.success(`Quiz completed with score: ${score}/${total}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz answers. Please try again.");
    }
  };
  

  const renderCurrentView = () => {
    switch (quizState) {
      case QuizState.PASSWORD:
        return (
          <QuizPassword
            quizId={quizId || ""}
            quizName={quiz?.name || ""}
            password={quiz?.password || ""}
            onPasswordVerified={handlePasswordVerified}
          />
        );

      case QuizState.INSTRUCTIONS:
        return <QuizInstructions quiz={quiz} onStartQuiz={handleStartQuiz} />;

      case QuizState.QUESTIONS:
        return (
          <QuizQuestion
            question={quiz?.questions[currentQuestionIndex]}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={quiz?.questions.length || 0}
            selectedOption={answers[quiz?.questions[currentQuestionIndex].id] || null}
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
              <Button onClick={() => setShowResults(true)} className="bg-brand-purple hover:bg-purple-600">
                View Results
              </Button>
              {/* // close tab */}
              <Button onClick={handleCloseQuiz}  className="ml-4 bg-red-600 hover:bg-purple-600">
                Close
              </Button>
            </div>
          </div>
        );
    }
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b bg-white">
        <div className="container flex h-16 items-center justify-between px-4 md:px-6">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-purple to-purple-600">
            Quizly.io
          </span>
        </div>
      </header>

      <main className="flex-1">{renderCurrentView()}</main>

      {quizResult && (
        <QuizResultModal open={showResults} onOpenChange={setShowResults} result={quizResult} />
      )}
    </div>
  );
};

export default QuizInterface;