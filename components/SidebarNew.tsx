"use client";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  IconHome,
  IconBook,
  IconDeviceLaptop,
  IconTargetArrow,
  IconBriefcase,
  IconMessage,
  IconPuzzle,
  IconChalkboardTeacher,
  IconX,
  IconChevronDown,
} from "@tabler/icons-react";
import { Projector, TrophyIcon } from "lucide-react";
import { useActiveCourseId } from "@/lib/hooks/useDefaultCourse";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
  role: "student" | "teacher";
};

export default function Sidebar({ isOpen, onClose, role }: SidebarProps) {
  const pathname = usePathname();
  const [selectedCourse, setSelectedCourse] = useState("Masters in CS");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [courses, setCourses] = useState<any[]>([]);
  const { getToken } = useAuth();
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const token = await getToken();
        const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setCourses(data.courses || []);
        setSelectedCourse(data.courses?.[0]?.title || ""); // optional: auto-select first course
      } catch (err) {
        console.error("Failed to load courses:", err);
      }
    };
    fetchCourses();
  }, [getToken]);

  const activeCourseId = useActiveCourseId();

  const studentLinks = [
    {
      label: "Home",
      icon: <IconHome size={20} />,
      href: "/student-dashboard/home",
      description: "Course overview",
    },
    {
      label: "Classroom",
      icon: <IconDeviceLaptop size={20} />,
      href: "/student-dashboard/classroom",
      description: "Live sessions",
    },
    {
      label: "Lectures",
      icon: <IconBook size={20} />,
      href: `/student-dashboard/course?id=${activeCourseId}`,
      description: "Self-Paced Videos",
    },

    {
      label: "Practice",
      icon: <IconTargetArrow size={20} />,
      href: "/student-dashboard/daily-quiz",
      description: "Quiz & Assignments",
    },
    {
      label: "Projects",
      icon: <IconPuzzle size={20} />,
      href: "/student-dashboard/projects",
      description: "Build portfolio",
    },
    {
      label: "Mentorship",
      icon: <IconMessage size={20} />,
      href: "/student-dashboard/mentorship",
      description: "Get guidance",
    },
  ];

  const teacherLinks = [
    {
      label: "Upload Daily Quiz ",
      icon: <IconTargetArrow size={20} />,
      href: "/teacher-dashboard/daily-quizUpload",
      description: "Create daily Quizes",
    },
    {
      label: "Upload Live Class Link ",
      icon: <IconTargetArrow size={20} />,
      href: "/teacher-dashboard/live-class-schedule",
      description: "Upload link of live class",
    },

    {
      label: "Upload Projects",
      icon: <Projector size={20} />,
      href: "/teacher-dashboard/ProjectsUpload",
      description: "Add project templates",
    },
    {
      label: "Manage Courses",
      icon: <IconChalkboardTeacher size={20} />,
      href: "/teacher-dashboard/manageCourse",
      description: "Edit and organize",
    },
  ];
  const links = role === "teacher" ? teacherLinks : studentLinks;
  return (
    <>
      {/* Enhanced backdrop with blur effect */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar wrapper with enhanced styling */}
      <aside
        className={clsx(
          "fixed top-0 left-0 h-screen w-72 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 z-50 border-r border-slate-700/50 shadow-2xl transition-all duration-300 ease-in-out",
          "md:translate-x-0 md:block backdrop-blur-xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "md:relative md:z-auto md:h-screen"
        )}
      >
        {/* Enhanced header */}
        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center shadow-lg group-hover:shadow-cyan-400/25 transition-shadow">
              <img src="/logo.png" alt="Logo" className="w-5 h-5" />
            </div>
            <span className="text-sky-400 font-bold text-lg tracking-tight">
              <span className="text-yellow-500">IT</span> Jobs Factory
            </span>
          </Link>

          {/* Enhanced close button */}
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white md:hidden p-2 rounded-lg hover:bg-slate-700/50 transition-all duration-200 group"
          >
            <IconX
              size={18}
              className="group-hover:rotate-90 transition-transform duration-200"
            />
          </button>
        </div>

        {/* Enhanced course selector for students - mobile only */}
        {role === "student" && (
          <div className="md:hidden px-6 py-4 border-b border-slate-700/30">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">
              Current Course
            </label>
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-slate-800 border border-slate-600 rounded-xl text-slate-200 hover:bg-slate-700 hover:border-slate-500 transition-all duration-200 group"
              >
                <span className="font-medium truncate">
                  {selectedCourse || "Select course"}
                </span>
                <IconChevronDown
                  size={16}
                  className={clsx(
                    "text-slate-400 transition-transform duration-200",
                    isDropdownOpen && "rotate-180"
                  )}
                />
              </button>

              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-xl z-10 overflow-hidden max-h-80 overflow-y-auto">
                  {courses.length > 0 ? (
                    courses.map((course) => (
                      <button
                        key={course._id}
                        onClick={() => {
                          setSelectedCourse(course.title);
                          setIsDropdownOpen(false);
                          // Optionally navigate or set active course ID here:
                          // setCourseId(course._id);
                          // router.push(`/student-dashboard/course?id=${course._id}`);
                        }}
                        className={clsx(
                          "w-full text-left px-4 py-3 hover:bg-slate-700 transition-colors duration-150",
                          course.title === selectedCourse
                            ? "text-cyan-300 bg-slate-700/50"
                            : "text-slate-300"
                        )}
                      >
                        {course.title}
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-slate-400 text-sm">
                      No courses found
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Enhanced navigation */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {links.map(({ label, href, icon, description }) => {
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  className={clsx(
                    "group flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg border border-cyan-500/30"
                      : "text-slate-300 hover:text-white hover:bg-slate-700/50 hover:translate-x-1"
                  )}
                  onClick={onClose}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500 rounded-r-full" />
                  )}

                  {/* Icon container */}
                  <div
                    className={clsx(
                      "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-br from-cyan-500 to-blue-500 text-white shadow-lg"
                        : "bg-slate-700/50 text-slate-400 group-hover:bg-slate-600 group-hover:text-slate-200"
                    )}
                  >
                    {icon}
                  </div>

                  {/* Label and description */}
                  <div className="flex-1 min-w-0">
                    <div
                      className={clsx(
                        "font-semibold text-sm transition-colors duration-200",
                        isActive
                          ? "text-white"
                          : "text-slate-200 group-hover:text-white"
                      )}
                    >
                      {label}
                    </div>
                    <div
                      className={clsx(
                        "text-xs transition-colors duration-200 mt-0.5",
                        isActive
                          ? "text-cyan-200"
                          : "text-slate-400 group-hover:text-slate-300"
                      )}
                    >
                      {description}
                    </div>
                  </div>

                  {/* Hover effect */}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Enhanced footer */}
        <div className="px-6 py-2 border-t border-slate-700/50 bg-slate-800/30">
          <div className="text-xs text-slate-400 text-center">
            <p className="font-medium">© IT Jobs Factory</p>
            <p className="mt-1">Empowering your tech career</p>
          </div>
        </div>
      </aside>
    </>
  );
}
