"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  IconHome,
  IconBook,
  IconDeviceLaptop,
  IconTargetArrow,
  IconBriefcase,
  IconMessage,
  IconPuzzle,
  IconUpload,
} from "@tabler/icons-react";
import clsx from "clsx";
import { useState } from "react";
import { Projector } from "lucide-react";

// Define prop types
type SidebarProps = {
  isOpen: boolean;
  role: "student" | "teacher";
};

const studentLinks = [
  {
    label: "Home",
    icon: <IconHome size={20} />,
    href: "/student-dashboard/home",
  },
  {
    label: "Learn",
    icon: <IconBook size={20} />,
    href: "/student-dashboard/course?id=683047f0007b2b71a9a1f4da",
  },
  {
    label: "Classroom",
    icon: <IconDeviceLaptop size={20} />,
    href: "/student-dashboard/classroom",
  },
  {
    label: "Practice",
    icon: <IconTargetArrow size={20} />,
    href: "/student-dashboard/practise",
  },
  {
    label: "Projects",
    icon: <IconPuzzle size={20} />,
    href: "/student-dashboard/projects",
  },
  {
    label: "Mentorship",
    icon: <IconMessage size={20} />,
    href: "/student-dashboard/mentorship",
  },
  {
    label: "Jobs",
    icon: <IconBriefcase size={20} />,
    href: "/student-dashboard/Jobs",
  },
];

const teacherLinks = [
  {
    label: "Upload Course",
    icon: <IconTargetArrow size={20} />,
    href: "/teacher-dashboard/Courseupload",
  },
  {
    label: "Upload Practise Questions",
    icon: <IconBook size={20} />,
    href: "/teacher-dashboard/QuestionsUpload",
  },
  {
    label: "Upload Projects",
    icon: <Projector size={20} />,
    href: "/teacher-dashboard/ProjectsUpload",
  },
];

export default function Sidebar({ isOpen, role }: SidebarProps) {
  const pathname = usePathname();
  const [selectedCourse, setSelectedCourse] = useState("Masters in CS");

  const links = role === "teacher" ? teacherLinks : studentLinks;

  return (
    <aside
      className={clsx(
        "bg-cyan-950 h-full w-64 border-r border-cyan-800 fixed top-0 left-0 z-40 shadow-sm transform transition-transform duration-300 md:translate-x-0",
        { "-translate-x-full": !isOpen }
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 px-6 py-4 border-b border-cyan-800"
      >
        <img src="/logo.png" alt="Logo" className="w-7 h-7" />
        <span className="text-xl font-bold text-white">IT Jobs Factory</span>
      </Link>

      {/* Mobile Course Dropdown for Students */}
      {role === "student" && (
        <div className="md:hidden px-4 pt-2">
          <label className="text-sm font-medium text-cyan-300">Course</label>
          <select
            className="mt-1 w-full rounded-md border border-cyan-700 bg-cyan-900 text-cyan-100 px-3 py-1 shadow-sm"
            value={selectedCourse}
            onChange={(e) => setSelectedCourse(e.target.value)}
          >
            <option>Masters in CS</option>
            <option>Full Stack Developer</option>
            <option>Data Analytics</option>
          </select>
        </div>
      )}

      {/* Sidebar Navigation */}
      <nav className="flex flex-col gap-1 px-2 mt-2">
        {links.map(({ label, href, icon }) => (
          <Link
            key={label}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-4 py-2 rounded transition-all",
              pathname === href
                ? "bg-cyan-600 font-semibold text-white"
                : "text-cyan-200 hover:bg-cyan-800"
            )}
          >
            {icon}
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
