"use client";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { toast } from "react-toastify";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

type Course = {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
};

export default function ManageCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/api/users/courses", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data.courses);
      } catch (err) {
        toast.error("Failed to fetch courses.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut",
      },
    },
  };

  const bannerVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl  p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div
          className="text-center mb-8"
          variants={headerVariants}
          initial="hidden"
          animate="visible"
        >
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent">
            Manage Courses
          </h1>
          <p className="text-cyan-200 text-lg">
            Organize and edit your educational content
          </p>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 backdrop-blur-sm border border-amber-400/30 rounded-2xl p-6 mb-8 shadow-xl"
          variants={bannerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg
                className="w-6 h-6 text-amber-300"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-amber-300 font-semibold text-lg mb-1">
                Important Notice
              </h3>
              <p className="text-amber-200">
                All teachers can view and edit all courses. Please ensure you're
                editing only your intended content.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Courses Grid */}
        {loading ? (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="bg-cyan-900/50 backdrop-blur-sm rounded-2xl p-6 border border-cyan-800/50"
                variants={itemVariants}
              >
                <Skeleton className="h-6 w-3/4 mb-4 bg-cyan-800/50" />
                <Skeleton className="h-4 w-full mb-2 bg-cyan-800/50" />
                <Skeleton className="h-4 w-2/3 mb-6 bg-cyan-800/50" />
                <Skeleton className="h-10 w-28 bg-cyan-800/50" />
              </motion.div>
            ))}
          </motion.div>
        ) : courses.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-cyan-900/30 backdrop-blur-sm rounded-3xl p-12 border border-cyan-800/50 max-w-md mx-auto">
              <motion.svg
                className="w-16 h-16 text-cyan-400 mx-auto mb-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </motion.svg>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Courses Found
              </h3>
              <p className="text-cyan-300">
                Start by creating your first course!
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {courses.map((course, index) => (
              <motion.div
                key={course._id}
                className="group bg-gradient-to-br from-cyan-900/60 to-blue-900/40 backdrop-blur-sm rounded-2xl p-6 border border-cyan-800/50 shadow-xl"
                variants={itemVariants}
                whileHover={{
                  scale: 1.05,
                  borderColor: "rgba(34, 211, 238, 0.5)",
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                }}
                whileTap={{ scale: 0.98 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                {/* Course Icon */}
                <motion.div
                  className="bg-gradient-to-br from-cyan-500 to-blue-500 w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-lg"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </motion.div>

                {/* Course Content */}
                <div className="flex-1">
                  <motion.h2
                    className="font-bold text-xl text-white mb-3 line-clamp-2"
                    whileHover={{ color: "#67e8f9" }}
                    transition={{ duration: 0.3 }}
                  >
                    {course.title}
                  </motion.h2>
                  <p className="text-cyan-200 text-sm line-clamp-3 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                </div>

                {/* Edit Button */}
                <Link href={`/teacher-dashboard/manageCourse/${course._id}`}>
                  <motion.div
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white px-4 py-2.5 rounded-xl font-medium shadow-md w-full justify-center"
                    whileHover={{
                      backgroundImage:
                        "linear-gradient(to right, #0891b2, #2563eb)",
                      y: -2,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                    <motion.svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      whileHover={{ rotate: 15 }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </motion.svg>
                    <span>Edit Course</span>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Custom CSS for line clamping */}
      <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
