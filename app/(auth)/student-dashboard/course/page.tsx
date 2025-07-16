"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import LoadingPage from "@/components/Loader";
import { BookOpen, Lock, Play, Clock, Star, ChevronRight } from "lucide-react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import Link from "next/link";
import { API_BASE_URL } from "@/lib/api";

export default function CourseClientPage() {
  const courseId = useSelectedCourseStore((s) => s.courseId);

  const { getToken } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [videoProgress, setVideoProgress] = useState<Record<string, number>>(
    {}
  );
  const [testProgress, setTestProgress] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState("free");
  const [purchasedCourses, setPurchasedCourses] = useState<string[]>([]);
  const [expandedChapters, setExpandedChapters] = useState<
    Record<number, boolean>
  >({});

  // Auto-expand first chapter by default
  useEffect(() => {
    if (course && course.chapters.length > 0) {
      setExpandedChapters((prev) => ({ ...prev, 0: true }));
    }
  }, [course]);

  const toggleChapter = (chapterIndex: number) => {
    setExpandedChapters((prev) => ({
      ...prev,
      [chapterIndex]: !prev[chapterIndex],
    }));
  };

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        // Get course
        const courseRes = await fetch(
          `${API_BASE_URL}/api/courses/${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courseData = await courseRes.json();
        setCourse(courseData.course);

        // Get user info
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();
        setSubscription(userData.subscription);
        setPurchasedCourses(userData.purchasedCourses || []);

        // Get video progress
        const progressRes = await fetch(
          `${API_BASE_URL}/api/progress/chapter-progress?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const progressData = await progressRes.json();

        const progressMap: Record<string, number> = {};
        progressData.completedVideos?.forEach((entry: any) => {
          progressMap[entry.videoId] = entry.progress || 0;
        });
        setVideoProgress(progressMap);

        // Get test progress
        const testProgressRes = await fetch(
          `${API_BASE_URL}/api/tests/course/${courseId}/progress`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const testProgressData = await testProgressRes.json();

        const testProgressMap: Record<string, any> = {};
        testProgressData.results?.forEach((result: any) => {
          testProgressMap[result.testId.chapterIndex] = result;
        });
        setTestProgress(testProgressMap);
      } catch (err) {
        console.error("❌ Failed to load course or progress", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [courseId, getToken]);

  if (loading) return <LoadingPage />;
  if (!course)
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-red-400 text-xl font-semibold"
        >
          Course not found
        </motion.div>
      </div>
    );

  const allVideos = course.chapters.flatMap((ch: any) => ch.videos);
  const totalVideos = allVideos.length;

  const totalWatchedPercent = allVideos.reduce((sum: number, video: any) => {
    return sum + (videoProgress[video.bunnyVideoId] || 0);
  }, 0);

  const overallProgress =
    totalVideos > 0 ? Math.round(totalWatchedPercent / totalVideos) : 0;
  const hasFullAccess =
    subscription === "subscribed" || purchasedCourses.includes(courseId!);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto py-8 px-4 md:px-8"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Course Overview */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="lg:col-span-2 bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 rounded-2xl p-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-2xl" />
              <div className="relative z-10">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2 mb-4"
                >
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="text-yellow-400 text-sm font-medium">
                    Premium Course
                  </span>
                </motion.div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                  {course.title}
                </h1>
                <div className="flex items-center gap-6 text-cyan-200 text-sm mb-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>3 months</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    <span>{course.chapters.length} chapters</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    <span>{totalVideos} videos</span>
                  </div>
                </div>
                <p className="text-cyan-100 text-lg leading-relaxed">
                  {course.description}
                </p>
              </div>
            </motion.div>

            {/* Progress Circle */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 rounded-2xl p-8 flex flex-col items-center justify-center relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-blue-600/10 rounded-2xl" />
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="w-32 h-32 mb-6"
                >
                  <CircularProgressbar
                    value={overallProgress}
                    text={`${overallProgress}%`}
                    styles={buildStyles({
                      textSize: "16px",
                      pathColor: "#22d3ee",
                      textColor: "#ffffff",
                      trailColor: "#1e293b",
                      strokeLinecap: "round",
                    })}
                  />
                </motion.div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  Overall Progress
                </h3>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Chapters Section */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
            <BookOpen className="w-7 h-7 text-cyan-400" />
            Course Chapters
          </h2>

          <AnimatePresence>
            {course.chapters.map((chapter: any, chapterIndex: number) => {
              const totalVideos = chapter.videos.length;
              const totalProgress = chapter.videos.reduce(
                (sum: number, v: any) => {
                  return sum + (videoProgress[v.bunnyVideoId] || 0);
                },
                0
              );
              const averageProgress =
                totalVideos > 0 ? Math.round(totalProgress / totalVideos) : 0;

              const chapterTestResult = testProgress[chapterIndex];
              const isExpanded = expandedChapters[chapterIndex];

              return (
                <motion.div
                  key={chapterIndex}
                  variants={itemVariants}
                  whileHover={{ scale: 1.005 }}
                  className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 rounded-2xl overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/5 to-blue-600/5 rounded-2xl" />
                  <div className="relative z-10">
                    {/* Chapter Header - Always Visible */}
                    <div className="p-6 border-b border-cyan-800/30">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex-1">
                          <motion.span
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: chapterIndex * 0.1 }}
                            className="inline-block bg-cyan-600/20 text-cyan-300 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2"
                          >
                            Chapter {chapterIndex + 1}
                          </motion.span>
                          <h3 className="text-xl font-semibold text-white">
                            {chapter.title}
                          </h3>
                        </div>

                        {/* Expand/Collapse Button */}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toggleChapter(chapterIndex)}
                          className="flex items-center gap-2 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 px-4 py-2 rounded-lg transition-colors"
                        >
                          <span className="text-sm font-medium">
                            {totalVideos}{" "}
                            {totalVideos === 1 ? "lecture" : "lectures"}
                          </span>
                          <motion.div
                            animate={{ rotate: isExpanded ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronRight className="w-4 h-4" />
                          </motion.div>
                        </motion.button>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-cyan-200 mb-2">
                          <span>Progress</span>
                          <span className="font-semibold">
                            {averageProgress}% completed
                          </span>
                        </div>
                        <div className="h-2 bg-cyan-800/50 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${averageProgress}%` }}
                            transition={{
                              duration: 1,
                              delay: chapterIndex * 0.2,
                            }}
                            className="h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                          />
                        </div>
                      </div>

                      {/* Chapter Test Button */}
                      {hasFullAccess ? (
                        <Link href={`/test/${courseId}/${chapterIndex}`}>
                          <motion.div
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white p-3 rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                          >
                            <BookOpen className="w-4 h-4" />
                            <span className="font-medium text-sm">
                              {chapterTestResult ? (
                                <span className="flex items-center gap-2">
                                  Test Completed
                                  <span className="bg-white/20 px-2 py-1 rounded text-xs">
                                    {chapterTestResult.percentage}%
                                  </span>
                                </span>
                              ) : (
                                "Start Chapter Test"
                              )}
                            </span>
                          </motion.div>
                        </Link>
                      ) : (
                        <motion.div className="bg-cyan-900/50 border border-cyan-700/50 text-cyan-300 p-3 rounded-lg flex items-center justify-center gap-2 opacity-60">
                          <BookOpen className="w-4 h-4" />
                          <span className="font-medium text-sm">
                            Chapter Test
                          </span>
                          <Lock className="w-4 h-4" />
                        </motion.div>
                      )}
                    </div>

                    {/* Collapsible Videos List */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: "easeInOut" }}
                          className="overflow-hidden"
                        >
                          <div className="p-6 pt-0 space-y-2">
                            {chapter.videos.map(
                              (video: any, videoIndex: number) => {
                                const isFree =
                                  chapterIndex === 0 && videoIndex === 0;
                                const isUnlocked = isFree || hasFullAccess;
                                const watchedPercent =
                                  videoProgress[video.bunnyVideoId] || 0;

                                return (
                                  <motion.div
                                    key={videoIndex}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: videoIndex * 0.05 }}
                                    whileHover={{ x: 4, scale: 1.01 }}
                                    className={`p-3 rounded-lg flex justify-between items-center transition-all duration-200 ${
                                      isUnlocked
                                        ? "bg-white/5 hover:bg-white/10 border border-cyan-700/30"
                                        : "bg-cyan-900/20 opacity-50"
                                    }`}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="flex items-center gap-2">
                                        <span className="text-cyan-400 text-sm font-mono w-6">
                                          {videoIndex + 1}.
                                        </span>
                                        <div
                                          className={`w-2 h-2 rounded-full ${
                                            watchedPercent >= 90
                                              ? "bg-green-400"
                                              : watchedPercent > 0
                                              ? "bg-yellow-400"
                                              : "bg-gray-400"
                                          }`}
                                        />
                                      </div>
                                      <span
                                        className={`font-medium text-sm ${
                                          isUnlocked
                                            ? "text-white"
                                            : "text-cyan-300"
                                        }`}
                                      >
                                        {video.title}
                                      </span>
                                    </div>

                                    {isUnlocked ? (
                                      <motion.a
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.95 }}
                                        href={`/watch?video=${video.bunnyVideoId}&course=${course._id}&chapter=${chapterIndex}&index=${videoIndex}`}
                                        className="bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded-lg transition-colors flex items-center gap-1"
                                      >
                                        <Play className="w-3 h-3" />
                                      </motion.a>
                                    ) : (
                                      <Lock className="w-4 h-4 text-cyan-400" />
                                    )}
                                  </motion.div>
                                );
                              }
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
