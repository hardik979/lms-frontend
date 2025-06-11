"use client";

import Link from "next/link";
import { GraduationCap, BarChartIcon, ChevronDown } from "lucide-react";
import { useState, useRef } from "react";

const sections = {
  "Data Analytics": {
    title: "Data Analytics",
    href: "/data_analytics",
    desc: "Learn SQL, Python, Excel, Tableau, and real-world business problem solving.",
    icon: <BarChartIcon size={18} className="text-cyan-700" />,
    tagline: " For college students, graduates & working professionals",
    points: [
      "• Industry-Endorsed Curriculum",
      "• Hands-on Projects",
      "• 100% Job Support",
      "• Real Interview Preparation",
    ],
  },

  "Internship & Placement Program": {
    title: "Internship & Placement Program",
    href: "/Internship",
    desc: "Work on real projects, build a strong GitHub, and get placement support.",
    icon: <GraduationCap size={18} className="text-cyan-700" />,
    tagline: " For final-year students & recent graduates seeking placements",
    points: [
      "• Real Projects",
      "• GitHub Portfolio",
      "• Mock Interviews",
      "• Unlimited Interview Access",
    ],
  },
};

export default function CoursesDropdown() {
  const [hovered, setHovered] =
    useState<keyof typeof sections>("Data Analytics");
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

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

      {isOpen && (
        <div className="absolute top-12 left-0 bg-white text-black rounded-md shadow-xl p-4 flex z-50 min-w-[740px] transition-all duration-300">
          {/* Left: Course List */}
          <div className="w-1/3 pr-4 border-r space-y-2">
            {Object.entries(sections).map(([key, val]) => (
              <Link
                href={val.href}
                key={key}
                onMouseEnter={() => setHovered(key as keyof typeof sections)}
                className={`flex items-center gap-2 px-3 py-2 cursor-pointer rounded-md font-medium transition-all duration-200 ${
                  hovered === key
                    ? "bg-cyan-100 text-cyan-800"
                    : "hover:bg-cyan-100 hover:text-cyan-800"
                }`}
              >
                {val.icon}
                {key}
              </Link>
            ))}
          </div>

          {/* Right: Course Preview */}
          <a
            href={sections[hovered].href}
            target="_blank"
            rel="noopener noreferrer"
            className="w-2/3 pl-4 flex flex-col no-underline"
          >
            <div className="relative overflow-hidden font-sans rounded-md min-h-[260px] bg-cyan-950 cursor-pointer hover:ring-2 hover:ring-cyan-300 transition-all">
              <div
                className="relative z-20 h-full flex flex-col justify-between p-4 text-white"
                style={{
                  backgroundImage: `
          linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px)
        `,
                  backgroundSize: "40px 40px",
                }}
              >
                <div>
                  <button
                    className="text-[14px] bg-gradient-to-r from-white via-gray-100 to-white
 px-2 py-1 rounded-md text-black font-semibold mb-3 "
                  >
                    {sections[hovered].tagline}
                  </button>
                  <h4 className="text-xl hover:text-cyan-300 font-bold mb-1">
                    {sections[hovered].title}
                  </h4>
                  <p className="text-sm font-semibold mb-2">
                    {sections[hovered].desc}
                  </p>

                  <div className="grid grid-cols-2 gap-x-5 pt-5 hover:text-cyan-300 gap-y-2 text-sm font-semibold text-white/90">
                    {sections[hovered].points.map((point, i) => (
                      <div key={i}>{point}</div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 flex gap-14 flex-wrap">
                  <button className="bg-cyan-600 text-white  hover:bg-cyan-700 px-6 py-2 rounded-md text-sm font-bold shadow">
                    Explore Program
                  </button>
                  <button className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-md text-sm font-bold text-white shadow">
                    100% Job Assistance
                  </button>
                </div>
              </div>
            </div>
          </a>
        </div>
      )}
    </div>
  );
}
