"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowDownRight,
  Code,
  HardHat,
  Plus,
  X,
  CheckCircle,
  Upload,
  Target,
  BookOpen,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/lib/api";

interface Course {
  _id: string;
  title: string;
}

interface TestCase {
  input: string;
  output: string;
}

interface Example {
  input: string;
  output: string;
}

type DifficultyLevel = "easy" | "medium" | "hard";
type SetStateFunction<T> = React.Dispatch<React.SetStateAction<T[]>>;

export default function PracticeUploadPage(): JSX.Element {
  const { getToken } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [courseId, setCourseId] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("easy");
  const [examples, setExamples] = useState<Example[]>([
    { input: "", output: "" },
  ]);
  const [testCases, setTestCases] = useState<TestCase[]>([
    { input: "", output: "" },
  ]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch courses");

        const data = await res.json();
        setCourses(data.courses || []);
        setCourseId(data.courses?.[0]?._id || "");
      } catch (err) {
        console.error("Failed to fetch courses:", err);
        toast.error("Could not load courses.");
      }
    };

    fetchCourses();
  }, [getToken]);

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

  const handleAddField = <T extends TestCase | Example>(
    setFn: SetStateFunction<T>
  ) => {
    setFn((prev) => [...prev, { input: "", output: "" } as T]);
  };

  const handleRemoveField = <T extends TestCase | Example>(
    setFn: SetStateFunction<T>,
    i: number,
    minLength: number = 1
  ) => {
    setFn((prev) => {
      if (prev.length > minLength) {
        return prev.filter((_, index) => index !== i);
      }
      return prev;
    });
  };

  const handleChange = <T extends TestCase | Example>(
    setFn: SetStateFunction<T>,
    i: number,
    field: keyof T,
    value: string
  ) => {
    setFn((prev) => {
      const copy = [...prev];
      copy[i] = { ...copy[i], [field]: value };
      return copy;
    });
  };

  // Fixed: Added the missing renderTestCaseSection function
  const renderTestCaseSection = (
    title: string,
    items: TestCase[] | Example[],
    setItems: SetStateFunction<TestCase> | SetStateFunction<Example>,
    icon: React.ReactNode
  ) => (
    <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-cyan-500/20 rounded-lg">{icon}</div>
          <h2 className="text-2xl font-semibold text-white">{title}</h2>
        </div>
        <button
          onClick={() => handleAddField(setItems as any)}
          className="p-2 bg-cyan-500/20 hover:bg-cyan-500/30 rounded-lg transition-colors"
          type="button"
        >
          <Plus className="w-5 h-5 text-cyan-300" />
        </button>
      </div>

      <div className="space-y-4">
        {items.map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-cyan-900/20 border border-cyan-700/30 rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-cyan-200 font-medium">
                {title.slice(0, -1)} {i + 1}
              </span>
              {items.length > 1 && (
                <button
                  onClick={() => handleRemoveField(setItems as any, i)}
                  className="p-1 hover:bg-red-500/20 rounded-lg transition-colors"
                  type="button"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Input
                </label>
                <textarea
                  value={item.input}
                  onChange={(e) =>
                    handleChange(setItems as any, i, "input", e.target.value)
                  }
                  rows={3}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none text-sm"
                  placeholder="Enter input..."
                />
              </div>
              <div>
                <label className="block text-cyan-300 text-sm font-medium mb-2">
                  Expected Output
                </label>
                <textarea
                  value={item.output}
                  onChange={(e) =>
                    handleChange(setItems as any, i, "output", e.target.value)
                  }
                  rows={3}
                  className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-lg px-3 py-2 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none text-sm"
                  placeholder="Enter expected output..."
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const handleSubmit = async () => {
    if (!title || !description || !courseId) {
      toast.error("Please fill all required fields.");
      return;
    }

    const hasEmptyFields =
      examples.some((e) => !e.input || !e.output) ||
      testCases.some((t) => !t.input || !t.output);

    if (hasEmptyFields) {
      toast.error(
        "All examples and test cases must have both input and output."
      );
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const token = await getToken();

      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + Math.random() * 10;
        });
      }, 200);

      const res = await fetch(`${API_BASE_URL}/api/practice/create-question`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title,
          description,
          courseId,
          difficulty,
          examples: JSON.stringify(examples),
          testCases: JSON.stringify(testCases),
        }),
      });

      clearInterval(progressInterval);

      if (!res.ok) throw new Error("Upload failed");

      setUploadProgress(100);

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        toast.success("Practice question created successfully!");

        // Reset form
        setTitle("");
        setDescription("");
        setExamples([{ input: "", output: "" }]);
        setTestCases([{ input: "", output: "" }]);
        setDifficulty("easy");
        setCourseId(courses[0]?._id || "");
      }, 1000);
    } catch (err) {
      console.error("Error uploading:", err);
      toast.error("Server error. Try again.");
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

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
            Upload Coding Questions
          </h1>
          <p className="text-cyan-200/80 text-lg">
            Create practice questions for your courses{" "}
            <ArrowDownRight className="w-5 h-5 inline text-cyan-200/80" />
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column - Main Info */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Question Info Card */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <Code className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-2xl font-semibold text-white">
                  Question Details
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    Question Title
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setTitle(e.target.value)
                    }
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors"
                    placeholder="e.g., Two Sum Problem"
                  />
                </div>

                <div>
                  <label className="block text-cyan-200 font-medium mb-2">
                    <Target className="w-4 h-4 inline mr-2" />
                    Problem Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                      setDescription(e.target.value)
                    }
                    rows={6}
                    className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white placeholder-cyan-300/50 focus:border-cyan-400 focus:outline-none transition-colors resize-none"
                    placeholder="Describe the problem statement, constraints, and requirements..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-cyan-200 font-medium mb-2">
                      <HardHat className="w-4 h-4 inline mr-2" />
                      Difficulty Level
                    </label>
                    <select
                      value={difficulty}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setDifficulty(e.target.value as DifficultyLevel)
                      }
                      className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option value="easy">🟢 Easy</option>
                      <option value="medium">🟡 Medium</option>
                      <option value="hard">🔴 Hard</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-cyan-200 font-medium mb-2">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      Select Course
                    </label>
                    <select
                      value={courseId}
                      onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                        setCourseId(e.target.value)
                      }
                      className="w-full bg-cyan-900/30 border border-cyan-600/50 rounded-xl px-4 py-3 text-white focus:border-cyan-400 focus:outline-none transition-colors"
                    >
                      <option value="">Choose a course...</option>
                      {courses.map((course: Course) => (
                        <option
                          key={course._id}
                          value={course._id}
                          className="bg-cyan-900"
                        >
                          {course.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Examples Section */}
            {renderTestCaseSection(
              "Examples",
              examples,
              setExamples,
              <Target className="w-6 h-6 text-cyan-300" />
            )}
          </motion.div>

          {/* Right Column - Test Cases */}
          <motion.div variants={itemVariants} className="space-y-6">
            {/* Test Cases Section */}
            {renderTestCaseSection(
              "Test Cases",
              testCases,
              setTestCases,
              <Code className="w-6 h-6 text-cyan-300" />
            )}

            {/* Question Summary Card */}
            <div className="bg-gradient-to-br from-cyan-900/50 to-blue-900/30 backdrop-blur-sm border border-cyan-700/50 rounded-2xl p-6 shadow-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-cyan-500/20 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-cyan-300" />
                </div>
                <h2 className="text-xl font-semibold text-white">Summary</h2>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-cyan-200">Examples:</span>
                  <span className="text-white font-medium">
                    {examples.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Test Cases:</span>
                  <span className="text-white font-medium">
                    {testCases.length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Difficulty:</span>
                  <span className="text-white font-medium capitalize">
                    {difficulty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-cyan-200">Course:</span>
                  <span className="text-white font-medium">
                    {courses.find((c: Course) => c._id === courseId)?.title ||
                      "Not selected"}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Submit Button */}
        <motion.div variants={itemVariants} className="text-center mt-8">
          <button
            onClick={handleSubmit}
            disabled={isUploading || !title || !description || !courseId}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-12 py-4 rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
            type="button"
          >
            {isUploading ? "Creating Question..." : "Create Practice Question"}
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
                    Creating Question
                  </h3>
                  <p className="text-cyan-200/70 mb-6">
                    Please wait while we process your coding question...
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
                        Question Created Successfully!
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
