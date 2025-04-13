
import React, { useState } from "react";
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
import { Trophy, Medal, Star, User, Eye } from "lucide-react";
import QuizResultModal from "./QuizResultModal";

interface Participant {
  id: string;
  name: string;
  score: number;
  percentage: number;
  attemptedAt: string;
}

interface LeaderboardModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quizName: string;
  participants: Participant[];
}

const LeaderboardModal = ({ open, onOpenChange, quizName, participants }: LeaderboardModalProps) => {
  // Sort participants by score (highest first)
  const sortedParticipants = [...participants].sort((a, b) => b.score - a.score);
  const [selectedParticipant, setSelectedParticipant] = useState<Participant | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);

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

  const handleViewResult = (participant: Participant) => {
    setSelectedParticipant(participant);
    setShowResultModal(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Leaderboard: {quizName}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            {sortedParticipants.length > 0 ? (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[60px] text-center">Rank</TableHead>
                      <TableHead>Participant</TableHead>
                      <TableHead className="text-right">Score</TableHead>
                      <TableHead className="text-right hidden md:table-cell">Date</TableHead>
                      <TableHead className="text-center w-[100px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedParticipants.map((participant, index) => (
                      <TableRow key={participant.id} className={index < 3 ? "bg-brand-lightPurple/20" : ""}>
                        <TableCell className="text-center font-medium">
                          <div className="flex justify-center items-center">
                            {getRankIcon(index)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            {participant.name}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="font-medium">{participant.percentage}%</div>
                          <div className="text-xs text-muted-foreground">{participant.score} points</div>
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground text-sm hidden md:table-cell">
                          {formatDate(participant.attemptedAt)}
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleViewResult(participant)}
                            className="flex items-center gap-1 w-full justify-center"
                          >
                            <Eye className="h-4 w-4" />
                            <span className="hidden sm:inline">View Result</span>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
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
            totalQuestions: selectedParticipant.score / (selectedParticipant.percentage / 100),
            correctAnswers: selectedParticipant.score,
            incorrectAnswers: (selectedParticipant.score / (selectedParticipant.percentage / 100)) - selectedParticipant.score,
            timeTaken: "N/A", // We don't have time taken data from leaderboard participants
            attemptedAt: selectedParticipant.attemptedAt
          }}
        />
      )}
    </>
  );
};

export default LeaderboardModal;
