"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  BookOpen,
  Upload,
  CheckCircle,
  Plus,
  X,
  AlertTriangle,
  Clock,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

type QuestionField = "question" | "A" | "B" | "C" | "D" | "correctAnswer";

interface QuestionOptions {
  A: string;
  B: string;
  C: string;
  D: string;
}

interface Question {
  question: string;
  options: QuestionOptions;
  correctAnswer: string;
}

interface CustomCalendarProps {
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  onClose: () => void;
}

interface QuizData {
  quiz: {
    _id: string;
  };
}

interface ApiErrorResponse {
  error?: string;
}

// Custom Calendar Component
const CustomCalendar: React.FC<CustomCalendarProps> = ({
  selectedDate,
  onDateSelect,
  onClose,
}) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(
    selectedDate ? new Date(selectedDate) : new Date()
  );

  const months: string[] = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (year: number, month: number, day: number): string => {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
  };

  const isToday = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    return (
      year === today.getFullYear() &&
      month === today.getMonth() &&
      day === today.getDate()
    );
  };

  const isSelected = (year: number, month: number, day: number): boolean => {
    if (!selectedDate) return false;
    const dateStr = formatDate(year, month, day);
    return dateStr === selectedDate;
  };

  const isPastDate = (year: number, month: number, day: number): boolean => {
    const today = new Date();
    const checkDate = new Date(year, month, day);
    today.setHours(0, 0, 0, 0);
    checkDate.setHours(0, 0, 0, 0);
    return checkDate < today;
  };

  const renderCalendar = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days: JSX.Element[] = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const dateStr = formatDate(year, month, day);
      const isPast = isPastDate(year, month, day);

      days.push(
        <motion.button
          key={day}
          whileHover={!isPast ? { scale: 1.05 } : {}}
          whileTap={!isPast ? { scale: 0.95 } : {}}
          onClick={() => {
            if (!isPast) {
              onDateSelect(dateStr);
              onClose();
            }
          }}
          disabled={isPast}
          className={`
            h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all
            ${
              isSelected(year, month, day)
                ? "bg-cyan-500 text-white shadow-lg"
                : isToday(year, month, day)
                ? "bg-cyan-400/20 text-cyan-300 border border-cyan-400/40"
                : isPast
                ? "text-gray-500 cursor-not-allowed opacity-50"
                : "text-cyan-200 hover:bg-cyan-700/30 hover:text-white cursor-pointer"
            }
          `}
        >
          {day}
        </motion.button>
      );
    }

    return days;
  };

  const navigateMonth = (direction: number): void => {
    setCurrentMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + direction);
      return newMonth;
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute top-full left-0 mt-2 bg-slate-800/95 backdrop-blur-sm border border-cyan-600/50 rounded-xl p-4 shadow-2xl z-50 min-w-[320px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-2 hover:bg-cyan-700/30 rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-cyan-300" />
        </button>
        <h3 className="text-cyan-200 font-semibold text-lg">
          {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={() => navigateMonth(1)}
          className="p-2 hover:bg-cyan-700/30 rounded-lg transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-cyan-300" />
        </button>
      </div>

      {/* Days of week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
          <div
            key={day}
            className="h-8 flex items-center justify-center text-xs font-medium text-cyan-400"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{renderCalendar()}</div>

      {/* Footer note */}
      <div className="mt-4 pt-3 border-t border-cyan-700/30">
        <p className="text-xs text-cyan-400/70 text-center">
          Past dates are disabled
        </p>
      </div>
    </motion.div>
  );
};

