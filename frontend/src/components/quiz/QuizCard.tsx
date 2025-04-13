
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareIcon, Clock, BookOpen, School, Award, Trophy, Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/utils/toast";
import QuizResultModal from "./QuizResultModal";
import LeaderboardModal from "./LeaderboardModal";
import QuizEditModal from "./QuizEditModal";
import WhatsAppIcon from "/public/whatsapp.png";

interface QuizCardProps {
  quiz: {
    id: string;
    name: string;
    topic: string;
    difficulty_level: string;
    schoolBoard: string;
    num_questions: string;
    timeInMinutes: string;
    password: string;
    created_at: string;
    trigger_link: string;
  };
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showLeaderboardModal, setShowLeaderboardModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // This would normally come from an API, this is sample data
  const sampleResult = {
    quizName: quiz.name,
    totalQuestions: parseInt(quiz.num_questions),
    correctAnswers: Math.floor(parseInt(quiz.num_questions) * 0.7), // 70% correct for demo
    incorrectAnswers: Math.ceil(parseInt(quiz.num_questions) * 0.3),
    timeTaken: "8m 45s",
    attemptedAt: new Date().toISOString()
  };

  // Sample leaderboard data - this would come from an API in a real app
  const sampleParticipants = [
    {
      id: "p1",
      name: "John Smith",
      score: 85,
      percentage: 85,
      attemptedAt: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    },
    {
      id: "p2",
      name: "Emma Johnson",
      score: 95,
      percentage: 95,
      attemptedAt: new Date(Date.now() - 7200000).toISOString() // 2 hours ago
    },
    {
      id: "p3",
      name: "Michael Brown",
      score: 75,
      percentage: 75,
      attemptedAt: new Date(Date.now() - 10800000).toISOString() // 3 hours ago
    },
    {
      id: "p4",
      name: "Lisa Davis",
      score: 90,
      percentage: 90,
      attemptedAt: new Date(Date.now() - 14400000).toISOString() // 4 hours ago
    },
    {
      id: "p5",
      name: "David Wilson",
      score: 80,
      percentage: 80,
      attemptedAt: new Date(Date.now() - 18000000).toISOString() // 5 hours ago
    }
  ];

  // Sample questions - this would come from an API in a real app
  const sampleQuestions = [
    {
      id: "q1",
      text: "What is the capital of France?",
      options: [
        { id: "o1", text: "London" },
        { id: "o2", text: "Paris" },
        { id: "o3", text: "Berlin" },
        { id: "o4", text: "Madrid" }
      ],
      correctOptionId: "o2"
    },
    {
      id: "q2",
      text: "What is 2 + 2?",
      options: [
        { id: "o1", text: "3" },
        { id: "o2", text: "4" },
        { id: "o3", text: "5" },
        { id: "o4", text: "6" }
      ],
      correctOptionId: "o2"
    },
    {
      id: "q3",
      text: "Which planet is known as the Red Planet?",
      options: [
        { id: "o1", text: "Earth" },
        { id: "o2", text: "Mars" },
        { id: "o3", text: "Venus" },
        { id: "o4", text: "Jupiter" }
      ],
      correctOptionId: "o2"
    }
  ];

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${quiz.trigger_link}}`);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
  };

  const handleSaveQuestions = (updatedQuestions: any[]) => {
    // This would normally make an API call to save the updated questions
    console.log("Updated questions:", updatedQuestions);
    // For now we just show a success toast
    toast.success("Quiz questions updated successfully!");
  };

  return (
    <Card className="w-full overflow-hidden transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{quiz.name}</CardTitle>
            <CardDescription className="flex items-center mt-1">
              <BookOpen className="h-4 w-4 mr-1" /> {quiz.topic}
            </CardDescription>
          </div>
          <div className="bg-brand-lightPurple text-brand-purple font-medium text-xs py-1 px-3 rounded-full">
            {quiz.schoolBoard}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="grid grid-cols-2 gap-2 text-sm mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <School className="h-4 w-4" />
            <span>Grade {quiz.difficulty_level}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{quiz.timeInMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{quiz.num_questions            } questions</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Created: {formatDate(quiz.created_at)}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between pt-3 border-t">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-1">
              <ShareIcon className="h-4 w-4" />
              Share
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Share Quiz</DialogTitle>
              <DialogDescription>
                Share this link with your child. They will need the password to access the quiz.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="link">Quiz Link</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="link"
                    value={`${quiz.trigger_link}?pwd=${encodeURIComponent(quiz.password)}`}
                    readOnly
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleCopyLink}
                    className={isCopied ? "bg-green-100 text-green-800" : ""}
                  >
                    {isCopied ? "Copied!" : "Copy"}
                  </Button>
                  <a href={`https://api.whatsapp.com/send?text=${quiz.trigger_link}?pwd=${encodeURIComponent(quiz.password)}`} data-action="share/whatsapp/share" target="_blank"  // This will open the link in a new tab
                    rel="noopener noreferrer">
                    <img src={WhatsAppIcon} alt="Share on WhatsApp" className="h-10 w-10 object-contain" />

                  </a>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="password"
                    value={quiz.password}
                    type="text"
                    readOnly
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Remember to share this password separately for better security.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowLeaderboardModal(true)}
            className="flex items-center gap-1"
          >
            <Trophy className="h-4 w-4" />
            Leaderboard
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-1"
          >
            <Pencil className="h-4 w-4" />
            View/Edit
          </Button>
        </div>
      </CardFooter>

      {/* Quiz Result Modal */}
      <QuizResultModal
        open={showResultModal}
        onOpenChange={setShowResultModal}
        result={sampleResult}
      />

      {/* Leaderboard Modal */}
      <LeaderboardModal
        open={showLeaderboardModal}
        onOpenChange={setShowLeaderboardModal}
        quizName={quiz.name}
        participants={sampleParticipants}
      />
      
      {/* Quiz Edit Modal */}
      <QuizEditModal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        quizName={quiz.name}
        questions={sampleQuestions}
        onSave={handleSaveQuestions}
      />
    </Card>
  );
};

export default QuizCard;
