
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShareIcon, Clock, BookOpen, School, Award } from "lucide-react";
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
import WhatsAppIcon from "../../../public/whatsapp.png";

interface QuizCardProps {
  quiz: {
    id: string;
    name: string;
    topic: string;
    class: string;
    schoolBoard: string;
    numberOfQuestions: string;
    timeInMinutes: string;
    password: string;
    createdAt: string;
    shareLink: string;
  };
}

const QuizCard = ({ quiz }: QuizCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);

  // This would normally come from an API, this is sample data
  const sampleResult = {
    quizName: quiz.name,
    totalQuestions: parseInt(quiz.numberOfQuestions),
    correctAnswers: Math.floor(parseInt(quiz.numberOfQuestions) * 0.7), // 70% correct for demo
    incorrectAnswers: Math.ceil(parseInt(quiz.numberOfQuestions) * 0.3),
    timeTaken: "8m 45s",
    attemptedAt: new Date().toISOString()
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${quiz.shareLink}?pwd=${encodeURIComponent(quiz.password)}`);
    setIsCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => {
      setIsCopied(false);
    }, 2000);
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
            <span>Grade {quiz.class}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{quiz.timeInMinutes} mins</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Award className="h-4 w-4" />
            <span>{quiz.numberOfQuestions} questions</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <span>Created: {formatDate(quiz.createdAt)}</span>
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
                    value={`${quiz.shareLink}?pwd=${encodeURIComponent(quiz.password)}`}
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
                  <a href={`https://api.whatsapp.com/send?text=${quiz.shareLink}?pwd=${encodeURIComponent(quiz.password)}`} data-action="share/whatsapp/share" target="_blank"  // This will open the link in a new tab
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

        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowResultModal(true)}
        >
          View Results
        </Button>
      </CardFooter>

      {/* Quiz Result Modal */}
      <QuizResultModal
        open={showResultModal}
        onOpenChange={setShowResultModal}
        result={sampleResult}
      />
    </Card>
  );
};

export default QuizCard;
