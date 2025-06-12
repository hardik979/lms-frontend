// app/test/[courseId]/[chapterIndex]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  RotateCcw,
  Home,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingPage from "@/components/Loader";

interface Question {
  _id: string;
  question: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  order: number;
}

interface AnswerFeedback {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
  selectedAnswer: string;
}

interface TestData {
  test: {
    _id: string;
    title: string;
    description: string;
  };
  questions: Question[];
  totalQuestions: number;
}

export default function TestPage() {
  const params = useParams();
  const router = useRouter();
  const { getToken } = useAuth();

  const courseId = params.courseId as string;
  const chapterIndex = params.chapterIndex as string;

  const [loading, setLoading] = useState(true);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>("");
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<number>>(
    new Set()
  );
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<AnswerFeedback | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [finalResult, setFinalResult] = useState<any>(null);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    fetchTest();
    setStartTime(new Date());

    // Timer
    const timer = setInterval(() => {
      setCurrentTime((Date.now() - startTime.getTime()) / 1000);
    }, 1000);

    return () => clearInterval(timer);
  }, [courseId, chapterIndex]);

  const fetchTest = async () => {
    try {
      const token = await getToken();
      if (!token) return;

      const response = await fetch(
        `http://localhost:5000/api/tests/course/${courseId}/chapter/${chapterIndex}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        if (response.status === 404) {
          toast.error("No test available for this chapter");
          return;
        }
        throw new Error("Failed to fetch test");
      }

      const data = await response.json();

      // Start the test
      const startResponse = await fetch(
        `http://localhost:5000/api/tests/${data.test._id}/start`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!startResponse.ok) {
        const errorData = await startResponse.json();
        toast.error(errorData.error || "Failed to start test");
        return;
      }

      const startData = await startResponse.json();
      setTestData(startData);
    } catch (error) {
      console.error("Error fetching test:", error);
      toast.error("Failed to load test");
    } finally {
      setLoading(false);
    }
  };

  const submitAnswer = async () => {
    if (!selectedAnswer || !testData) return;

    try {
      const token = await getToken();
      if (!token) return;

      const currentQuestion = testData.questions[currentQuestionIndex];

      const response = await fetch(
        `http://localhost:5000/api/tests/${testData.test._id}/submit-answer`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            questionId: currentQuestion._id,
            selectedAnswer,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit answer");
      }

      const feedbackData = await response.json();
      setFeedback(feedbackData);
      setShowFeedback(true);

      // Update local state
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion._id]: selectedAnswer,
      }));

      setAnsweredQuestions((prev) => new Set([...prev, currentQuestionIndex]));

      if (feedbackData.isCorrect) {
        setCorrectAnswers((prev) => prev + 1);
        toast.success("Correct! Well done! 🎉");
      } else {
        toast.error("Incorrect. Check the explanation below.");
      }
    } catch (error) {
      console.error("Error submitting answer:", error);
      toast.error("Failed to submit answer");
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < testData!.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      setFeedback(null);
    } else {
      completeTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setSelectedAnswer("");
      setShowFeedback(false);
      setFeedback(null);
    }
  };

  const completeTest = async () => {
    if (!testData) return;

    try {
      const token = await getToken();
      if (!token) return;

      const endTime = new Date();
      const timeSpent = Math.round(
        (endTime.getTime() - startTime.getTime()) / 1000
      ); // in seconds

      const answers = Object.entries(userAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const response = await fetch(
        `http://localhost:5000/api/tests/${testData.test._id}/complete`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            answers,
            timeSpent,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          toast.info("Test already completed");
          return;
        }
        throw new Error(errorData.error || "Failed to complete test");
      }

      const result = await response.json();
      setFinalResult(result.result);
      setTestCompleted(true);

      toast.success("Test completed successfully!");
    } catch (error) {
      console.error("Error completing test:", error);
      toast.error("Failed to complete test");
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const retakeTest = () => {
    // Reset all state
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnsweredQuestions(new Set());
    setUserAnswers({});
    setFeedback(null);
    setShowFeedback(false);
    setTestCompleted(false);
    setFinalResult(null);
    setStartTime(new Date());
    setCorrectAnswers(0);
    setCurrentTime(0);
  };

  if (loading) return <LoadingPage />;

  if (!testData) {
    return (
      <div
        className="min-h-screen bg-cyan-950 flex items-center justify-center"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="text-center text-white">
          <Brain className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
          <h2 className="text-2xl font-bold mb-2">
            You have already done the Test
          </h2>
          <p className="text-cyan-200 mb-4">Start The next Chapter now !!</p>
          <button
            onClick={() => router.back()}
            className="bg-cyan-600 hover:bg-cyan-700 px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (testCompleted && finalResult) {
    return (
      <div className="min-h-screen bg-cyan-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
        >
          <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <h2 className="text-3xl font-bold text-gray-800 mb-2">
            Test Completed!
          </h2>
          <div className="mb-6">
            <div className="text-4xl font-bold text-cyan-600 mb-2">
              {finalResult.percentage}%
            </div>
            <p className="text-gray-600">
              {finalResult.score} out of {finalResult.totalQuestions} correct
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Time taken: {formatTime(finalResult.timeSpent)}
            </p>
          </div>

          <div className="space-y-3">
            <button
              onClick={retakeTest}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Retake Test
            </button>
            <button
              onClick={() =>
                router.push(`/student-dashboard/course?id=${courseId}`)
              }
              className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Back to Course
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = testData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / testData.totalQuestions) * 100;
  const isAnswered = answeredQuestions.has(currentQuestionIndex);
  const canGoNext =
    showFeedback && currentQuestionIndex < testData.questions.length - 1;
  const canComplete =
    showFeedback && currentQuestionIndex === testData.questions.length - 1;

  return (
    <div
      className="min-h-screen bg-cyan-950 p-4"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <nav className="sticky top-0 z-50 bg-cyan-950 font-bold text-xl border-b border-white text-white font-sans  md:px-10 h-14 flex items-center">
        <span className="text-xl font-bold text-yellow-400 mr-1.5">IT </span>
        JOBS FACTORY
      </nav>
      <div className="max-w-6xl mx-auto my-10">
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white rounded-lg p-6 mb-6 shadow-lg"
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                {testData.test.title}
              </h1>
              <p className="text-gray-600">{testData.test.description}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-cyan-600">
                <Clock className="w-5 h-5" />
                <span className="font-medium">{formatTime(currentTime)}</span>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Progress</div>
                <div className="font-bold text-cyan-600">
                  {currentQuestionIndex + 1} / {testData.totalQuestions}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-cyan-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="bg-white rounded-lg p-8 shadow-lg"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Question {currentQuestionIndex + 1}
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                {currentQuestion.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-3 mb-6">
              {Object.entries(currentQuestion.options).map(([key, value]) => (
                <motion.button
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => !showFeedback && setSelectedAnswer(key)}
                  disabled={showFeedback}
                  className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                    selectedAnswer === key
                      ? "border-cyan-600 bg-cyan-50"
                      : "border-gray-200 hover:border-cyan-300"
                  } ${
                    showFeedback
                      ? feedback?.correctAnswer === key
                        ? "border-green-500 bg-green-50"
                        : selectedAnswer === key && !feedback?.isCorrect
                        ? "border-red-500 bg-red-50"
                        : "border-gray-200 bg-gray-50"
                      : ""
                  } ${showFeedback ? "cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-cyan-600 bg-cyan-100 w-8 h-8 rounded-full flex items-center justify-center">
                      {key}
                    </span>
                    <span className="text-gray-800">{value}</span>
                    {showFeedback && feedback?.correctAnswer === key && (
                      <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                    )}
                    {showFeedback &&
                      selectedAnswer === key &&
                      !feedback?.isCorrect && (
                        <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                      )}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Feedback */}
            <AnimatePresence>
              {showFeedback && feedback && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-lg mb-6 ${
                    feedback.isCorrect
                      ? "bg-green-50 border border-green-200"
                      : "bg-red-50 border border-red-200"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {feedback.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span
                      className={`font-semibold ${
                        feedback.isCorrect ? "text-green-800" : "text-red-800"
                      }`}
                    >
                      {feedback.isCorrect ? "Correct!" : "Incorrect"}
                    </span>
                  </div>
                  {feedback.explanation && (
                    <p className="text-gray-700">{feedback.explanation}</p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Action Buttons */}
            <div className="flex justify-between items-center">
              <button
                onClick={previousQuestion}
                disabled={currentQuestionIndex === 0}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex gap-3">
                {!showFeedback && selectedAnswer && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={submitAnswer}
                    className="bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Submit Answer
                  </motion.button>
                )}

                {canGoNext && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={nextQuestion}
                    className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    Next Question
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                )}

                {canComplete && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={completeTest}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                  >
                    <Trophy className="w-4 h-4" />
                    Complete Test
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Question Navigation */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-white rounded-lg p-4 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-3">
            Question Navigation
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {testData.questions.map((_, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  setCurrentQuestionIndex(index);
                  setSelectedAnswer("");
                  setShowFeedback(false);
                  setFeedback(null);
                }}
                className={`w-10 h-10 rounded-full font-semibold transition-all ${
                  index === currentQuestionIndex
                    ? "bg-cyan-600 text-white"
                    : answeredQuestions.has(index)
                    ? "bg-green-100 text-green-700 border-2 border-green-300"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {index + 1}
              </motion.button>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-600 rounded-full"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded-full"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 rounded-full"></div>
              <span>Not Answered</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="mt-6 bg-white rounded-lg p-6 shadow-lg"
        >
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Test Statistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-cyan-50 rounded-lg">
              <div className="text-2xl font-bold text-cyan-600">
                {testData.totalQuestions}
              </div>
              <div className="text-sm text-gray-600">Total Questions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {answeredQuestions.size}
              </div>
              <div className="text-sm text-gray-600">Answered</div>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {correctAnswers}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {answeredQuestions.size > 0
                  ? Math.round((correctAnswers / answeredQuestions.size) * 100)
                  : 0}
                %
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
