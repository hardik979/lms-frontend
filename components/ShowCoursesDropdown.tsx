"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Book } from "lucide-react";
import { Course } from "@/types";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore"; // ✅ Import store

export default function ShowCoursesDropdown() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [hovered, setHovered] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { getToken } = useAuth();
  const setCourseId = useSelectedCourseStore((s) => s.setCourseId); // ✅ Get setter
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
    setCourseId(courseId); // ✅ Set global course ID
    setIsOpen(false); // ✅ Close dropdown
    router.push("/student-dashboard/home"); // ✅ Redirect to home to load selected course
  };

  const hoveredCourse = courses.find((c) => c._id === hovered);

  return (
    <div
      className="relative font-sans"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 text-white bg-cyan-600 px-4 py-2 rounded-md hover:bg-cyan-700 transition-colors">
        Courses
        <ChevronDown
          size={18}
          className={`transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {isOpen && hoveredCourse && (
        <div className="absolute top-12 left-0 bg-white text-black rounded-md shadow-xl p-4 flex z-50 min-w-[740px] transition-all duration-300">
          {/* Left: Course List */}
          <div className="w-1/3 pr-4 border-r space-y-2">
            {courses.map((course) => (
              <button
                key={course._id}
                onMouseEnter={() => setHovered(course._id)}
                onClick={() => handleCourseSelect(course._id)} // ✅ trigger select
                className={`flex w-full text-left items-center gap-2 px-3 py-2 cursor-pointer rounded-md font-medium transition-all duration-200 ${
                  hovered === course._id
                    ? "bg-cyan-100 text-cyan-800"
                    : "hover:bg-cyan-100 hover:text-cyan-800"
                }`}
              >
                <Book size={18} />
                {course.title}
              </button>
            ))}
          </div>

          {/* Right: Course Preview */}
          <div className="w-2/3 pl-4 flex flex-col">
            <div
              className="relative overflow-hidden font-sans rounded-md min-h-[260px] bg-cyan-950 cursor-pointer hover:ring-2 hover:ring-cyan-300 transition-all"
              style={{
                backgroundImage: `
                linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
              `,
                backgroundSize: "40px 40px",
              }}
              onClick={() => handleCourseSelect(hoveredCourse._id)} // ✅ trigger select
            >
              <div className="relative z-20 h-full flex flex-col justify-between p-4 text-white">
                <div>
                  <h4 className="text-xl hover:text-cyan-300 font-bold mb-1">
                    {hoveredCourse.title}
                  </h4>
                  <p className="text-sm font-medium mb-6">
                    {hoveredCourse.description}
                  </p>
                </div>

                <div className="flex gap-6">
                  <button className="bg-cyan-600 text-white hover:bg-cyan-700 px-6 py-2 rounded-md text-sm font-bold shadow">
                    Explore Course
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
