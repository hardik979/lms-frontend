"use client";
import { useState } from "react";

const curriculum = {
  Foundation: {
    duration: "6 Months, 30 ECTS Credits",
    modules: [
      "Introduction to Computer Programming",
      "Numerical Programming in Python",
      "Relational Databases",
      "Data Visualisation tools",
    ],
  },
  Specialisation: {
    duration: "5 Months, 30 ECTS Credits",
    modules: [
      "Applied Business Analytics",
      "Advanced Python for Data Science",
      "Machine Learning Fundamentals",
    ],
  },
  Industry: {
    duration: "1 Month, 30 ECTS Credits",
    modules: [
      "Capstone Project",
      "Career Mentorship",
      "Machine Learning & Generative AI with Microsoft Azure",
    ],
  },
};

const CurriculumSection = () => {
  const [selectedTrack, setSelectedTrack] =
    useState<keyof typeof curriculum>("Foundation");

  const tracks = [
    { label: "Foundation Track", key: "Foundation" },
    { label: "Specialisation Track", key: "Specialisation" },
    { label: "Industry Immersion Track", key: "Industry" },
  ];

  return (
    <section className="bg-cyan-900/30  backdrop-blur-sm border border-cyan-700/50 p-6 md:p-10 rounded-xl w-full shadow-md my-4 text-white">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Curriculum re-engineered for the post ChatGPT era with advanced
        specialisations to build deeper expertise
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Track Selection */}
        <div className="flex flex-col gap-4">
          {tracks.map(({ label, key }) => (
            <button
              key={key}
              className={`p-4 border text-left rounded-md font-medium transition ${
                selectedTrack === key
                  ? "border-cyan-400 bg-cyan-800 text-white"
                  : "bg-cyan-900 text-cyan-100 border-cyan-700 hover:bg-cyan-800"
              }`}
              onClick={() => setSelectedTrack(key as keyof typeof curriculum)}
            >
              {label}
              <div className="text-sm font-normal text-white mt-1">
                {curriculum[key as keyof typeof curriculum].duration}
              </div>
            </button>
          ))}
        </div>

        {/* Right: Modules List */}
        <div className="md:col-span-2">
          <ul className="space-y-2">
            {curriculum[selectedTrack].modules.map((mod, idx) => (
              <li
                key={idx}
                className="bg-cyan-900 border border-cyan-800 rounded-md px-4 py-2 text-sm md:text-base text-cyan-100"
              >
                {mod}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Bottom Buttons */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mt-8">
        <div className="flex gap-4 flex-wrap">
          <button className="border border-cyan-400 text-cyan-200 hover:bg-cyan-800 font-semibold px-5 py-2 rounded-md transition">
            Download Complete Curriculum
          </button>
        </div>
        <p className="text-sm text-cyan-300">
          📅 Next Cohort Starts On Tuesday, May 13, 2025
        </p>
      </div>
    </section>
  );
};

export default CurriculumSection;
