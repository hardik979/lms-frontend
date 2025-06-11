"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function ScanAnimation() {
  return (
    <section className="bg-cyan-950 text-white px-6 py-12">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* PDF Icon with scanning effect */}
        <div className="relative w-[100px] h-[120px] mb-6">
          {/* PDF Image with bounce animation */}
          <motion.div
            className="absolute inset-0"
            animate={{ y: [6, -6, 6] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/pdimg.png"
              alt="Resume Scan"
              fill
              className="object-contain"
              priority
            />
          </motion.div>

          {/* Scanning Line */}
          <motion.div
            className="absolute left-0 w-full h-[8px] rounded bg-gradient-to-b from-blue-400/80 to-transparent z-10"
            animate={{ y: [0, 102, 0] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* Heading & CTA */}
        <h2 className="text-2xl md:text-3xl font-semibold">
          Get a <span className="text-cyan-400">Free Resume Audit</span> by Our
          Career Experts
        </h2>
        <p className="text-white/80 mt-2 max-w-xl">
          Find out what’s holding you back from landing top tech roles — our
          mentors will review and guide you personally.
        </p>

        <button className="mt-6 px-6 py-3 bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded transition">
          Book My Free Review
        </button>
      </div>
    </section>
  );
}
