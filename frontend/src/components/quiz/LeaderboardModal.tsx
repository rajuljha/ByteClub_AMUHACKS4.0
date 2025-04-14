import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, User, Eye, Loader2, Clock } from "lucide-react";
import QuizResultModal from "./QuizResultModal";
import axios from "axios";
import { api } from "@/api";

interface Answer {
  question_index: number;
  answer: string;
  is_correct: boolean;
}

interface Participant {
  id: string;
  name: string;
  score: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
  timeTaken: string;
  attemptedAt: string;
  answers: Answer[];
}

interface LeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizName: string;
  quizId: string;
}

const LeaderboardModal = ({ open, onOpenChange, quizName, quizId }: LeaderboardModalProps) => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (!open) return;
      
      setIsLoading(true);
      setError(null);
      try {
        const userInfo = localStorage.getItem("user");
        const user = JSON.parse(userInfo || "{}");
        const token = user.access_token;

        const response = await api.get(
          `/quiz/quizzes/${quizId}/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setParticipants(response.data);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
        setError("Failed to load leaderboard data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, [open, quizId]);

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

  // Function to render rank icon based on position
  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 1:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-amber-700" />;
      default:
        return <Star className="h-5 w-5 text-brand-purple opacity-40" />;
    }
  };

  console.log("aarish")
  console.log(participants)

  const handleViewResult = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowResultModal(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Leaderboard: {quizName}
            </DialogTitle>
          </DialogHeader>

          <div className="py-6">
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-brand-purple" />
              </div>
            ) : error ? (
              <div className="text-center py-12 text-red-500 text-lg">
                {error}
              </div>
            ) : participants.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-brand-lightPurple/10">
                      <TableHead className="w-[60px] text-center text-base">Rank</TableHead>
                      <TableHead className="text-base">Participant</TableHead>
                      <TableHead className="text-right text-base">Score</TableHead>
                      <TableHead className="text-right text-base">Correct/Total</TableHead>
                      <TableHead className="text-right hidden md:table-cell text-base">
                        <div className="flex items-center justify-end gap-1">
                          <Clock className="h-5 w-5" />
                          Time
                        </div>
                      </TableHead>
                      <TableHead className="text-right hidden md:table-cell text-base">Date</TableHead>
                      <TableHead className="text-center w-[120px] text-base">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {participants.map((participant, index) => (
                      <TableRow key={participant.id} className={index < 3 ? "bg-brand-lightPurple/20" : ""}>
                        <TableCell className="text-center font-medium py-4">
                          <div className="flex justify-center items-center">
                            {getRankIcon(index)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium py-4">
                          <div className="flex items-center gap-2">
                            <User className="h-5 w-5 text-muted-foreground" />
                            <span className="text-base">{participant.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="font-medium text-lg">{participant.percentage}%</div>
                          <div className="text-sm text-muted-foreground">{participant.score} points</div>
                        </TableCell>
                        <TableCell className="text-right py-4">
                          <div className="font-medium text-lg text-green-600">{participant.correctAnswers}</div>
                          <div className="text-sm text-muted-foreground">/ {participant.correctAnswers + participant.incorrectAnswers}</div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-base hidden md:table-cell py-4">
                          {participant.timeTaken}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-base hidden md:table-cell py-4">
                          {formatDate(participant.attemptedAt)}
                        </TableCell>
                        <TableCell className="py-4">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewResult(participant)}
                            className="flex items-center gap-1 w-full justify-center"
                          >
                            <Eye className="h-5 w-5" />
                            <span className="hidden sm:inline text-base">View Result</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground text-lg">
                No participants have attempted this quiz yet.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Individual Result Modal */}
      {selectedParticipant && (
        <QuizResultModal
          open={showResultModal}
          onOpenChange={setShowResultModal}
          result={{
            quizName: quizName,
            totalQuestions: selectedParticipant.correctAnswers + selectedParticipant.incorrectAnswers,
            correctAnswers: selectedParticipant.correctAnswers,
            incorrectAnswers: selectedParticipant.incorrectAnswers,
            timeTaken: selectedParticipant.timeTaken,
            attemptedAt: selectedParticipant.attemptedAt
          }}
        />
      )}
    </>
  );
};

export default LeaderboardModal;
