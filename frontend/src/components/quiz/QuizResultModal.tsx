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
  TrendingUp,
  Target,
  AlertTriangle,
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
import { motion, AnimatePresence } from "framer-motion";

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

interface PerformanceMetric {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
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

  const performanceMetrics: PerformanceMetric[] = [
    {
      label: "Accuracy",
      value: percentageScore,
      icon: <Target className="h-5 w-5" />,
      color: "text-green-500",
    },
    {
      label: "Time per Question",
      value: Math.round(parseInt(result.timeTaken.replace(/[^0-9]/g, "")) / result.totalQuestions),
      icon: <Clock className="h-5 w-5" />,
      color: "text-blue-500",
    },
    {
      label: "Improvement Needed",
      value: Math.round((result.incorrectAnswers / result.totalQuestions) * 100),
      icon: <AlertTriangle className="h-5 w-5" />,
      color: "text-amber-500",
    },
  ];

  // Calculate time in seconds from the timeTaken string (e.g., "8m 45s")
  const parseTimeToSeconds = (timeStr: string) => {
    const minutes = parseInt(timeStr.match(/(\d+)m/)?.[1] || "0");
    const seconds = parseInt(timeStr.match(/(\d+)s/)?.[1] || "0");
    return minutes * 60 + seconds;
  };

  // Calculate time per question in seconds
  const timePerQuestion = parseTimeToSeconds(result.timeTaken) / result.totalQuestions;

  // Determine if time management needs improvement
  const timeManagementStatus = timePerQuestion > 60 ? "Needs Improvement" : "Good";

  // Calculate accuracy by question type (assuming equal distribution for demo)
  const accuracyByType = {
    "Multiple Choice": Math.round((result.correctAnswers / result.totalQuestions) * 100),
    "True/False": Math.round((result.correctAnswers / result.totalQuestions) * 100),
    "Short Answer": Math.round((result.correctAnswers / result.totalQuestions) * 100),
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  const progressBarVariants = {
    hidden: { width: 0 },
    visible: (value: number) => ({
      width: `${value}%`,
      transition: {
        duration: 1,
        ease: "easeOut"
      }
    })
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl lg:max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Quiz Results: {result.quizName}</DialogTitle>
        </DialogHeader>

        <motion.div 
          className="space-y-6 py-4"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Score Percentage */}
          <motion.div className="space-y-2" variants={itemVariants}>
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Score</h3>
              <motion.span 
                className="text-lg font-bold"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
              >
                {percentageScore}%
              </motion.span>
            </div>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1, delay: 0.2 }}
            >
              <Progress value={percentageScore} className="h-2" />
            </motion.div>
          </motion.div>

          {/* Performance Metrics */}
          <motion.div 
            className="grid grid-cols-3 gap-4"
            variants={containerVariants}
          >
            {performanceMetrics.map((metric, index) => (
              <motion.div
                key={index}
                className="flex flex-col items-center p-4 bg-gray-50 rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.div 
                  className={`${metric.color} mb-2`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {metric.icon}
                </motion.div>
                <div className="text-center">
                  <p className="text-sm text-gray-500">{metric.label}</p>
                  <motion.p 
                    className="font-medium"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 + 0.3, type: "spring", stiffness: 200 }}
                  >
                    {metric.value}%
                  </motion.p>
                </div>
              </motion.div>
            ))}
          </motion.div>

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

          <div className="text-sm text-gray-500 flex items-center gap-1">
            <BarChart className="h-4 w-4" />
            <span>Attempted on {formatDate(result.attemptedAt)}</span>
          </div>

          <Tabs defaultValue="analytics" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analytics" className="flex items-center gap-2">
                <BarChart className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="youtube" className="flex items-center gap-2">
                <Youtube className="h-4 w-4" />
                Videos
              </TabsTrigger>
              <TabsTrigger value="articles" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Articles
              </TabsTrigger>
            </TabsList>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="mt-4">
              <motion.div 
                className="space-y-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Question Analysis */}
                <motion.div 
                  className="bg-white p-4 rounded-lg border"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium mb-4">Question Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Correct Answers</span>
                        <motion.span
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                        >
                          {result.correctAnswers}/{result.totalQuestions}
                        </motion.span>
                      </div>
                      <motion.div
                        className="h-2 bg-green-100 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.2 }}
                      >
                        <motion.div
                          className="h-full bg-green-500"
                          custom={(result.correctAnswers / result.totalQuestions) * 100}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </motion.div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Incorrect Answers</span>
                        <motion.span
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.5 }}
                        >
                          {result.incorrectAnswers}/{result.totalQuestions}
                        </motion.span>
                      </div>
                      <motion.div
                        className="h-2 bg-red-100 rounded-full overflow-hidden"
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1, delay: 0.4 }}
                      >
                        <motion.div
                          className="h-full bg-red-500"
                          custom={(result.incorrectAnswers / result.totalQuestions) * 100}
                          variants={progressBarVariants}
                          initial="hidden"
                          animate="visible"
                        />
                      </motion.div>
                    </div>
                  </div>
                </motion.div>

                {/* Time Management */}
                <motion.div 
                  className="bg-white p-4 rounded-lg border"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium mb-4">Time Management</h3>
                  <div className="space-y-3">
                    <motion.div 
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="text-sm">Average Time per Question</span>
                      </div>
                      <motion.span 
                        className="font-medium"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                      >
                        {Math.round(timePerQuestion)}s
                      </motion.span>
                    </motion.div>
                    <motion.div 
                      className="flex justify-between items-center"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <div className="flex items-center gap-2">
                        <AlertTriangle className={`h-4 w-4 ${timeManagementStatus === "Needs Improvement" ? "text-amber-500" : "text-green-500"}`} />
                        <span className="text-sm">Time Management</span>
                      </div>
                      <motion.span 
                        className={`font-medium ${timeManagementStatus === "Needs Improvement" ? "text-amber-500" : "text-green-500"}`}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                      >
                        {timeManagementStatus}
                      </motion.span>
                    </motion.div>
                  </div>
                </motion.div>

                {/* Improvement Suggestions */}
                <motion.div 
                  className="bg-white p-4 rounded-lg border"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <h3 className="font-medium mb-4">Areas for Improvement</h3>
                  <motion.ul className="space-y-2 text-sm">
                    {result.incorrectAnswers > 0 && (
                      <motion.li 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>
                          Focus on {result.incorrectAnswers} incorrect questions from {result.quizName}
                        </span>
                      </motion.li>
                    )}
                    {timeManagementStatus === "Needs Improvement" && (
                      <motion.li 
                        className="flex items-start gap-2"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                        <span>Practice time management - aim for under 60 seconds per question</span>
                      </motion.li>
                    )}
                    <motion.li 
                      className="flex items-start gap-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <AlertTriangle className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>
                        Review the {result.incorrectAnswers} incorrect answers to understand mistakes
                      </span>
                    </motion.li>
                  </motion.ul>
                </motion.div>
              </motion.div>
            </TabsContent>

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
        </motion.div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizResultModal;
