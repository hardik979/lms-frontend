"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import CurriculumSection from "@/components/dataAnalyticCurriculum";
import { IconCircleCheckFilled } from "@tabler/icons-react";
import {
  CalendarCheck,
  Download,
  GraduationCap,
  Star,
  Clock,
  Users,
  Award,
  BookOpen,
  ArrowRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import LoadingPage from "@/components/Loader";
import { API_BASE_URL } from "@/lib/api";
import { useUser } from "@clerk/nextjs";
const Home = () => {
  const { getToken, isSignedIn } = useAuth();
  const { user } = useUser();
  // Use both courseId and setCourseId from Zustand store
  const selectedCourseId = useSelectedCourseStore((s) => s.courseId);
  const setCourseId = useSelectedCourseStore((s) => s.setCourseId);

  const [selectedCourse, setSelectedCourse] = useState<any>(null);
  const [hasPurchasedCourse, setHasPurchasedCourse] = useState<boolean | null>(
    null
  );

  // Set default course ID if none selected
  useEffect(() => {
    if (!selectedCourseId) {
      setCourseId("68678c7dd04068add6b440af"); // default fallback course
    }
  }, [selectedCourseId, setCourseId]);

  useEffect(() => {
    const fetchCourseAndUser = async () => {
      const token = await getToken();
      if (!token || !selectedCourseId) return;

      try {
        // Fetch course details
        const courseRes = await fetch(
          `${API_BASE_URL}/api/courses/${selectedCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const courseData = await courseRes.json();
        setSelectedCourse(courseData.course);

        // Fetch user info
        const userRes = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const userData = await userRes.json();

        if (userData.purchasedCourses?.includes(selectedCourseId)) {
          setHasPurchasedCourse(true);
        } else {
          setHasPurchasedCourse(false);
        }
      } catch (err) {
        console.error("❌ Error loading course or user data", err);
      }
    };

    if (isSignedIn && selectedCourseId) {
      fetchCourseAndUser();
    }
  }, [getToken, isSignedIn, selectedCourseId]);

  if (!selectedCourse) {
    return <LoadingPage />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const progressSteps = [
    { title: "Profile", subtitle: "Completion", width: "15%" },
    { title: "Application", subtitle: "Verification", width: "20%" },
    { title: "Reserve", subtitle: "a Seat", width: "20%" },
    { title: "Payment", subtitle: "Completion", width: "20%" },
    { title: "Onboarding", subtitle: "", width: "15%" },
  ];

  return (
    <div className="min-h-screen rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto py-8 px-4 md:px-8"
      >
        {/* Conditional Banner */}
        <AnimatePresence>
          {hasPurchasedCourse === false && (
            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 text-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-orange-600/10 to-red-600/10 rounded-2xl" />
              <div className="relative z-10">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                      {user?.fullName ? `Hii, ${user.fullName}` : "Hey"}{" "}
                      Complete your application for{" "}
                      <span className="text-cyan-400">
                        {selectedCourse.title}
                      </span>
                    </h2>
                    <p className="text-cyan-200">
                      You're just a few steps away from starting your journey!
                    </p>
                  </div>
                  <motion.span
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    className="mt-4 md:mt-0 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg"
                  >
                    📋 Register Now
                  </motion.span>
                </div>

                {/* Enhanced Progress Section */}
                <div className="bg-cyan-900/30 rounded-xl p-6 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-cyan-400 rounded-full animate-pulse" />
                    <span className="text-cyan-300 font-medium">
                      Application Progress
                    </span>
                  </div>

                  <div className="relative w-full h-2 bg-cyan-800/50 rounded-full mb-4 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "5%" }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                      className="absolute h-full bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full"
                    />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 text-xs text-cyan-200">
                    {progressSteps.map((step, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className="text-center break-words"
                      >
                        <div className="font-medium leading-snug">
                          {step.title}
                        </div>
                        {step.subtitle && (
                          <div className="opacity-75 text-[11px]">
                            {step.subtitle}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.section>
          )}

          {hasPurchasedCourse && (
            <motion.section
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 text-white rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-green-600/10 to-cyan-600/10 rounded-2xl" />
              <div className="relative z-10 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                  className="text-6xl mb-4"
                >
                  🎉
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">
                  {user?.fullName ? `Hii ${user.fullName}` : "Hey, Welcome"}
                </h2>
                <p className="text-green-100 text-lg mb-6">
                  You have already Enrolled in{" "}
                  <strong className="text-green-300">
                    {selectedCourse.title}
                  </strong>
                  .
                  <br />
                  Ready to start your learning journey?
                </p>
                <Link
                  href={`/student-dashboard/course?id=68678c7dd04068add6b440af`}
                >
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-green-600 to-cyan-600 hover:from-green-500 hover:to-cyan-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                  >
                    <BookOpen className="w-5 h-5" />
                    Go to Classroom
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Program Overview */}
        <motion.section
          variants={itemVariants}
          className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 rounded-2xl shadow-xl p-8 mb-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 rounded-2xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="w-12 h-12 bg-cyan-600/20 rounded-full flex items-center justify-center"
              >
                <GraduationCap className="w-6 h-6 text-cyan-400" />
              </motion.div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  {selectedCourse.title}
                </h2>
                <p className="text-cyan-300 font-medium">by IT Jobs Factory</p>
              </div>
            </div>

            {/* Course Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-cyan-900/30 rounded-xl p-4 backdrop-blur-sm border border-cyan-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-cyan-300 font-medium">
                    Modern Curriculum
                  </span>
                </div>
                <p className="text-cyan-100 text-sm">
                  Re-engineered for the post ChatGPT era
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-cyan-900/30 rounded-xl p-4 backdrop-blur-sm border border-cyan-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="text-cyan-300 font-medium">
                    Flexible Learning
                  </span>
                </div>
                <p className="text-cyan-100 text-sm">
                  3-month part-time program with live classes
                </p>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="bg-cyan-900/30 rounded-xl p-4 backdrop-blur-sm border border-cyan-700/50"
              >
                <div className="flex items-center gap-3 mb-3">
                  <Users className="w-5 h-5 text-blue-400" />
                  <span className="text-cyan-300 font-medium">
                    Beginner Friendly
                  </span>
                </div>
                <p className="text-cyan-100 text-sm">
                  No prior coding experience required
                </p>
              </motion.div>
            </div>

            {!hasPurchasedCourse && (
              <div className="text-center">
                <Link href="/MentorshipForm">
                  <motion.button
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold px-8 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                  >
                    Continue Application
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
              </div>
            )}

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2 text-cyan-400 mt-6 bg-cyan-900/20 rounded-lg p-3"
            >
              <CalendarCheck className="w-5 h-5" />
              <span className="font-medium">Next Cohort Starts Soon</span>
            </motion.div>
          </div>
        </motion.section>

        {/* Curriculum Component */}
        <motion.div variants={itemVariants}>
          <CurriculumSection />
        </motion.div>

        {/* Certificate Section */}
        <motion.section
          variants={itemVariants}
          className="bg-cyan-950/80 backdrop-blur-sm border border-cyan-800/50 rounded-2xl shadow-xl p-8 my-8 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl" />
          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                  className="w-12 h-12 bg-purple-600/20 rounded-full flex items-center justify-center"
                >
                  <Award className="w-6 h-6 text-purple-400" />
                </motion.div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Get a Verified Certificate
                </h2>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "Earn a certificate after successfully completing the course.",
                  "Perfect for LinkedIn, resumes, and job applications.",
                  "Demonstrates hands-on training and industry-ready skills.",
                ].map((text, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-start gap-3"
                  >
                    <div className="w-6 h-6 bg-green-600/20 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <IconCircleCheckFilled className="w-4 h-4 text-green-400" />
                    </div>
                    <p className="text-cyan-100">{text}</p>
                  </motion.div>
                ))}
              </div>

              <a href="/brochure" target="_blank" rel="noopener noreferrer">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold px-6 py-3 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  Download Brochure
                </motion.button>
              </a>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="flex-shrink-0 max-w-sm w-full"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur-xl" />
                <Image
                  src="/certificate.png"
                  alt="Course Completion Certificate"
                  width={500}
                  height={350}
                  className="relative rounded-2xl border border-cyan-700/50 shadow-2xl"
                />
              </div>
            </motion.div>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Home;
