"use client";
import { IconMenu2, IconBell } from "@tabler/icons-react";
import { useAuth, UserButton } from "@clerk/nextjs";
import ShowCoursesDropdown from "./ShowCoursesDropdown";
import Link from "next/link";
import { useRoleStore } from "@/store/useRoleStore";
import { Sparkles } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { API_BASE_URL } from "@/lib/api";
import Image from "next/image";

// Types
interface Course {
  _id: string;
  title: string;
  description?: string;
  instructor?: string;
  category?: string;
}

export default function DashNav({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const role = useRoleStore((state) => state.role);
  const { user } = useUser();
  const router = useRouter();
  const setCourseId = useSelectedCourseStore((s) => s.setCourseId);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const { getToken } = useAuth();
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch courses on component mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const token = await getToken();
        const response = await fetch(`${API_BASE_URL}/api/courses/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          const coursesData = await response.json();
          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses([]);
      setSelectedIndex(-1);
      return;
    }

    const filtered = courses
      .filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.instructor
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .slice(0, 8); // Limit to 8 results

    setFilteredCourses(filtered);
    setSelectedIndex(-1);
  }, [searchQuery, courses]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchFocused(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isSearchFocused || filteredCourses.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < filteredCourses.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredCourses.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < filteredCourses.length) {
          handleCourseSelect(filteredCourses[selectedIndex]);
        }
        break;
      case "Escape":
        setIsSearchFocused(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
    }
  };

  // Handle course selection
  const handleCourseSelect = (course: Course) => {
    setSearchQuery(course.title);
    setIsSearchFocused(false);
    setSelectedIndex(-1);
    // Use the same course selection logic as ShowCoursesDropdown
    setCourseId(course._id);
    router.push("/student-dashboard/home");
  };

  // Clear search

  return (
    <header className="h-16 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-xl fixed top-0 left-0 right-0 z-50 backdrop-blur-xl">
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Mobile Layout */}
        <div className="flex md:hidden w-full items-center justify-between relative">
          {/* Enhanced Hamburger Menu */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:text-white hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 group"
          >
            <IconMenu2
              size={20}
              className="group-hover:scale-110 transition-transform duration-200"
            />
          </button>

          {/* Center Logo with Enhanced Styling */}
          <Link
            href={"/"}
            className="absolute left-1/2 transform -translate-x-1/2 group"
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 relative rounded-md overflow-hidden shadow-lg">
                <Image
                  src={"/logo.png"}
                  alt="Company Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-sm font-bold [font-family:var(--font-righteous)] ">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  IT
                </span>{" "}
                <span className="text-sky-400">Jobs Factory</span>
              </span>
            </div>
          </Link>

          {/* Enhanced Profile Section */}
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 transition-all duration-200 relative">
              <IconBell size={18} />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse"></span>
            </button>
            <div className="scale-90">
              <UserButton />
            </div>
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden md:flex items-center w-full justify-between">
          {/* Left: Enhanced Logo and Role Indicator */}
          <div className="flex items-center gap-6">
            <Link href={"/"} className="group flex items-center gap-3">
              <div className="w-8 h-8 relative rounded-sm overflow-hidden shadow-lg group-hover:scale-105 transition-all duration-200">
                <Image
                  src={"/logo.png"}
                  alt="Company Logo"
                  fill
                  className="object-cover"
                />
              </div>

              <span className="text-xl font-bold text-cyan-400 [font-family:var(--font-righteous)]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  IT
                </span>{" "}
                Jobs Factory
              </span>
            </Link>
          </div>

          {/* Center: Enhanced Search Bar and Courses Dropdown */}
          <div className="flex-1 flex justify-center items-center max-w-2xl mx-8">
            {/* Courses Dropdown for students only */}
            {role === "student" && (
              <div className="shrink-0">
                <ShowCoursesDropdown />
              </div>
            )}
          </div>

          {/* Right: Enhanced Action Items */}
          <div className="flex items-center gap-3">
            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              {/* Notifications */}
              <button className="relative p-2.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-slate-400 hover:text-white hover:bg-slate-700/50 hover:border-slate-600 transition-all duration-200 group">
                <IconBell size={18} className="group-hover:animate-pulse" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full animate-pulse shadow-lg"></span>
              </button>

              {/* Quick Access Menu */}
              <div className="w-px h-6 bg-slate-600/50 mx-1"></div>
            </div>

            {/* Enhanced User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden lg:block">
                <p className="text-sm font-medium text-slate-200">
                  Welcome back!
                </p>
                <p className="text-xs text-slate-400">{user?.fullName}</p>
              </div>
              <div className="p-1 rounded-xl bg-slate-800/50 border border-slate-700/50">
                <UserButton />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Subtle bottom glow effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"></div>
    </header>
  );
}
