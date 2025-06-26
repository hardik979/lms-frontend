"use client";

import { motion } from "framer-motion";
import PracticeProblemList from "@/components/ui/PractiseProblemList";
import { useSelectedCourseStore } from "@/store/useCourseStore";

export default function PracticePage() {
  const courseId = useSelectedCourseStore((s) => s.courseId);

  if (!courseId) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-cyan-950 flex items-center justify-center p-4 sm:p-8"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
            <svg
              className="w-8 h-8 text-cyan-300"
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
          </div>
          <h2 className="text-xl sm:text-2xl font-semibold text-white mb-2">
            No Course Selected
          </h2>
          <p className="text-cyan-200 text-sm sm:text-base">
            Please select a course to view practice problems
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen  bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 rounded-2xl p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-full mx-auto">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/10 p-6 shadow-lg"
        >
          <PracticeProblemList courseId={courseId} />
        </motion.div>
      </div>
    </motion.div>
  );
}
