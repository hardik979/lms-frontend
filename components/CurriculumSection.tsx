"use client";

import { useState } from "react";

type CurriculumItem = {
  id: number;
  title: string;
  addon: string;
  duration: string;
  topics: string[];
};

const curriculum: CurriculumItem[] = [
  {
    id: 1,
    title: "Introduction to Computer Programming.",
    addon: "Pair Programming using GitHub AI CoPilot",
    duration: "1 month",
    topics: ["Variables", "Loops", "Functions", "Debugging", "Git Basics"],
  },
  {
    id: 2,
    title: "Design and Analysis of Algorithms",
    addon: "Coding mastery with ChatGPT",
    duration: "1.5 months",
    topics: [
      "Sorting Algorithms",
      "Searching",
      "Recursion",
      "Time Complexity",
      "Greedy vs DP",
    ],
  },
  {
    id: 3,
    title: "Front-end Development",
    addon: "Creating Intelligent Frontend Solutions with AI Technologies",
    duration: "2 months",
    topics: [
      "HTML",
      "CSS",
      "Bootstrap",
      "DOM",
      "jQuery Basics & AJAX",
      "Advanced Asynchronous coding in JavaScript",
      "Introduction to Tailwind CSS",
      "Advanced Layout Techniques with Tailwind CSS",
      "Introduction to React Ecosystem",
    ],
  },
  {
    id: 4,
    title: "Backend Development",
    addon: "Developing applications with LangChain.js",
    duration: "2 months",
    topics: [
      "Node.js",
      "Express",
      "MongoDB",
      "REST APIs",
      "Authentication",
      "LangChain integration",
    ],
  },
  {
    id: 5,
    title:
      "Practical Software Engineering and Cloud Computing with Microsoft Azure",
    addon: "Automate CI/CD processes using ChatGPT",
    duration: "1.5 months",
    topics: [
      "Azure Basics",
      "CI/CD",
      "GitHub Actions",
      "Docker",
      "Deployment Strategies",
    ],
  },
];

export default function CurriculumSection() {
  const [selected, setSelected] = useState<number>(3);
  const active = curriculum.find((item) => item.id === selected);

  return (
    <section className="bg-cyan-50 text-cyan-900 py-20 px-6">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-2">
          Curriculum and{" "}
          <span className="text-sky-500 underline underline-offset-4">
            Learning Track
          </span>
        </h2>
        <p className="text-cyan-700 max-w-3xl mx-auto">
          We have designed our curriculum and learning pedagogy based on what
          top tech companies expect when you join them after you graduate. The
          curriculum focuses on learning by doing, solving real-world problems,
          and working on industry-level projects.
        </p>
      </div>

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Left: Modules List */}
        <div className="space-y-4">
          {curriculum.map((item) => {
            const isActive = selected === item.id;
            return (
              <div
                key={item.id}
                onClick={() => setSelected(item.id)}
                className={`cursor-pointer border p-4 rounded-md transition-all ${
                  isActive
                    ? "bg-white text-cyan-900 border-cyan-600 shadow"
                    : "border-cyan-300 hover:border-cyan-400"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`font-bold text-lg ${
                      isActive ? "text-cyan-700" : "text-cyan-500"
                    }`}
                  >
                    0{item.id}
                  </div>
                  <div>
                    <h3
                      className={`font-semibold ${
                        isActive ? "text-cyan-900" : "text-cyan-800"
                      }`}
                    >
                      {item.title}
                    </h3>
                    <p
                      className={`text-sm ${
                        isActive ? "text-cyan-700" : "text-cyan-600"
                      }`}
                    >
                      Add-On: {item.addon}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Topics Display */}
        {active && (
          <div className="bg-white border border-cyan-200 rounded-md p-6 h-fit shadow-sm">
            <div className="flex justify-between mb-4">
              <h4 className="text-lg font-semibold text-cyan-900">Topics</h4>
              <span className="text-sm text-sky-600 font-medium">
                Duration: {active.duration}
              </span>
            </div>
            <ul className="list-disc list-inside space-y-2 text-sm text-cyan-800">
              {active.topics.map((topic, idx) => (
                <li key={idx}>{topic}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
