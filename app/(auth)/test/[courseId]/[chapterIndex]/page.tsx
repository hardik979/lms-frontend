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
  History,
} from "lucide-react";
import { toast } from "react-toastify";
import LoadingPage from "@/components/Loader";
import { API_BASE_URL } from "@/lib/api";

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

interface PreviousResult {
  attempt: number;
  score: number;
  percentage: number;
  completedAt: string;
  timeSpent: number;
}

interface TestData {
  test: {
    _id: string;
    title: string;
    description: string;
  };
  questions: Question[];
  totalQuestions: number;
  attemptNumber: number;
  previousResults: PreviousResult[];
  canRetake: boolean;
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
  const [showPreviousResults, setShowPreviousResults] = useState(false);

  useEffect(() => {
    fetchTest();
  }, [courseId, chapterIndex]);

  useEffect(() => {
    if (testData && !testCompleted) {
      setStartTime(new Date());
    }
  }, [testData, testCompleted]);
  useEffect(() => {
    if (!startTime) return;

    const timer = setInterval(() => {
      setCurrentTime(Math.floor((Date.now() - startTime.getTime()) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);
  const fetchTest = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token) return;

      // First, get the test info
      const response = await fetch(
        `${API_BASE_URL}/api/tests/course/${courseId}/chapter/${chapterIndex}`,
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

      // Start the test (this will always work now)
      const startResponse = await fetch(
        `${API_BASE_URL}/api/tests/${data.test._id}/start`,
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

      // Show previous results if any
      if (startData.previousResults && startData.previousResults.length > 0) {
        toast.info(`This is attempt #${startData.attemptNumber}`);
      }
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
        `${API_BASE_URL}/api/tests/${testData.test._id}/submit-answer`,
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
      );

      const answers = Object.entries(userAnswers).map(
        ([questionId, selectedAnswer]) => ({
          questionId,
          selectedAnswer,
        })
      );

      const response = await fetch(
        `${API_BASE_URL}/api/tests/${testData.test._id}/complete`,
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
        throw new Error(errorData.error || "Failed to complete test");
      }

      const result = await response.json();
      setFinalResult(result.result);
      setTestCompleted(true);

      toast.success(`Test completed! Attempt #${result.result.attempt}`);
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

  const startNewAttempt = () => {
    // Reset all state for new attempt
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnsweredQuestions(new Set());
    setUserAnswers({});
    setFeedback(null);
    setShowFeedback(false);
    setTestCompleted(false);
    setFinalResult(null);
    setCorrectAnswers(0);
    setCurrentTime(0);
    setShowPreviousResults(false);

    // Re-fetch test data to get updated attempt number
    fetchTest();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
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
          <h2 className="text-2xl font-bold mb-2">Test Not Available</h2>
          <p className="text-cyan-200 mb-4">
            There seems to be an issue loading the test.
          </p>
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
          <div className="mb-2">
            <span className="text-sm text-gray-500">
              Attempt #{finalResult.attempt}
            </span>
          </div>
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

          {/* Previous Results Summary */}
          {testData.previousResults.length > 0 && (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <button
                onClick={() => setShowPreviousResults(!showPreviousResults)}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-800 mx-auto"
              >
                <History className="w-4 h-4" />
                {showPreviousResults ? "Hide" : "Show"} Previous Attempts (
                {testData.previousResults.length})
              </button>

              {showPreviousResults && (
                <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
                  {testData.previousResults.map((result) => (
                    <div
                      key={result.attempt}
                      className="text-xs text-gray-600 flex justify-between"
                    >
                      <span>Attempt #{result.attempt}</span>
                      <span>
                        {result.percentage}% ({result.score}/
                        {testData.totalQuestions})
                      </span>
                      <span>{formatDate(result.completedAt)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="space-y-3">
            {testData.attemptNumber < 3 ? (
              <button
                onClick={startNewAttempt}
                className="w-full bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Take Another Attempt
              </button>
            ) : (
              <button
                disabled
                className="w-full bg-gray-400 text-white px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-not-allowed"
              >
                <RotateCcw className="w-4 h-4" />
                Attempt Limit Reached
              </button>
            )}

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
      <nav className="sticky top-0 z-50 bg-cyan-950 [font-family:var(--font-righteous)] font-bold text-xl border-b border-white text-sky-400  md:px-10 h-14 flex items-center">
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
              <div className="mt-2 flex items-center gap-4 text-sm">
                <span className="text-cyan-600 font-medium">
                  Attempt #{testData.attemptNumber}
                </span>
                {testData.previousResults.length > 0 && (
                  <span className="text-gray-500">
                    Previous attempts: {testData.previousResults.length}
                  </span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2 text-gray-600 mb-2">
                <Clock className="w-4 h-4" />
                <span className="font-mono">{formatTime(currentTime)}</span>
              </div>
              <div className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {testData.totalQuestions}
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="bg-cyan-600 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </motion.div>

        {/* Question Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -50, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 mb-6 shadow-lg"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                {currentQuestion.question}
              </h2>

              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <motion.label
                    key={key}
                    className={`
                      block p-4 rounded-lg border-2 cursor-pointer transition-all
                      ${
                        selectedAnswer === key
                          ? "border-cyan-500 bg-cyan-50"
                          : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                      }
                      ${
                        showFeedback && feedback
                          ? feedback.correctAnswer === key
                            ? "border-green-500 bg-green-50"
                            : feedback.selectedAnswer === key &&
                              !feedback.isCorrect
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                          : ""
                      }
                    `}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <input
                      type="radio"
                      name="answer"
                      value={key}
                      checked={selectedAnswer === key}
                      onChange={(e) => setSelectedAnswer(e.target.value)}
                      disabled={showFeedback}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <span className="w-6 h-6 rounded-full border-2 border-gray-300 flex items-center justify-center mr-3 text-sm font-medium">
                        {key}
                      </span>
                      <span className="text-gray-700">{value}</span>
                      {showFeedback && feedback && (
                        <div className="ml-auto">
                          {feedback.correctAnswer === key && (
                            <CheckCircle className="w-5 h-5 text-green-500" />
                          )}
                          {feedback.selectedAnswer === key &&
                            !feedback.isCorrect && (
                              <XCircle className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                      )}
                    </div>
                  </motion.label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            {!showFeedback && (
              <div className="flex justify-center">
                <button
                  onClick={submitAnswer}
                  disabled={!selectedAnswer}
                  className="bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg transition-colors font-medium"
                >
                  Submit Answer
                </button>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Feedback Section */}
        <AnimatePresence>
          {showFeedback && feedback && (
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              className={`
                rounded-lg p-6 mb-6 shadow-lg
                ${
                  feedback.isCorrect
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }
              `}
            >
              <div className="flex items-center mb-4">
                {feedback.isCorrect ? (
                  <CheckCircle className="w-6 h-6 text-green-600 mr-2" />
                ) : (
                  <XCircle className="w-6 h-6 text-red-600 mr-2" />
                )}
                <h3
                  className={`text-lg font-semibold ${
                    feedback.isCorrect ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {feedback.isCorrect ? "Correct!" : "Incorrect"}
                </h3>
              </div>

              {!feedback.isCorrect && (
                <p className="text-red-700 mb-2">
                  The correct answer is:{" "}
                  <strong>{feedback.correctAnswer}</strong>
                </p>
              )}

              <p className="text-gray-700 mb-4">{feedback.explanation}</p>

              {/* Navigation Buttons */}
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
                  {canComplete ? (
                    <button
                      onClick={completeTest}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors font-medium"
                    >
                      Complete Test
                    </button>
                  ) : (
                    <button
                      onClick={nextQuestion}
                      disabled={!canGoNext}
                      className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-2 rounded-lg transition-colors font-medium disabled:opacity-50"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Question Navigation */}
        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Question Overview
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {testData.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  if (index <= Math.max(...Array.from(answeredQuestions))) {
                    setCurrentQuestionIndex(index);
                    setSelectedAnswer(
                      userAnswers[testData.questions[index]._id] || ""
                    );
                    setShowFeedback(false);
                    setFeedback(null);
                  }
                }}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-colors
                  ${
                    index === currentQuestionIndex
                      ? "bg-cyan-600 text-white"
                      : answeredQuestions.has(index)
                      ? "bg-green-100 text-green-800 border-green-300"
                      : "bg-gray-100 text-gray-600 border-gray-300"
                  }
                  ${
                    index <=
                    Math.max(
                      ...Array.from(answeredQuestions),
                      currentQuestionIndex
                    )
                      ? "cursor-pointer hover:opacity-80"
                      : "cursor-not-allowed opacity-50"
                  }
                `}
                disabled={
                  index >
                  Math.max(
                    ...Array.from(answeredQuestions),
                    currentQuestionIndex
                  )
                }
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="flex justify-center gap-6 mt-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-cyan-600 rounded"></div>
              <span>Current</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border border-gray-300 rounded"></div>
              <span>Not Answered</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
