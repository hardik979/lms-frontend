"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "@/components/Loader";

interface Student {
  id: number;
  name: string;
  avatar: string;
  totalScore: number;
  videosWatched: number;
  totalVideos: number;
  assessmentsCompleted: number;
  totalAssessments: number;
  watchTime: number;
  streak: number;
  lastActive: string;
  badge?: string;
  level: number;
  xp: number;
  nextLevelXp: number;
}

interface LeaderboardStats {
  totalStudents: number;
  avgCompletion: number;
  topPerformer: string;
  weeklyGrowth: number;
}

const LeaderboardDashboard: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [filterType, setFilterType] = useState<
    "overall" | "videos" | "assessments"
  >("overall");
  const [refreshCountdown, setRefreshCountdown] = useState(7);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const generateMockData = (): Student[] => {
    const names = [
      "Arjun Sharma",
      "Priya Patel",
      "Rahul Kumar",
      "Sneha Singh",
      "Vikram Joshi",
      "Ananya Gupta",
      "Rohan Mehta",
      "Kavya Reddy",
      "Aditya Verma",
      "Shreya Nair",
      "Karan Agarwal",
      "Pooja Malhotra",
      "Siddharth Roy",
      "Neha Bansal",
      "Aryan Kapoor",
      "Riya Saxena",
      "Abhishek Tiwari",
      "Meera Jain",
      "Harsh Pandey",
      "Divya Choudhary",
    ];

    const badges = [
      "🏆 Champion",
      "🔥 Streak Master",
      "⭐ Rising Star",
      "📚 Knowledge Seeker",
      "🎯 Perfectionist",
      "💎 Elite Learner",
    ];

    return names
      .map((name, index) => {
        const videosWatched = Math.floor(Math.random() * 45) + 5;
        const totalVideos = 50;
        const assessmentsCompleted = Math.floor(Math.random() * 18) + 2;
        const totalAssessments = 20;
        const watchTime = Math.floor(Math.random() * 120) + 10;
        const streak = Math.floor(Math.random() * 30) + 1;
        const level = Math.floor(Math.random() * 15) + 1;
        const xp = Math.floor(Math.random() * 800) + 200;
        const nextLevelXp = (level + 1) * 1000;

        const videoScore = (videosWatched / totalVideos) * 50;
        const assessmentScore = (assessmentsCompleted / totalAssessments) * 40;
        const engagementScore = Math.min(watchTime / 10, 10);
        const totalScore = Math.floor(
          videoScore + assessmentScore + engagementScore
        );

        return {
          id: index + 1,
          name,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(
            name
          )}&background=random&color=fff&size=120&bold=true`,
          totalScore,
          videosWatched,
          totalVideos,
          assessmentsCompleted,
          totalAssessments,
          watchTime,
          streak,
          lastActive: `${Math.floor(Math.random() * 24)} hours ago`,
          badge: index < 6 ? badges[index] : undefined,
          level,
          xp,
          nextLevelXp,
        };
      })
      .sort((a, b) => b.totalScore - a.totalScore);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const mockStudents = generateMockData();
      setStudents(mockStudents);
      setStats({
        totalStudents: mockStudents.length,
        avgCompletion: Math.floor(
          (mockStudents.reduce(
            (acc, s) => acc + s.videosWatched / s.totalVideos,
            0
          ) /
            mockStudents.length) *
            100
        ),
        topPerformer: mockStudents[0]?.name || "",
        weeklyGrowth: Math.floor(Math.random() * 15) + 5,
      });
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCountdown((prev) => (prev > 0 ? prev - 1 : 7));
    }, 86400000);
    return () => clearInterval(interval);
  }, []);

  const getSortedStudents = () => {
    if (!students.length) return [];

    switch (filterType) {
      case "videos":
        return [...students].sort(
          (a, b) =>
            b.videosWatched / b.totalVideos - a.videosWatched / a.totalVideos
        );
      case "assessments":
        return [...students].sort(
          (a, b) =>
            b.assessmentsCompleted / b.totalAssessments -
            a.assessmentsCompleted / a.totalAssessments
        );
      default:
        return students;
    }
  };

  const getRankDisplay = (rank: number) => {
    switch (rank) {
      case 1:
        return {
          icon: "👑",
          color: "text-yellow-400",
          bg: "bg-gradient-to-r from-yellow-400/20 to-orange-400/20 border-yellow-400/30",
        };
      case 2:
        return {
          icon: "🥈",
          color: "text-gray-300",
          bg: "bg-gradient-to-r from-gray-300/20 to-gray-400/20 border-gray-300/30",
        };
      case 3:
        return {
          icon: "🥉",
          color: "text-amber-600",
          bg: "bg-gradient-to-r from-amber-600/20 to-amber-700/20 border-amber-600/30",
        };
      default:
        return {
          icon: rank.toString(),
          color: "text-cyan-300",
          bg: "bg-cyan-900/30 border-cyan-700/30",
        };
    }
  };

  const getProgressGradient = (percentage: number) => {
    if (percentage >= 90)
      return "bg-gradient-to-r from-emerald-400 to-emerald-600";
    if (percentage >= 75) return "bg-gradient-to-r from-green-400 to-green-600";
    if (percentage >= 60)
      return "bg-gradient-to-r from-yellow-400 to-yellow-600";
    if (percentage >= 40)
      return "bg-gradient-to-r from-orange-400 to-orange-600";
    return "bg-gradient-to-r from-red-400 to-red-600";
  };

  const getLevelColor = (level: number) => {
    if (level >= 12) return "text-purple-400 bg-purple-900/30";
    if (level >= 8) return "text-blue-400 bg-blue-900/30";
    if (level >= 5) return "text-green-400 bg-green-900/30";
    return "text-gray-400 bg-gray-900/30";
  };

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Floating Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative bg-gradient-to-r from-cyan-900/80 to-slate-800/80 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-cyan-700/30 shadow-2xl"
        >
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-2xl blur-xl"></div>

          <div className="relative flex flex-col lg:flex-row justify-between items-center">
            <div className="text-center lg:text-left">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="flex items-center justify-center lg:justify-start gap-3 mb-3"
              >
                <div className="text-4xl">🏆</div>
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
                  Learning Leaderboard
                </h1>
              </motion.div>
              <p className="text-cyan-200/80 text-lg">
                Track your progress and compete with your peers
              </p>
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-6 lg:mt-0"
            >
              <div className="bg-gradient-to-r from-cyan-800/50 to-blue-800/50 backdrop-blur-sm rounded-xl px-6 py-4 border border-cyan-600/30">
                <div className="flex items-center gap-3 text-cyan-100">
                  <div className="text-2xl">⏰</div>
                  <div>
                    <div className="text-sm text-cyan-300">Next Refresh</div>
                    <div className="text-2xl font-bold text-white">
                      {refreshCountdown} days
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Stats Grid */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              {
                icon: "👥",
                label: "Total Students",
                value: stats.totalStudents,
                color: "from-blue-500 to-cyan-500",
              },
              {
                icon: "📊",
                label: "Avg Completion",
                value: `${stats.avgCompletion}%`,
                color: "from-green-500 to-emerald-500",
              },
              {
                icon: "🏅",
                label: "Top Performer",
                value: stats.topPerformer,
                color: "from-yellow-500 to-orange-500",
              },
              {
                icon: "📈",
                label: "Weekly Growth",
                value: `+${stats.weeklyGrowth}%`,
                color: "from-purple-500 to-pink-500",
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative group"
              >
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/30 h-full">
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${stat.color} opacity-10 rounded-xl group-hover:opacity-20 transition-opacity`}
                  ></div>
                  <div className="relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="text-3xl">{stat.icon}</div>
                      <div className="text-slate-400 text-sm font-medium">
                        {stat.label}
                      </div>
                    </div>
                    <div className="text-white text-2xl font-bold truncate">
                      {stat.value}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Enhanced Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap gap-3 mb-8"
        >
          {[
            {
              key: "overall",
              label: "Overall Score",
              icon: "🏆",
              gradient: "from-yellow-500 to-orange-500",
            },
            {
              key: "videos",
              label: "Video Progress",
              icon: "📹",
              gradient: "from-blue-500 to-cyan-500",
            },
            {
              key: "assessments",
              label: "Assessments",
              icon: "📝",
              gradient: "from-green-500 to-emerald-500",
            },
          ].map((filter) => (
            <motion.button
              key={filter.key}
              onClick={() => setFilterType(filter.key as any)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                filterType === filter.key
                  ? "text-white shadow-2xl"
                  : "text-slate-300 hover:text-white bg-slate-800/30 hover:bg-slate-700/50"
              }`}
            >
              {filterType === filter.key && (
                <div
                  className={`absolute inset-0 bg-gradient-to-r ${filter.gradient} rounded-xl`}
                ></div>
              )}
              <div className="relative flex items-center gap-2">
                <span className="text-xl">{filter.icon}</span>
                {filter.label}
              </div>
            </motion.button>
          ))}
        </motion.div>

        {/* Premium Leaderboard Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4"
        >
          <AnimatePresence mode="popLayout">
            {getSortedStudents()
              .slice(0, 10)
              .map((student, index) => {
                const rank = index + 1;
                const rankDisplay = getRankDisplay(rank);
                const videoProgress =
                  (student.videosWatched / student.totalVideos) * 100;
                const assessmentProgress =
                  (student.assessmentsCompleted / student.totalAssessments) *
                  100;
                const xpProgress = (student.xp / student.nextLevelXp) * 100;

                return (
                  <motion.div
                    key={student.id}
                    layout
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 50, scale: 0.8 }}
                    transition={{
                      delay: index * 0.05,
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    onClick={() => setSelectedStudent(student)}
                    className={`relative group cursor-pointer ${
                      rank <= 3 ? rankDisplay.bg : "bg-slate-800/30"
                    } backdrop-blur-sm rounded-2xl p-6 border ${
                      rank <= 3
                        ? `border-2 ${rankDisplay.bg}`
                        : "border-slate-700/30"
                    } hover:border-cyan-500/50 transition-all duration-300`}
                  >
                    {/* Glow effect for top 3 */}
                    {rank <= 3 && (
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 to-purple-500/5 rounded-2xl blur-xl"></div>
                    )}

                    <div className="relative flex flex-col lg:flex-row items-start lg:items-center gap-6">
                      {/* Rank & Avatar */}
                      <div className="flex items-center gap-4">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold border-2 ${rankDisplay.bg} ${rankDisplay.color}`}
                        >
                          {rank <= 3 ? rankDisplay.icon : `#${rank}`}
                        </motion.div>

                        <div className="relative">
                          <motion.img
                            whileHover={{ scale: 1.1 }}
                            src={student.avatar}
                            alt={student.name}
                            className="w-16 h-16 rounded-2xl border-3 border-cyan-500/50 shadow-xl"
                          />
                          <div
                            className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-lg text-xs font-bold ${getLevelColor(
                              student.level
                            )}`}
                          >
                            L{student.level}
                          </div>
                        </div>
                      </div>

                      {/* Student Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {student.name}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              {student.badge && (
                                <span className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 px-3 py-1 rounded-full border border-purple-500/30">
                                  {student.badge}
                                </span>
                              )}
                              <span className="text-slate-400">
                                Last active: {student.lastActive}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-3xl font-bold bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
                              {student.totalScore}
                            </div>
                            <div className="text-sm text-slate-400">
                              Total Score
                            </div>
                          </div>
                        </div>

                        {/* Progress Bars */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
                          {/* Videos */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">📹 Videos</span>
                              <span className="text-white font-medium">
                                {student.videosWatched}/{student.totalVideos}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${videoProgress}%` }}
                                transition={{
                                  delay: 0.5 + index * 0.1,
                                  duration: 1,
                                  ease: "easeOut",
                                }}
                                className={`h-full ${getProgressGradient(
                                  videoProgress
                                )} shadow-lg`}
                              />
                            </div>
                          </div>

                          {/* Assessments */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">📝 Tests</span>
                              <span className="text-white font-medium">
                                {student.assessmentsCompleted}/
                                {student.totalAssessments}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${assessmentProgress}%` }}
                                transition={{
                                  delay: 0.7 + index * 0.1,
                                  duration: 1,
                                  ease: "easeOut",
                                }}
                                className={`h-full ${getProgressGradient(
                                  assessmentProgress
                                )} shadow-lg`}
                              />
                            </div>
                          </div>

                          {/* XP Progress */}
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span className="text-slate-300">⚡ XP</span>
                              <span className="text-white font-medium">
                                {student.xp}/{student.nextLevelXp}
                              </span>
                            </div>
                            <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                transition={{
                                  delay: 0.9 + index * 0.1,
                                  duration: 1,
                                  ease: "easeOut",
                                }}
                                className="h-full bg-gradient-to-r from-purple-400 to-pink-400 shadow-lg"
                              />
                            </div>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="flex flex-wrap items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-orange-400">🔥</span>
                              <span className="text-white font-medium">
                                {student.streak} day streak
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-blue-400">⏱️</span>
                              <span className="text-white font-medium">
                                {student.watchTime}h watched
                              </span>
                            </div>
                          </div>

                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            className="text-cyan-400 hover:text-cyan-300 cursor-pointer"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
          </AnimatePresence>
        </motion.div>

        {/* Implementation Notes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gradient-to-r from-amber-900/20 to-orange-900/20 backdrop-blur-sm border border-amber-700/30 rounded-2xl p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="text-2xl">📋</div>
            <h3 className="text-amber-300 font-bold text-xl">
              Implementation Considerations
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-amber-100">
            <div>
              <h4 className="font-semibold mb-2 text-amber-200">
                Scoring System:
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Video completion: 50 points max</li>
                <li>• Assessment scores: 40 points max</li>
                <li>• Engagement bonus: 10 points max</li>
                <li>• Streak multipliers for consistency</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2 text-amber-200">
                Policy Decisions Needed:
              </h4>
              <ul className="space-y-1 text-sm">
                <li>• Retests: Allow or single attempt?</li>
                <li>• Video skipping: Minimum watch time?</li>
                <li>• Time decay: Weight recent activity?</li>
                <li>• Bonus points: Peer help, early completion?</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LeaderboardDashboard;
