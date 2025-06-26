"use client";

import { useState } from "react";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import Image from "next/image";
import CoursesDropdown from "./Dropdown2";
import { GraduationCap, PinIcon } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("certifications");

  const certifications = [
    {
      title: "Full Stack Web Development",
      subtitle: "6-month online program • IIT Certified",
      tag: "100% Job Assurance",
    },
    {
      title: "Data Science & AI",
      subtitle: "6-month online program • IIT Certified",
      tag: "100% Job Assurance",
    },
  ];

  const masters = [
    {
      title: "MS in CS: AI & Machine Learning",
      subtitle: "12-month degree • Live classes • WOOLF Accredited",
      tag: "WOOLF Degree",
    },
    {
      title: "MS in CS: Cloud Computing",
      subtitle: "12-month degree • Live classes • WOOLF Accredited",
      tag: "WOOLF Degree",
    },
  ];

  const currentCourses =
    activeTab === "certifications" ? certifications : masters;

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-black text-cyan-800 px-6 py-4 shadow-md">
        <div className="flex items-center  justify-between">
          {/* Logo + Dropdown */}
          <div className="flex items-center gap-4">
            <Link href="/">
              <div className="relative w-10 h-10">
                <Image
                  src="/logo.png" // ← Replace with your actual path
                  alt="Logo"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>
            <Link href="/">
              <span className="text-xl text-yellow-300 font-bold">
                IT{" "}
                <span className="text-white underline underline-offset-4">
                  JOBS FACTORY
                </span>
              </span>
            </Link>
            <CoursesDropdown />
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex gap-6 text-sm items-center">
            <Link href="/placements" className="hover:underline text-white">
              Placements
            </Link>

            <a href="/hire" className="hover:underline  text-white">
              Hire Talent
            </a>
            <a href="/about" className="hover:underline  text-white">
              Our Story
            </a>
            <Link href="/redirect">
              <Button className="bg-cyan-600 text-white px-4 py-2 rounded-md hover:bg-cyan-700">
                Sign-In
              </Button>
            </Link>
          </div>

          {/* Hamburger (Mobile) */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <IconX size={28} /> : <IconMenu2 size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden mt-4 space-y-3 text-sm">
            <Link
              href="/placements"
              className="block hover:underline text-white"
            >
              Placements
            </Link>
            <Link
              href="/masterClass"
              className="block hover:underline text-white"
            >
              Masterclass
            </Link>
            <a href="#" className="block hover:underline text-white">
              Practice
            </a>
            <a href="#" className="block hover:underline text-white">
              Hire From Us
            </a>
            <a href="#" className="block hover:underline text-white">
              About Us
            </a>
            <Link href="/student-dashboard">
              <Button className="w-full bg-cyan-600 text-white mt-2 hover:bg-cyan-700">
                Candidate Sign-In
              </Button>
            </Link>

            <Button className="w-full bg-cyan-600 text-white mt-2 hover:bg-cyan-700">
              Employe Sign-In
            </Button>
          </div>
        )}
      </nav>

      {/* Fixed Cyan Banner */}
      <motion.div
        className="fixed top-[64px] z-40 w-full bg-gradient-to-r from-cyan-600 to-sky-500 text-white px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 text-center sm:text-left shadow-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Left Text with Icon */}
        <span className="text-sm sm:text-base font-semibold tracking-wide uppercase flex items-center gap-2">
          <PinIcon size={16} className="text-white" />
          Launch your Career in Tech Industry
        </span>

        {/* Center Text */}
        <span className="text-sm sm:text-base font-semibold text-white tracking-wide">
          Next Cohort Starts{" "}
          <span className="underline underline-offset-2 font-bold">
            16th May, 2025
          </span>
        </span>

        {/* CTA Button */}
        <a
          href="https://wa.me/+919425645642?text=Hi%2C%20can%20you%20tell%20me%20more" // Replace with your number
          target="_blank"
          rel="noopener noreferrer"
        >
          <motion.button
            className="bg-white text-cyan-800 px-4 py-2 rounded-md text-sm font-semibold hover:bg-white/90 shadow-md"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          >
            Whatsapp Now
          </motion.button>
        </a>
      </motion.div>
    </>
  );
}
