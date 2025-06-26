"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "../Loader";

type Problem = {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
};

export default function PracticeProblemList({
  courseId,
}: {
  courseId: string;
}) {
  const { getToken } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "easy" | "medium" | "hard" | "solved" | "unsolved"
  >("all");

  useEffect(() => {
    const fetchProblems = async () => {
      const token = await getToken();

      const [problemsRes, userRes] = await Promise.all([
        fetch(`http://localhost:5000/api/practice/questions/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const problemsData = await problemsRes.json();
      const userData = await userRes.json();

      setProblems(problemsData.questions || []);
      setSolved(userData.solvedProblems?.map((q: any) => q.questionId) || []);
      setLoading(false);
    };

    fetchProblems();
  }, [courseId, getToken]);

  const filteredProblems = problems.filter((problem) => {
    const isSolved = solved.includes(problem._id);

    switch (filter) {
      case "easy":
      case "medium":
      case "hard":
        return problem.difficulty === filter;
      case "solved":
        return isSolved;
      case "unsolved":
        return !isSolved;
      default:
        return true;
    }
  });

  const getDifficultyConfig = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return {
          color: "text-emerald-600",
          bg: "bg-emerald-50",
          border: "border-emerald-200",
          icon: "🟢",
        };
      case "medium":
        return {
          color: "text-amber-600",
          bg: "bg-amber-50",
          border: "border-amber-200",
          icon: "🟡",
        };
      case "hard":
        return {
          color: "text-red-600",
          bg: "bg-red-50",
          border: "border-red-200",
          icon: "🔴",
        };
      default:
        return {
          color: "text-gray-600",
          bg: "bg-gray-50",
          border: "border-gray-200",
          icon: "⚪",
        };
    }
  };

  const getStats = () => {
    const total = problems.length;
    const solvedCount = solved.length;
    const easy = problems.filter((p) => p.difficulty === "easy").length;
    const medium = problems.filter((p) => p.difficulty === "medium").length;
    const hard = problems.filter((p) => p.difficulty === "hard").length;

    return { total, solvedCount, easy, medium, hard };
  };

  if (loading) return <LoadingPage />;

  const stats = getStats();

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            Coding Problems
          </h2>
          <p className="text-cyan-200 text-sm sm:text-base">
            {stats.total} problems • {stats.solvedCount} solved •{" "}
            {((stats.solvedCount / stats.total) * 100).toFixed(0)}% completion
          </p>
        </div>

        {/* Progress Ring */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative w-16 h-16 sm:w-20 sm:h-20"
        >
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 36 36"
          >
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="2"
            />
            <path
              d="M18 2.0845a 15.9155 15.9155 0 0 1 0 31.831a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="url(#gradient)"
              strokeWidth="2"
              strokeDasharray={`${
                (stats.solvedCount / stats.total) * 100
              }, 100`}
              strokeLinecap="round"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">
              {Math.round((stats.solvedCount / stats.total) * 100)}%
            </span>
          </div>
        </motion.div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4"
      >
        {[
          {
            label: "Easy",
            count: stats.easy,
            color: "from-emerald-500 to-emerald-600",
          },
          {
            label: "Medium",
            count: stats.medium,
            color: "from-amber-500 to-amber-600",
          },
          {
            label: "Hard",
            count: stats.hard,
            color: "from-red-500 to-red-600",
          },
          {
            label: "Total",
            count: stats.total,
            color: "from-cyan-500 to-blue-600",
          },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
            className={`bg-gradient-to-br ${stat.color} rounded-xl p-4 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105`}
          >
            <div className="text-2xl sm:text-3xl font-bold">{stat.count}</div>
            <div className="text-xs sm:text-sm font-medium opacity-90">
              {stat.label}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filter Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-wrap gap-2"
      >
        {[
          { key: "all", label: "All Problems" },
          { key: "easy", label: "Easy" },
          { key: "medium", label: "Medium" },
          { key: "hard", label: "Hard" },
          { key: "solved", label: "Solved" },
          { key: "unsolved", label: "Unsolved" },
        ].map((filterOption) => (
          <button
            key={filterOption.key}
            onClick={() => setFilter(filterOption.key as typeof filter)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 transform hover:scale-105 ${
              filter === filterOption.key
                ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg"
                : "bg-white/10 text-cyan-200 hover:bg-white/20 backdrop-blur-sm border border-white/20"
            }`}
          >
            {filterOption.label}
          </button>
        ))}
      </motion.div>

      {/* Problems List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="backdrop-blur-sm bg-white/10 rounded-xl border border-white/20 overflow-hidden shadow-2xl"
      >
        {/* Table Header */}
        <div className="bg-gradient-to-r from-cyan-500/20 to-blue-600/20 backdrop-blur-sm border-b border-white/20 px-6 py-4">
          <div className="grid grid-cols-12 gap-4 font-semibold text-white text-sm sm:text-base">
            <span className="col-span-6 sm:col-span-5">Problem</span>
            <span className="col-span-3 sm:col-span-3">Difficulty</span>
            <span className="col-span-3 sm:col-span-2">Status</span>
            <span className="hidden sm:block sm:col-span-2">Action</span>
          </div>
        </div>

        {/* Table Body */}
        <AnimatePresence>
          {filteredProblems.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-8 text-center text-cyan-200"
            >
              <div className="text-4xl mb-4">🔍</div>
              <p className="text-lg font-medium mb-2">No problems found</p>
              <p className="text-sm opacity-75">
                Try adjusting your filter settings
              </p>
            </motion.div>
          ) : (
            filteredProblems.map((problem, index) => {
              const isSolved = solved.includes(problem._id);
              const difficultyConfig = getDifficultyConfig(problem.difficulty);

              return (
                <motion.div
                  key={problem._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="border-b border-white/10 last:border-b-0"
                >
                  <Link
                    href={`/solve/${problem._id}`}
                    className="grid grid-cols-12 gap-4 items-center px-6 py-4 hover:bg-white/5 transition-all duration-300 group"
                  >
                    {/* Problem Title */}
                    <span className="col-span-6 sm:col-span-5 text-white font-medium group-hover:text-cyan-300 transition-colors duration-300 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                      {problem.title}
                    </span>

                    {/* Difficulty */}
                    <span className="col-span-3 sm:col-span-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${difficultyConfig.bg} ${difficultyConfig.color} ${difficultyConfig.border} border`}
                      >
                        <span className="text-xs">{difficultyConfig.icon}</span>
                        <span className="capitalize">{problem.difficulty}</span>
                      </span>
                    </span>

                    {/* Status */}
                    <span className="col-span-3 sm:col-span-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                          isSolved
                            ? "bg-emerald-100 text-emerald-700 border border-emerald-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}
                      >
                        <span className="text-xs">
                          {isSolved ? "✅" : "⏳"}
                        </span>
                        {isSolved ? "Solved" : "Unsolved"}
                      </span>
                    </span>

                    {/* Action Button (Desktop Only) */}
                    <span className="hidden sm:block sm:col-span-2">
                      <button className="px-3 py-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-105 hover:shadow-lg">
                        {isSolved ? "Review" : "Solve"}
                      </button>
                    </span>
                  </Link>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="text-center text-cyan-200 text-sm"
      >
        Showing {filteredProblems.length} of {problems.length} problems
      </motion.div>
    </div>
  );
}
