"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Award,
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckSquare,
  BarChart3,
  Target,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface QuizData {
  _id: string;
  title: string;
  description: string;
  questions: {
    _id: string;
    question: string;
    options: Record<string, string>;
  }[];
  totalQuestions: number;
}

export default function DailyQuizPage() {
  const { getToken } = useAuth();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    totalQuestions: number;
    percentage: number;
  } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      setIsLoading(true);
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/daily-quiz/today`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          if (data.alreadyAttempted) {
            toast.info("📝 You have already submitted today's quiz.");
            setResult({
              score: 0,
              totalQuestions: data.quiz.questions.length,
              percentage: 0,
            }); // Optional: force show result component or handle differently
          } else {
            setQuiz(data.quiz);
          }
        } else {
          toast.error("❌ No daily quiz found for today");
        }
      } catch (error) {
        toast.error("❌ Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuiz();
  }, [getToken]);

  const handleAnswer = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(selectedAnswers).length !== quiz?.questions.length) {
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
        `${API_BASE_URL}/api/daily-quiz/${quiz?._id}/submit`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ answers }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setResult(data.result);
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
    if (currentQuestion < (quiz?.questions.length || 0) - 1) {
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
    if (!quiz) return 0;
    return (Object.keys(selectedAnswers).length / quiz.questions.length) * 100;
  };

  const isQuestionAnswered = (questionId: string) => {
    return selectedAnswers[questionId] !== undefined;
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
          <p className="text-cyan-200 text-lg">Loading today's quiz...</p>
        </motion.div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <motion.div
          className="text-center bg-red-900/20 border border-red-600/50 rounded-2xl p-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-300 mb-2">
            No Quiz Available
          </h2>
          <p className="text-red-200/80">
            Please check back later for today's quiz.
          </p>
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
        {result ? (
          <motion.div
            className="bg-gradient-to-r from-green-900/40 to-cyan-900/40 border border-green-500/30 rounded-3xl p-8 text-center shadow-2xl backdrop-blur-sm"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Award className="w-20 h-20 text-green-400 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-green-300 mb-4">
              Quiz Completed!
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-800/20 rounded-2xl p-6">
                <Target className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-green-200 text-sm mb-1">Score</p>
                <p className="text-3xl font-bold text-green-300">
                  {result.score}/{result.totalQuestions}
                </p>
              </div>
              <div className="bg-cyan-800/20 rounded-2xl p-6">
                <BarChart3 className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-cyan-200 text-sm mb-1">Percentage</p>
                <p className="text-3xl font-bold text-cyan-300">
                  {result.percentage}%
                </p>
              </div>
              <div className="bg-blue-800/20 rounded-2xl p-6">
                <BookOpen className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-200 text-sm mb-1">Questions</p>
                <p className="text-3xl font-bold text-blue-300">
                  {result.totalQuestions}
                </p>
              </div>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div
                className="bg-gradient-to-r from-green-400 to-cyan-400 h-3 rounded-full transition-all duration-1000"
                style={{ width: `${result.percentage}%` }}
              ></div>
            </div>
            <p className="text-gray-300">
              {result.percentage >= 80
                ? "Excellent work! 🎉"
                : result.percentage >= 60
                ? "Good job! Keep practicing 👍"
                : "Keep studying and try again tomorrow! 📚"}
            </p>
          </motion.div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent mb-4">
                  {quiz.title}
                </h1>
                <p className="text-cyan-200/80 text-lg md:text-xl max-w-2xl mx-auto">
                  {quiz.description}
                </p>
              </motion.div>
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
                  {Object.keys(selectedAnswers).length}/{quiz.questions.length}{" "}
                  answered
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
              {quiz.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToQuestion(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentQuestion
                      ? "bg-cyan-400 scale-125"
                      : isQuestionAnswered(quiz.questions[index]._id)
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
                    <span className="text-cyan-200 text-sm">
                      Question {currentQuestion + 1} of {quiz.questions.length}
                    </span>
                  </div>
                  {isQuestionAnswered(quiz.questions[currentQuestion]._id) && (
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  )}
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-white mb-8 leading-relaxed">
                  {quiz.questions[currentQuestion].question}
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(quiz.questions[currentQuestion].options).map(
                    ([key, val]) => (
                      <motion.button
                        key={key}
                        onClick={() =>
                          handleAnswer(quiz.questions[currentQuestion]._id, key)
                        }
                        className={`group relative w-full text-left bg-gradient-to-r ${
                          selectedAnswers[
                            quiz.questions[currentQuestion]._id
                          ] === key
                            ? "from-green-600/40 to-green-500/40 border-green-400 shadow-lg shadow-green-500/20"
                            : "from-cyan-900/40 to-blue-900/40 border-cyan-500/30 hover:border-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
                        } border-2 rounded-2xl px-6 py-4 transition-all duration-300 transform hover:scale-[1.02]`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
                              selectedAnswers[
                                quiz.questions[currentQuestion]._id
                              ] === key
                                ? "border-green-400 bg-green-400"
                                : "border-cyan-400 group-hover:border-cyan-300"
                            }`}
                          >
                            {selectedAnswers[
                              quiz.questions[currentQuestion]._id
                            ] === key ? (
                              <CheckSquare className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-cyan-300 font-bold text-sm">
                                {key}
                              </span>
                            )}
                          </div>
                          <span className="text-white text-lg leading-relaxed">
                            {val}
                          </span>
                        </div>
                      </motion.button>
                    )
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                  currentQuestion === 0
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105"
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                Previous
              </button>

              <div className="flex items-center gap-4">
                <span className="text-cyan-200 text-sm">
                  {currentQuestion + 1} / {quiz.questions.length}
                </span>
              </div>

              <button
                onClick={nextQuestion}
                disabled={currentQuestion === quiz.questions.length - 1}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all ${
                  currentQuestion === quiz.questions.length - 1
                    ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white shadow-lg transform hover:scale-105"
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <motion.button
                onClick={handleSubmit}
                disabled={
                  isSubmitting ||
                  Object.keys(selectedAnswers).length !== quiz.questions.length
                }
                className={`px-12 py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                  Object.keys(selectedAnswers).length === quiz.questions.length
                    ? "bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 text-white shadow-2xl transform hover:scale-105 hover:shadow-green-500/20"
                    : "bg-gray-600 text-gray-400 cursor-not-allowed"
                } ${isSubmitting ? "opacity-50" : ""}`}
                whileHover={
                  Object.keys(selectedAnswers).length === quiz.questions.length
                    ? { scale: 1.05 }
                    : {}
                }
                whileTap={
                  Object.keys(selectedAnswers).length === quiz.questions.length
                    ? { scale: 0.95 }
                    : {}
                }
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </div>
                ) : (
                  `Submit Quiz (${Object.keys(selectedAnswers).length}/${
                    quiz.questions.length
                  })`
                )}
              </motion.button>

              {Object.keys(selectedAnswers).length !==
                quiz.questions.length && (
                <p className="text-yellow-400 text-sm mt-2">
                  Please answer all questions to submit the quiz
                </p>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
