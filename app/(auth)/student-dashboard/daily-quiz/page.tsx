"use client";
import { useState, useEffect } from "react";
import {
  CheckCircle,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  User,
  Brain,
  TrendingUp,
  Shield,
  Zap,
  Flame,
  Star,
  Target,
  Send,
  Edit3,
  Database,
  MonitorCog,
  Wrench,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "@/lib/api";

interface Question {
  _id: string;
  question: string;
  questionType: "text" | "mcq";
  options?: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
}

interface QuizData {
  _id: string;
  title: string;
  description: string;
  questions: Question[];
  totalQuestions: number;
  alreadyAttempted: boolean;
}

interface DifficultyQuizzes {
  SQL: QuizData | null;
  Linux: QuizData | null;
  ITIL: QuizData | null;
  Tools: QuizData | null;
  easy: QuizData | null;
  medium: QuizData | null;
  hard: QuizData | null;
}

type Difficulty =
  | "SQL"
  | "Linux"
  | "ITIL"
  | "Tools"
  | "easy"
  | "medium"
  | "hard";

const difficultyConfig = {
  SQL: {
    icon: Database,
    color: "from-emerald-400 to-lime-500",
    bgColor: "from-emerald-900/40 to-lime-900/40",
    borderColor: "border-lime-400/30",
    textColor: "text-lime-300",
    title: "SQL",
    description: "Questions related to SQL",
  },
  Linux: {
    icon: MonitorCog,
    color: "from-indigo-400 to-blue-500",
    bgColor: "from-indigo-900/40 to-blue-900/40",
    borderColor: "border-blue-400/30",
    textColor: "text-blue-300",
    title: "Linux",
    description: "Questions related to Linux",
  },
  ITIL: {
    icon: TrendingUp,
    color: "from-cyan-400 to-sky-500",
    bgColor: "from-cyan-900/40 to-sky-900/40",
    borderColor: "border-cyan-400/30",
    textColor: "text-sky-300",
    title: "ITIL",
    description: "Questions related to ITIL",
  },
  Tools: {
    icon: Wrench,
    color: "from-purple-500 to-violet-500",
    bgColor: "from-purple-900/40 to-violet-900/40",
    borderColor: "border-purple-500/30",
    textColor: "text-violet-300",
    title: "Tools",
    description: "Questions related to Monitoring & Ticketing Tools",
  },
  easy: {
    icon: Shield,
    color: "from-green-500 to-emerald-500",
    bgColor: "from-green-900/40 to-emerald-900/40",
    borderColor: "border-green-500/30",
    textColor: "text-green-300",
    title: "Easy",
    description: "Perfect for beginners",
  },
  medium: {
    icon: Zap,
    color: "from-yellow-500 to-orange-500",
    bgColor: "from-yellow-900/40 to-orange-900/40",
    borderColor: "border-yellow-500/30",
    textColor: "text-yellow-300",
    title: "Medium",
    description: "Challenge yourself",
  },
  hard: {
    icon: Flame,
    color: "from-red-500 to-pink-500",
    bgColor: "from-red-900/40 to-pink-900/40",
    borderColor: "border-red-500/30",
    textColor: "text-red-300",
    title: "IJF-MAT : IT Jobs Factory Mastery & Aptitude Test",
    description: "The timing of this test is 2 hours",
  },
};

export default function DailyQuizPage() {
  const { getToken } = useAuth();
  const [quizzes, setQuizzes] = useState<DifficultyQuizzes>({
    SQL: null,
    Linux: null,
    ITIL: null,
    Tools: null,
    easy: null,
    medium: null,
    hard: null,
  });
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty | null>(null);
  const [currentQuiz, setCurrentQuiz] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showQuizSelection, setShowQuizSelection] = useState(true);
  const [showNameForm, setShowNameForm] = useState(false);
  const [studentName, setStudentName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  useEffect(() => {
    const disableCopyCutContext = (e: Event) => e.preventDefault();

    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      toast.warn("Please don't paste. You should answer it by yourself.");
    };

    document.addEventListener("contextmenu", disableCopyCutContext);
    document.addEventListener("copy", disableCopyCutContext);
    document.addEventListener("cut", disableCopyCutContext);
    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("contextmenu", disableCopyCutContext);
      document.removeEventListener("copy", disableCopyCutContext);
      document.removeEventListener("cut", disableCopyCutContext);
      document.removeEventListener("paste", handlePaste);
    };
  }, []);
  useEffect(() => {
    const fetchQuizzes = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/daily-quiz/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setQuizzes(data);
        } else {
          toast.error("❌ Failed to load today's quizzes");
        }
      } catch (error) {
        toast.error("❌ Failed to load quizzes");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuizzes();
  }, [getToken]);

  const selectDifficulty = (difficulty: Difficulty) => {
    const quiz = quizzes[difficulty];
    if (!quiz) {
      toast.error("❌ No quiz available for this difficulty");
      return;
    }

    if (quiz.alreadyAttempted) {
      toast.info("📝 You have already attempted this quiz today");
      return;
    }

    setSelectedDifficulty(difficulty);
    setCurrentQuiz(quiz);
    setShowQuizSelection(false);
    setShowNameForm(true);
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setIsSubmitted(false);
  };

  const goBackToSelection = () => {
    setShowQuizSelection(true);
    setShowNameForm(false);
    setSelectedDifficulty(null);
    setCurrentQuiz(null);
    setSelectedAnswers({});
    setCurrentQuestion(0);
    setStudentName("");
    setIsSubmitted(false);
  };

  const startQuiz = () => {
    if (!studentName.trim() || studentName.trim().length < 2) {
      toast.error("❌ Please enter your name (at least 2 characters)");
      return;
    }
    setShowNameForm(false);
  };

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    if (
      !currentQuiz ||
      Object.keys(selectedAnswers).length !== currentQuiz.questions.length
    ) {
      return toast.error("❌ Please answer all questions before submitting");
    }

    setIsSubmitting(true);

    const token = await getToken();
    const answers = Object.entries(selectedAnswers).map(
      ([questionId, selectedAnswer]) => ({
        questionId,
        selectedAnswer,
      })
    );

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/daily-quiz/${currentQuiz._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers, studentName: studentName.trim() }),
        }
      );

      if (res.ok) {
        setIsSubmitted(true);
        toast.success("✅ Quiz submitted successfully!");
      } else {
        const err = await res.json();
        toast.error(err.error || "❌ Failed to submit quiz");
      }
    } catch (err) {
      toast.error("❌ Server error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextQuestion = () => {
    if (currentQuiz && currentQuestion < currentQuiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const goToQuestion = (index: number) => {
    setCurrentQuestion(index);
  };

  const getProgressPercentage = () => {
    if (!currentQuiz) return 0;
    return (
      (Object.keys(selectedAnswers).length / currentQuiz.questions.length) * 100
    );
  };

  const isQuestionAnswered = (questionId: string) => {
    return (
      selectedAnswers[questionId] !== undefined &&
      selectedAnswers[questionId].trim() !== ""
    );
  };

  const getQuestionTypeCount = (type: "text" | "mcq") => {
    if (!currentQuiz) return 0;
    return currentQuiz.questions.filter((q) => q.questionType === type).length;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-cyan-200 text-lg">Loading today's quizzes...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4 sm:p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {isSubmitted ? (
          <motion.div
            className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-green-300 mb-4">
              Quiz Submitted Successfully!
            </h2>
            <div className="mb-4">
              <span
                className={`px-4 py-2 rounded-full text-sm font-semibold ${
                  selectedDifficulty === "easy"
                    ? "bg-green-500/20 text-green-300"
                    : selectedDifficulty === "medium"
                    ? "bg-yellow-500/20 text-yellow-300"
                    : "bg-red-500/20 text-red-300"
                }`}
              >
                {selectedDifficulty?.toUpperCase()} DIFFICULTY
              </span>
            </div>
            <div className="bg-cyan-800/20 rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <User className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
              <p className="text-cyan-200 text-sm mb-1">Submitted by</p>
              <p className="text-2xl font-bold text-cyan-300">{studentName}</p>
            </div>
            <p className="text-gray-300 mb-6 text-lg">
              Thank you for participating in today's quiz! Your answers have
              been recorded.
            </p>
            <button
              onClick={goBackToSelection}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105"
            >
              Try Another Difficulty
            </button>
          </motion.div>
        ) : showQuizSelection ? (
          <>
            {/* Header */}
            <div className="text-center mb-12">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex items-center justify-center gap-3 mb-4">
                  <Brain className="w-12 h-12 text-cyan-400" />
                  <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                    Daily Quiz Challenge
                  </h1>
                </div>
                <p className="text-cyan-200/80 text-lg md:text-xl max-w-2xl mx-auto">
                  Choose your difficulty level and test your knowledge with
                  mixed question types
                </p>
              </motion.div>
            </div>

            {/* Difficulty Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {(Object.keys(difficultyConfig) as Difficulty[]).map(
                (difficulty, index) => {
                  const config = difficultyConfig[difficulty];
                  const quiz = quizzes[difficulty];
                  const Icon = config.icon;
                  const isAvailable = quiz !== null;
                  const isCompleted = quiz?.alreadyAttempted || false;

                  return (
                    <motion.div
                      key={difficulty}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className={`relative group cursor-pointer ${
                        !isAvailable ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                      onClick={() =>
                        isAvailable &&
                        !isCompleted &&
                        selectDifficulty(difficulty)
                      }
                    >
                      <div
                        className={`bg-gradient-to-r ${config.bgColor} border ${
                          config.borderColor
                        } rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm transition-all duration-300 ${
                          isAvailable && !isCompleted
                            ? "hover:scale-105 hover:shadow-2xl"
                            : ""
                        } ${isCompleted ? "border-green-500/50" : ""}`}
                      >
                        {isCompleted && (
                          <div className="absolute top-4 right-4">
                            <CheckCircle className="w-8 h-8 text-green-400" />
                          </div>
                        )}

                        <div
                          className={`w-20 h-20 bg-gradient-to-r ${config.color} rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg`}
                        >
                          <Icon className="w-10 h-10 text-white" />
                        </div>

                        <h3
                          className={`text-2xl font-bold ${config.textColor} mb-2`}
                        >
                          {config.title}
                        </h3>

                        <p className="text-gray-300 mb-4">
                          {config.description}
                        </p>

                        {isAvailable && quiz ? (
                          <>
                            <div className="mb-4">
                              <p className="text-white font-semibold mb-1">
                                {quiz.title}
                              </p>
                              <p className="text-gray-400 text-sm">
                                {quiz.questions.length} Questions
                              </p>
                            </div>

                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                                isCompleted
                                  ? "bg-green-500/20 text-green-300"
                                  : `bg-gradient-to-r ${config.color} text-white`
                              }`}
                            >
                              {isCompleted ? (
                                <>
                                  <CheckCircle className="w-4 h-4" />
                                  Completed
                                </>
                              ) : (
                                <></>
                              )}
                            </div>
                          </>
                        ) : (
                          <div className="text-gray-500">
                            <p className="text-sm">No quiz available</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              )}
            </div>

            {/* Daily Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-gradient-to-r from-purple-900/40 to-blue-900/40 border border-purple-500/30 rounded-3xl p-6 backdrop-blur-sm"
            >
              <div className="flex items-center justify-center gap-3 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-400" />
                <h3 className="text-xl font-bold text-purple-300">
                  Today's Progress
                </h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {(Object.keys(difficultyConfig) as Difficulty[]).map(
                  (difficulty) => {
                    const config = difficultyConfig[difficulty];
                    const quiz = quizzes[difficulty];
                    const isCompleted = quiz?.alreadyAttempted || false;

                    return (
                      <div key={difficulty} className="text-center">
                        <div
                          className={`w-3 h-3 rounded-full mx-auto mb-2 ${
                            isCompleted
                              ? "bg-green-400"
                              : quiz
                              ? "bg-gray-400"
                              : "bg-gray-600"
                          }`}
                        ></div>
                        <p className={`text-sm ${config.textColor}`}>
                          {config.title}
                        </p>
                      </div>
                    );
                  }
                )}
              </div>
            </motion.div>
          </>
        ) : showNameForm ? (
          <motion.div
            className="max-w-md mx-auto bg-gradient-to-r from-cyan-900/40 to-blue-900/40 border border-cyan-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <User className="w-16 h-16 text-cyan-400 mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-cyan-300 mb-4">
              Enter Your Name
            </h2>
            <p className="text-gray-300 mb-6">
              Please enter your name to start the{" "}
              <span
                className={`font-semibold ${
                  selectedDifficulty === "easy"
                    ? "text-green-300"
                    : selectedDifficulty === "medium"
                    ? "text-yellow-300"
                    : "text-red-300"
                }`}
              >
                {selectedDifficulty?.toUpperCase()}
              </span>{" "}
              difficulty quiz
            </p>
            <div className="mb-6">
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300"
                maxLength={50}
              />
            </div>
            <div className="flex gap-4">
              <button
                onClick={goBackToSelection}
                className="flex-1 px-6 py-3 bg-gray-600 hover:bg-gray-500 rounded-2xl text-white font-semibold transition-all duration-300"
              >
                Back
              </button>
              <button
                onClick={startQuiz}
                disabled={!studentName.trim() || studentName.trim().length < 2}
                className={`flex-1 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                  studentName.trim() && studentName.trim().length >= 2
                    ? "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transform hover:scale-105"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                }`}
              >
                Start Quiz
              </button>
            </div>
          </motion.div>
        ) : (
          currentQuiz && (
            <>
              {/* Quiz Header */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={goBackToSelection}
                  className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-white transition-all duration-200"
                >
                  <ArrowLeft className="w-5 h-5" />
                  Back to Selection
                </button>

                <div className="text-center">
                  <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-2">
                    {currentQuiz.title}
                  </h1>
                  <span
                    className={`px-4 py-2 rounded-full text-sm font-semibold ${
                      selectedDifficulty === "easy"
                        ? "bg-green-500/20 text-green-300"
                        : selectedDifficulty === "medium"
                        ? "bg-yellow-500/20 text-yellow-300"
                        : "bg-red-500/20 text-red-300"
                    }`}
                  >
                    {selectedDifficulty?.toUpperCase()} DIFFICULTY
                  </span>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-2 text-cyan-200">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">{studentName}</span>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-cyan-200 text-sm">Progress</span>
                  <span className="text-cyan-200 text-sm">
                    {
                      Object.keys(selectedAnswers).filter(
                        (key) => selectedAnswers[key].trim() !== ""
                      ).length
                    }
                    /{currentQuiz.questions.length} answered
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getProgressPercentage()}%` }}
                  ></div>
                </div>
              </motion.div>

              {/* Question Navigation Dots */}
              <div className="flex justify-center mb-8 gap-2 flex-wrap">
                {currentQuiz.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToQuestion(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentQuestion
                        ? "bg-cyan-400 scale-125"
                        : isQuestionAnswered(currentQuiz.questions[index]._id)
                        ? "bg-green-400"
                        : "bg-gray-600 hover:bg-gray-500"
                    }`}
                    aria-label={`Go to question ${index + 1}`}
                  />
                ))}
              </div>

              {/* Current Question */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuestion}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border border-cyan-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm shadow-2xl mb-8"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">
                          {currentQuestion + 1}
                        </span>
                      </div>
                      <div>
                        <span className="text-cyan-200 text-sm">
                          Question {currentQuestion + 1} of{" "}
                          {currentQuiz.questions.length}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                          <span
                            className={`text-xs px-2 py-1 rounded-full ${
                              currentQuiz.questions[currentQuestion]
                                .questionType === "mcq"
                                ? "bg-blue-500/20 text-blue-300"
                                : "bg-purple-500/20 text-purple-300"
                            }`}
                          >
                            {currentQuiz.questions[currentQuestion]
                              .questionType === "mcq"
                              ? "Multiple Choice"
                              : "Text Answer"}
                          </span>
                        </div>
                      </div>
                    </div>
                    {isQuestionAnswered(
                      currentQuiz.questions[currentQuestion]._id
                    ) && <CheckCircle className="w-6 h-6 text-green-400" />}
                  </div>

                  <h3 className="text-2xl no-copy md:text-3xl font-semibold text-white mb-8 leading-relaxed">
                    {currentQuiz.questions[currentQuestion].question}
                  </h3>

                  <div className="mb-6">
                    {currentQuiz.questions[currentQuestion].questionType ===
                    "text" ? (
                      // Text Question Input
                      <>
                        <textarea
                          value={
                            selectedAnswers[
                              currentQuiz.questions[currentQuestion]._id
                            ] || ""
                          }
                          onChange={(e) =>
                            handleAnswer(
                              currentQuiz.questions[currentQuestion]._id,
                              e.target.value
                            )
                          }
                          placeholder="Type your answer here..."
                          className="w-full h-32 px-4 py-3 bg-gray-800/50 border border-cyan-500/30 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-all duration-300 resize-none"
                          maxLength={500}
                        />
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-gray-400 text-sm flex items-center gap-1">
                            <Edit3 className="w-4 h-4" />
                            Write your detailed answer
                          </span>
                          <span className="text-gray-400 text-sm">
                            {selectedAnswers[
                              currentQuiz.questions[currentQuestion]._id
                            ]?.length || 0}
                            /500
                          </span>
                        </div>
                      </>
                    ) : (
                      // MCQ Question Options
                      currentQuiz.questions[currentQuestion].options && (
                        <div className="space-y-4">
                          {Object.entries(
                            currentQuiz.questions[currentQuestion].options!
                          ).map(([key, value]) => (
                            <label
                              key={key}
                              className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${
                                selectedAnswers[
                                  currentQuiz.questions[currentQuestion]._id
                                ] === key
                                  ? "border-cyan-400 bg-cyan-500/20"
                                  : "border-gray-600 bg-gray-800/30 hover:border-gray-500 hover:bg-gray-700/30"
                              }`}
                            >
                              <input
                                type="radio"
                                name={`question-${currentQuiz.questions[currentQuestion]._id}`}
                                value={key}
                                checked={
                                  selectedAnswers[
                                    currentQuiz.questions[currentQuestion]._id
                                  ] === key
                                }
                                onChange={(e) =>
                                  handleAnswer(
                                    currentQuiz.questions[currentQuestion]._id,
                                    e.target.value
                                  )
                                }
                                className="sr-only"
                              />
                              <div
                                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mr-4 ${
                                  selectedAnswers[
                                    currentQuiz.questions[currentQuestion]._id
                                  ] === key
                                    ? "border-cyan-400 bg-cyan-400"
                                    : "border-gray-400"
                                }`}
                              >
                                {selectedAnswers[
                                  currentQuiz.questions[currentQuestion]._id
                                ] === key && (
                                  <div className="w-2 h-2 bg-white rounded-full"></div>
                                )}
                              </div>
                              <div className="flex-1">
                                <span className="text-white font-medium mr-3">
                                  {key}.
                                </span>
                                <span className="text-gray-200">{value}</span>
                              </div>
                            </label>
                          ))}
                        </div>
                      )
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Quiz Statistics */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-gradient-to-r from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-4 text-center">
                  <BookOpen className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-300 text-sm">Total Questions</p>
                  <p className="text-white font-bold text-lg">
                    {currentQuiz.questions.length}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-500/30 rounded-2xl p-4 text-center">
                  <Target className="w-6 h-6 text-purple-400 mx-auto mb-2" />
                  <p className="text-purple-300 text-sm">MCQ Questions</p>
                  <p className="text-white font-bold text-lg">
                    {getQuestionTypeCount("mcq")}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-pink-900/40 to-red-900/40 border border-pink-500/30 rounded-2xl p-4 text-center">
                  <Edit3 className="w-6 h-6 text-pink-400 mx-auto mb-2" />
                  <p className="text-pink-300 text-sm">Text Questions</p>
                  <p className="text-white font-bold text-lg">
                    {getQuestionTypeCount("text")}
                  </p>
                </div>
                <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 border border-green-500/30 rounded-2xl p-4 text-center">
                  <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-2" />
                  <p className="text-green-300 text-sm">Answered</p>
                  <p className="text-white font-bold text-lg">
                    {
                      Object.keys(selectedAnswers).filter(
                        (key) => selectedAnswers[key].trim() !== ""
                      ).length
                    }
                  </p>
                </div>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center mb-8">
                <button
                  onClick={prevQuestion}
                  disabled={currentQuestion === 0}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentQuestion === 0
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-500 hover:to-gray-600 text-white transform hover:scale-105"
                  }`}
                >
                  <ArrowLeft className="w-5 h-5" />
                  Previous
                </button>

                <div className="text-center">
                  <p className="text-cyan-200 text-sm mb-1">
                    Question Progress
                  </p>
                  <p className="text-white font-bold">
                    {currentQuestion + 1} of {currentQuiz.questions.length}
                  </p>
                </div>

                <button
                  onClick={nextQuestion}
                  disabled={
                    currentQuestion === currentQuiz.questions.length - 1
                  }
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-300 ${
                    currentQuestion === currentQuiz.questions.length - 1
                      ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white transform hover:scale-105"
                  }`}
                >
                  Next
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Submit Button */}
              <motion.div
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button
                  onClick={handleSubmit}
                  disabled={
                    Object.keys(selectedAnswers).length !==
                      currentQuiz.questions.length ||
                    isSubmitting ||
                    Object.values(selectedAnswers).some(
                      (answer) => answer.trim() === ""
                    )
                  }
                  className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                    Object.keys(selectedAnswers).length ===
                      currentQuiz.questions.length &&
                    Object.values(selectedAnswers).every(
                      (answer) => answer.trim() !== ""
                    ) &&
                    !isSubmitting
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white transform hover:scale-105 shadow-lg"
                      : "bg-gray-600 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Submit Quiz
                    </>
                  )}
                </button>

                {Object.keys(selectedAnswers).length !==
                  currentQuiz.questions.length && (
                  <p className="text-red-400 text-sm mt-2">
                    Please answer all questions before submitting
                  </p>
                )}

                {Object.keys(selectedAnswers).length ===
                  currentQuiz.questions.length &&
                  Object.values(selectedAnswers).some(
                    (answer) => answer.trim() === ""
                  ) && (
                    <p className="text-red-400 text-sm mt-2">
                      Please provide answers to all questions (empty answers not
                      allowed)
                    </p>
                  )}
              </motion.div>
            </>
          )
        )}
      </motion.div>
    </div>
  );
}