const UploadDailyQuizPage: React.FC = () => {
  const { getToken } = useAuth();
  const [date, setDate] = useState<string>("");
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "",
    },
  ]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const calendarRef = useRef<HTMLDivElement>(null);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        calendarRef.current &&
        !calendarRef.current.contains(event.target as Node)
      ) {
        setShowCalendar(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Animations
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleQuestionChange = (
    index: number,
    field: QuestionField,
    value: string
  ): void => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (field === "question" || field === "correctAnswer") {
        updated[index][field] = value;
      } else {
        updated[index].options[field] = value;
      }
      return updated;
    });
  };

  const addQuestion = (): void => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "",
      },
    ]);
  };

  const removeQuestion = (index: number): void => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const formatDisplayDate = (dateStr: string): string => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const handleSubmit = async (): Promise<void> => {
    if (!date || !title || questions.length === 0) {
      toast.error("❌ Fill all required fields");
      return;
    }

    // Check if all questions are complete
    const incompleteQuestions = questions.some(
      (q) =>
        !q.question ||
        !q.options.A ||
        !q.options.B ||
        !q.options.C ||
        !q.options.D ||
        !q.correctAnswer
    );

    if (incompleteQuestions) {
      toast.error("❌ Please complete all questions and options");
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = await getToken();

      const quizRes = await fetch(`${API_BASE_URL}/daily-quiz/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, title, description }),
      });

      const quizData: QuizData | ApiErrorResponse = await quizRes.json();

      if (!quizRes.ok) {
        const errorData = quizData as ApiErrorResponse;
        toast.error(errorData.error || "❌ Failed to create quiz");
        setIsUploading(false);
        return;
      }

      const quizId = (quizData as QuizData).quiz._id;

      const addQuestions = async (): Promise<void> => {
        for (let i = 0; i < questions.length; i++) {
          const q = questions[i];
          const res = await fetch(
            `${API_BASE_URL}/daily-quiz/${quizId}/questions`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(q),
            }
          );
          if (!res.ok) throw new Error(`Failed to upload question ${i + 1}`);
          setUploadProgress(Math.round(((i + 1) / questions.length) * 100));
        }
      };

      await addQuestions();
      toast.success("✅ Daily quiz uploaded successfully");

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setDate("");
        setTitle("");
        setDescription("");
        setQuestions([
          {
            question: "",
            options: { A: "", B: "", C: "", D: "" },
            correctAnswer: "",
          },
        ]);
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-6">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Create Daily Quiz
          </h1>
          <p className="text-cyan-200/80 text-lg">
            Upload objective questions for today's quiz
          </p>
        </motion.div>

        {/* Important Notice */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-r from-amber-900/20 to-orange-900/20 border border-amber-600/40 rounded-xl p-4 mb-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-300 font-semibold mb-1">
                ⚠️ Important Notice
              </h3>
              <p className="text-amber-200/80 text-sm">
                Be cautious when setting the date. The quiz will only be
                available for the specific date you choose and cannot be
                modified later.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quiz Info */}
        <motion.div
          variants={itemVariants}
          className="bg-gradient-to-br from-cyan-900/30 to-blue-900/20 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-cyan-500/20 rounded-xl">
              <BookOpen className="w-6 h-6 text-cyan-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Quiz Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div className="md:col-span-2">
              <label className="block text-cyan-200 font-medium mb-2">
                <CalendarDays className="w-4 h-4 inline mr-2" />
                Quiz Date
              </label>
              <div className="relative" ref={calendarRef}>
                <button
                  onClick={() => setShowCalendar(!showCalendar)}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors text-left flex items-center justify-between hover:bg-cyan-900/40"
                >
                  <span className={date ? "text-white" : "text-cyan-300/60"}>
                    {date ? formatDisplayDate(date) : "Select quiz date"}
                  </span>
                  <Calendar className="w-5 h-5 text-cyan-400" />
                </button>

                <AnimatePresence>
                  {showCalendar && (
                    <CustomCalendar
                      selectedDate={date}
                      onDateSelect={setDate}
                      onClose={() => setShowCalendar(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Quiz Title */}
            <div className="md:col-span-2">
              <label className="block text-cyan-200 font-medium mb-2">
                Quiz Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                placeholder="e.g., JavaScript Basics Daily Quiz"
              />
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-cyan-200 font-medium mb-2">
                Description (optional)
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                placeholder="Describe what this quiz covers..."
              />
            </div>
          </div>
        </motion.div>

        {/* Questions Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-blue-500/20 rounded-xl">
              <Clock className="w-6 h-6 text-blue-300" />
            </div>
            <h2 className="text-2xl font-semibold text-white">Questions</h2>
            <span className="bg-cyan-600/20 text-cyan-300 px-3 py-1 rounded-full text-sm font-medium">
              {questions.length} Question{questions.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2">
            {questions.map((q, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-gradient-to-br from-cyan-800/15 to-blue-800/15 border border-cyan-600/30 rounded-xl p-6 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-cyan-300 font-semibold text-lg">
                    Question {index + 1}
                  </span>
                  {questions.length > 1 && (
                    <button
                      onClick={() => removeQuestion(index)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1 hover:bg-red-900/20 rounded-lg"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                {/* Question Input */}
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Question Text
                  </label>
                  <input
                    type="text"
                    placeholder="Enter your question here..."
                    value={q.question}
                    onChange={(e) =>
                      handleQuestionChange(index, "question", e.target.value)
                    }
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  />
                </div>

                {/* Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {(["A", "B", "C", "D"] as const).map((opt) => (
                    <div key={opt}>
                      <label className="block text-cyan-200 font-medium mb-1">
                        Option {opt}
                      </label>
                      <input
                        type="text"
                        placeholder={`Enter option ${opt}`}
                        value={q.options[opt]}
                        onChange={(e) =>
                          handleQuestionChange(index, opt, e.target.value)
                        }
                        className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      />
                    </div>
                  ))}
                </div>

                {/* Correct Answer */}
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Correct Answer
                  </label>
                  <select
                    value={q.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        index,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="">Select correct answer...</option>
                    {["A", "B", "C", "D"].map((opt) => (
                      <option key={opt} value={opt}>
                        Option {opt}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <button
            onClick={addQuestion}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105 shadow-lg"
          >
            <Plus className="w-5 h-5" />
            Add Question
          </button>

          <button
            onClick={handleSubmit}
            disabled={isUploading}
            className="bg-gradient-to-r from-emerald-500 to-cyan-600 hover:from-emerald-600 hover:to-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100 min-w-[200px]"
          >
            {isUploading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Uploading...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Upload className="w-5 h-5" />
                Submit Quiz
              </span>
            )}
          </button>
        </motion.div>

        {/* Upload Progress Modal */}
        <AnimatePresence>
          {isUploading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-gradient-to-br from-cyan-900 to-blue-900 border border-cyan-600/50 rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl"
              >
                <div className="text-center">
                  <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-cyan-400 animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-2">
                    Uploading Daily Quiz
                  </h3>
                  <p className="text-cyan-200/70 mb-6">
                    Please wait while we process your quiz...
                  </p>

                  <div className="w-full bg-cyan-900/50 rounded-full h-3 mb-4 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>

                  <p className="text-cyan-300 font-medium">
                    {Math.round(uploadProgress)}% Complete
                  </p>

                  {uploadProgress === 100 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4"
                    >
                      <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                      <p className="text-green-300 font-medium">
                        Upload Complete!
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default UploadDailyQuizPage;
