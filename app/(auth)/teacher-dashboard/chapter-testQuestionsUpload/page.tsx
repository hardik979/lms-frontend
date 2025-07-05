"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "@/lib/api";
import { toast } from "react-toastify";
import {
  Plus,
  Trash2,
  TestTube,
  BookOpen,
  Upload,
  CheckCircle,
  ArrowDownRight,
  Target,
  GraduationCap,
} from "lucide-react";

type Course = {
  _id: string;
  title: string;
  chapters: { title: string }[];
};

type TestQuestion = {
  question: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: "A" | "B" | "C" | "D";
  explanation: string;
};

export default function UploadTestPage() {
  const { getToken } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);

  const [testTitle, setTestTitle] = useState("");
  const [testDescription, setTestDescription] = useState("");
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  // ✅ FETCH COURSES WITH ROBUST LOGIC
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();
        setCourses(data.courses || []);
        setSelectedCourseId(data.courses?.[0]?._id || "");
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Could not load courses.");
      }
    };
    fetchCourses();
  }, [getToken]);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        options: { A: "", B: "", C: "", D: "" },
        correctAnswer: "A",
        explanation: "",
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length > 1) {
      setQuestions((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleQuestionChange = (
    index: number,
    field: keyof TestQuestion,
    value: string | TestQuestion["options"]
  ) => {
    setQuestions((prev) => {
      const updated = [...prev];
      if (field === "options") {
        updated[index].options = value as TestQuestion["options"];
      } else {
        (updated[index] as any)[field] = value;
      }
      return updated;
    });
  };

  const handleSubmit = async () => {
    if (!selectedCourseId || !testTitle.trim() || questions.length === 0) {
      toast.error("Please fill all required fields.");
      return;
    }

    // Validate questions
    const hasEmptyFields = questions.some(
      (q) =>
        !q.question.trim() ||
        !q.options.A.trim() ||
        !q.options.B.trim() ||
        !q.options.C.trim() ||
        !q.options.D.trim()
    );

    if (hasEmptyFields) {
      toast.error(
        "All questions must have question text and all four options filled."
      );
      return;
    }

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const token = await getToken();

      // Progress animation
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      // Create the test metadata
      const res = await fetch(`${API_BASE_URL}/api/tests/create-test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          courseId: selectedCourseId,
          chapterIndex: selectedChapterIndex,
          title: testTitle,
          description: testDescription,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        clearInterval(progressInterval);
        toast.error(`❌ Test creation failed: ${error.error}`);
        setIsSubmitting(false);
        setUploadProgress(0);
        return;
      }

      const { test } = await res.json();

      // Upload questions
      for (const q of questions) {
        await fetch(`${API_BASE_URL}/api/tests/${test._id}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(q),
        });
      }

      clearInterval(progressInterval);
      setUploadProgress(100);

      setTimeout(() => {
        toast.success("✅ Test and questions uploaded successfully!");
        setQuestions([]);
        setTestTitle("");
        setTestDescription("");
        setIsSubmitting(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error.");
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const selectedCourse = courses.find((c) => c._id === selectedCourseId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl p-6">
      <motion.div
        className="max-w-6xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-300 via-blue-300 to-cyan-300 bg-clip-text text-transparent mb-2">
            Upload Chapter Test
          </h1>
          <p className="text-cyan-200/80 text-lg">
            Create comprehensive tests for your course chapters{" "}
            <ArrowDownRight className="w-5 h-5 inline text-cyan-200/80" />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Test Details */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Test Info Card */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <TestTube className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Test Details
                </h2>
              </div>

              <div className="space-y-4">
                {/* Course Selector */}
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <GraduationCap className="w-4 h-4 inline mr-2" />
                    Select Course
                  </label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => {
                      setSelectedCourseId(e.target.value);
                      setSelectedChapterIndex(0);
                    }}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                  >
                    <option value="">Choose a course...</option>
                    {courses.map((c) => (
                      <option key={c._id} value={c._id} className="bg-cyan-900">
                        {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Selector - FIXED */}
                {selectedCourseId && (
                  <div>
                    <label className="block text-cyan-200 font-medium mb-2">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Select Chapter
                    </label>
                    <select
                      value={selectedChapterIndex}
                      onChange={(e) =>
                        setSelectedChapterIndex(parseInt(e.target.value))
                      }
                      className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                      disabled={!selectedCourse}
                    >
                      {selectedCourse &&
                      selectedCourse.chapters &&
                      selectedCourse.chapters.length > 0 ? (
                        selectedCourse.chapters.map((ch, idx) => (
                          <option key={idx} value={idx} className="bg-cyan-900">
                            {idx + 1}. {ch.title}
                          </option>
                        ))
                      ) : (
                        <option value="">No chapters available</option>
                      )}
                    </select>
                  </div>
                )}

                {/* Test Title */}
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Test Title
                  </label>
                  <input
                    type="text"
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="e.g., Chapter 1 - Introduction Test"
                  />
                </div>

                {/* Test Description */}
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Test Description
                  </label>
                  <textarea
                    value={testDescription}
                    onChange={(e) => setTestDescription(e.target.value)}
                    rows={4}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    placeholder="Describe what this test covers..."
                  />
                </div>
              </div>
            </div>

            {/* Test Summary Card - FIXED */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-xl font-semibold text-white">
                  Test Summary
                </h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-200">Total Questions:</span>
                  <span className="text-white font-medium">
                    {questions.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Course:</span>
                  <span className="text-white font-medium">
                    {selectedCourse?.title || "Not selected"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Chapter:</span>
                  <span className="text-white font-medium">
                    {selectedCourse?.chapters?.[selectedChapterIndex]?.title ||
                      "Not selected"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column - Questions */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Questions Section */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-500/20 rounded-lg">
                    <BookOpen className="w-6 h-6 text-cyan-300" />
                  </div>
                  <h2 className="text-2xl font-semibold text-white">
                    Test Questions
                  </h2>
                </div>
                <button
                  onClick={addQuestion}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30 rounded-xl text-cyan-300 transition-all transform hover:scale-105"
                >
                  <Plus className="w-4 h-4" />
                  Add Question
                </button>
              </div>

              <div className="space-y-6 max-h-96 overflow-y-auto pr-2">
                {questions.length === 0 ? (
                  <div className="text-center py-8 text-cyan-300/70">
                    <TestTube className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>
                      No questions added yet. Click "Add Question" to start.
                    </p>
                  </div>
                ) : (
                  questions.map((q, qi) => (
                    <motion.div
                      key={qi}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4"
                    >
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-2">
                          <span className="text-cyan-200 font-medium">
                            Question {qi + 1}
                          </span>
                        </div>
                        <button
                          onClick={() => removeQuestion(qi)}
                          className="flex items-center gap-1 text-red-300 hover:text-red-400 hover:bg-red-500/10 px-2 py-1 rounded-lg transition-colors"
                          disabled={questions.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>

                      <div className="space-y-4">
                        <textarea
                          value={q.question}
                          onChange={(e) =>
                            handleQuestionChange(qi, "question", e.target.value)
                          }
                          placeholder="Enter question text..."
                          rows={3}
                          className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none text-sm"
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {(["A", "B", "C", "D"] as const).map((opt) => (
                            <input
                              key={opt}
                              value={q.options[opt]}
                              onChange={(e) =>
                                handleQuestionChange(qi, "options", {
                                  ...q.options,
                                  [opt]: e.target.value,
                                })
                              }
                              placeholder={`Option ${opt}`}
                              className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                            />
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <select
                            value={q.correctAnswer}
                            onChange={(e) =>
                              handleQuestionChange(
                                qi,
                                "correctAnswer",
                                e.target.value as "A" | "B" | "C" | "D"
                              )
                            }
                            className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                          >
                            {(["A", "B", "C", "D"] as const).map((opt) => (
                              <option
                                key={opt}
                                value={opt}
                                className="bg-cyan-900"
                              >
                                Correct Answer: {opt}
                              </option>
                            ))}
                          </select>
                          <input
                            value={q.explanation}
                            onChange={(e) =>
                              handleQuestionChange(
                                qi,
                                "explanation",
                                e.target.value
                              )
                            }
                            placeholder="Explanation (optional)"
                            className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors text-sm"
                          />
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button
            disabled={
              isSubmitting ||
              !selectedCourseId ||
              !testTitle.trim() ||
              questions.length === 0
            }
            onClick={handleSubmit}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
          >
            {isSubmitting ? "Uploading Test..." : "Upload Test"}
          </button>
        </motion.div>

        {/* Upload Progress Modal */}
        <AnimatePresence>
          {isSubmitting && (
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
                    Creating Test
                  </h3>
                  <p className="text-cyan-200/70 mb-6">
                    Please wait while we process your test and questions...
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
                        Test Created Successfully!
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
}
