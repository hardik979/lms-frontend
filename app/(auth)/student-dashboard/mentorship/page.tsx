"use client";

import {
  IconMessage,
  IconChartBar,
  IconUserCircle,
  IconIdBadge2,
} from "@tabler/icons-react";
import ComparisonChart from "@/components/ComparisonChart";

const mentorshipData = [
  {
    icon: <IconMessage size={20} />,
    title: "Technical concepts",
    description: "Brush up your concepts and clear all technical doubts",
    bg: "bg-rose-900 text-rose-200",
  },
  {
    icon: <IconChartBar size={20} />,
    title: "Career guidance",
    description:
      "Complete career guidance from deciding career goal to achieving it",
    bg: "bg-emerald-900 text-emerald-200",
  },
  {
    icon: <IconUserCircle size={20} />,
    title: "Mock interview",
    description: "Ace your job interviews with 1:1 interview prep",
    bg: "bg-purple-900 text-purple-200",
  },
  {
    icon: <IconIdBadge2 size={20} />,
    title: "Resume building",
    description:
      "10x your resume shortlisting chances with 1:1 resume building",
    bg: "bg-yellow-900 text-yellow-200",
  },
];

const stats = [
  { label: "Students Placed", value: "1000+" },
  { label: "Highest LPA", value: "15" },
  { label: "Average package", value: "8 LPA" },
];

export default function MentorshipPage() {
  return (
    <>
      {/* Mentorship Section */}
      <section
        className="bg-cyan-950 text-white rounded-xl py-16 px-4 sm:px-10"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-bold">
            Accelerate your career with our mentors
          </h2>
          <p className="mt-2 text-cyan-200 text-sm md:text-base">
            Book 1:1 mentorship sessions with verified IT Jobs Factory mentors
            to fast-track your career
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {mentorshipData.map((item, idx) => (
            <div
              key={idx}
              className="bg-cyan-900 border border-cyan-700 hover:shadow-lg transition p-6 rounded-xl flex flex-col items-center text-center"
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-4 ${item.bg}`}
              >
                {item.icon}
              </div>
              <h3 className="text-md font-semibold text-white mb-1">
                {item.title}
              </h3>
              <p className="text-sm text-cyan-300">{item.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="/book-mentorship"
            className="inline-block bg-cyan-600 hover:bg-cyan-700 text-white px-6 py-3 rounded-md text-sm font-semibold transition"
          >
            Book Mentorship
          </a>
        </div>
      </section>

      {/* Placement Program Section */}
      <section
        className="bg-cyan-950 text-white rounded-xl mt-6 py-16 px-6 sm:px-12"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "20px 20px",
        }}
      >
        <div className="max-w-7xl mx-auto">
          {/* Info Box */}
          <div className="bg-cyan-900 rounded-xl p-6 sm:p-10 shadow mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              IT Jobs Factory Career Track
            </h2>
            <p className="text-cyan-300 text-sm md:text-base">
              Join our intensive 12-week career program and secure a job in your
              dream tech role. We focus on hands-on skills, resume building, and
              confidence through mock interviews and mentorship.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center mb-16">
            {stats.map((item, i) => (
              <div
                key={i}
                className="bg-cyan-900 border border-cyan-700 rounded-xl p-6 shadow hover:shadow-lg transition"
              >
                <p className="text-3xl font-extrabold text-cyan-400 mb-1">
                  {item.value}
                </p>
                <p className="text-cyan-200 text-sm font-medium">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reuse existing comparison chart as-is */}
      <ComparisonChart />
    </>
  );
}
