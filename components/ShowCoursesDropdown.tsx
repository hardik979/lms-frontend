"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronDown,
  Book,
  ArrowRight,
  Clock,
  Users,
  Star,
} from "lucide-react";
import { Course } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";

export default function ShowCoursesDropdown() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getToken } = useAuth();
  const setCourseId = useSelectedCourseStore((s) => s.setCourseId);
  const router = useRouter();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        const res = await fetch("http://localhost:5000/api/users/courses", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        setCourses(data.courses || []);
        setHovered(data.courses?.[0]?._id || null);
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };

    fetchCourses();
  }, [getToken]);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  const handleCourseSelect = (courseId: string) => {
    setCourseId(courseId);
    setIsOpen(false);
    router.push("/student-dashboard/home");
  };

  const hoveredCourse = courses.find((c) => c._id === hovered);

  return (
    <div
      className="relative font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 text-white bg-gradient-to-r from-blue-500 to-cyan-500 px-4 py-2 rounded-md hover:from-blue-600 hover:to-cyan-600 transition-all duration-200 shadow-lg">
        Courses
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && hoveredCourse && (
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white rounded-xl shadow-2xl border border-slate-700 p-0 flex z-50 min-w-[800px] max-w-[900px] transition-all duration-300 overflow-hidden">
          {/* Left: Course List */}
          <div className="w-2/5 bg-slate-900 border-r border-slate-700">
            <div className="p-4 border-b border-slate-700 bg-slate-800">
              <h3 className="font-semibold text-cyan-300 text-sm uppercase tracking-wide">
                Available Courses
              </h3>
            </div>
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {courses.map((course, index) => (
                <button
                  key={course._id}
                  onMouseEnter={() => setHovered(course._id)}
                  onClick={() => handleCourseSelect(course._id)}
                  className={`flex w-full text-left items-center gap-3 px-4 py-3 cursor-pointer rounded-lg font-medium transition-all duration-200 ${
                    hovered === course._id
                      ? "bg-cyan-600 text-white shadow-md"
                      : "hover:bg-slate-700 hover:shadow-sm text-slate-300"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${
                      hovered === course._id ? "bg-cyan-500" : "bg-slate-700"
                    }`}
                  >
                    <Book
                      size={16}
                      className={
                        hovered === course._id ? "text-white" : "text-cyan-400"
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm truncate">
                      {course.title}
                    </div>
                    <div
                      className={`text-xs mt-1 ${
                        hovered === course._id
                          ? "text-cyan-100"
                          : "text-slate-500"
                      }`}
                    >
                      Course {index + 1}
                    </div>
                  </div>
                  {hovered === course._id && (
                    <ArrowRight size={16} className="text-cyan-200" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Course Preview */}
          <div className="w-3/5 bg-slate-800">
            <div
              className="relative overflow-hidden rounded-none h-full bg-gradient-to-br from-cyan-950 via-slate-800 to-slate-900 cursor-pointer hover:from-cyan-900 hover:via-slate-700 hover:to-slate-800 transition-all duration-300 group"
              style={{
                backgroundImage: `
                  radial-gradient(circle at 20% 20%, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
                  radial-gradient(circle at 80% 80%, rgba(6, 182, 212, 0.05) 1px, transparent 1px)
                `,
                backgroundSize: "30px 30px, 50px 50px",
              }}
              onClick={() => handleCourseSelect(hoveredCourse._id)}
            >
              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-950/50 to-transparent"></div>

              {/* Content */}
              <div className="relative z-20 h-full flex flex-col justify-between p-6 text-white min-h-[320px]">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-cyan-500 rounded-lg flex items-center justify-center">
                      <Book size={16} className="text-white" />
                    </div>
                    <span className="text-cyan-300 text-sm font-medium">
                      Featured Course
                    </span>
                  </div>

                  <h4 className="text-2xl font-bold mb-3 text-white group-hover:text-cyan-100 transition-colors">
                    {hoveredCourse.title}
                  </h4>

                  <p className="text-slate-300 text-sm leading-relaxed mb-6 line-clamp-3">
                    {hoveredCourse.description}
                  </p>

                  {/* Course Stats */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-cyan-400" />
                      <span className="text-xs text-slate-300">12 weeks</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users size={14} className="text-cyan-400" />
                      <span className="text-xs text-slate-300">
                        300+ students
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={14} className="text-cyan-400" />
                      <span className="text-xs text-slate-300">4.8 rating</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-lg text-sm font-semibold shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105 flex items-center gap-2">
                    Explore Course
                    <ArrowRight size={16} />
                  </button>

                  <div className="text-right">
                    <div className="text-cyan-400 text-xs">Limited Seats</div>
                    <div className="text-white text-sm font-semibold">
                      Enroll Soon
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-cyan-400/10 rounded-full blur-lg"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
