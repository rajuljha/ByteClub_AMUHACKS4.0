import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Award,
  BarChart,
  Youtube,
  BookOpen,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { api } from "@/api";

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

interface ContentItem {
  title: string;
  url: string;
  thumbnail_url?: string;
}

const QuizResultModal = ({ open, onOpenChange, result }: QuizResultModalProps) => {
  const [youtubeContent, setYoutubeContent] = useState<ContentItem[]>([]);
  const [articleContent, setArticleContent] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (open && result) {
      fetchContent();
    }
  }, [open, result]);

  const fetchContent = async () => {
    setIsLoading(true);
    try {
      const youtubeResponse = await api.post("/content/youtube", {
        topics: [result?.quizName],
        num_results: 5,
      });
      setYoutubeContent(youtubeResponse.data[result?.quizName] || []);

      const articlesResponse = await api.post("/content/articles", {
        topics: [result?.quizName],
        num_results: 5,
      });
      setArticleContent(articlesResponse.data[result?.quizName] || []);
    } catch (error) {
      console.error("Error fetching content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!result) return null;

  const percentageScore = Math.round(
    (result.correctAnswers / result.totalQuestions) * 100
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Quiz Results: {result.quizName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Score</h3>
              <span className="text-lg font-bold">{percentageScore}%</span>
            </div>
            <Progress value={percentageScore} className="h-2" />
          </div>

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

          <div className="text-sm text-gray-500 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Attempted on {formatDate(result.attemptedAt)}</span>
          </div>

          <Tabs defaultValue="youtube" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Articles
              </TabsTrigger>
            </TabsList>

            {/* YouTube Tab */}
            <TabsContent value="youtube" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading videos...</p>
                </div>
              ) : youtubeContent.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {youtubeContent.map((video, index) => (
                      <CarouselItem key={index} className="max-w-xs">
                        <div className="p-1">
                          <div className="border rounded-lg overflow-hidden">
                            <img
                              src={video.thumbnail_url}
                              alt={video.title}
                              className="w-full h-40 object-cover"
                            />
                            <div className="p-4">
                              <h3 className="font-medium text-sm mb-2 line-clamp-2">
                                {video.title}
                              </h3>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 hover:underline text-sm"
                              >
                                Watch Video
                              </a>
                            </div>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p>No videos found</p>
                </div>
              )}
            </TabsContent>

            {/* Articles Tab */}
            <TabsContent value="articles" className="mt-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <p>Loading articles...</p>
                </div>
              ) : articleContent.length > 0 ? (
                <Carousel className="w-full">
                  <CarouselContent>
                    {articleContent.map((article, index) => (
                      <CarouselItem key={index} className="max-w-xs">
                        <div className="p-1">
                          <div className="border rounded-lg p-4 h-40 overflow-hidden">
                            <h3 className="font-medium text-sm mb-2 line-clamp-3">
                              {article.title}
                            </h3>
                            <a
                              href={article.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:underline text-sm"
                            >
                              Read Article
                            </a>
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              ) : (
                <div className="flex justify-center items-center h-40">
                  <p>No articles found</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResultModal;
