"use client";
import { useState } from "react";

const curriculum = {
  Foundation: {
    duration: "1 Month",
    modules: [
      "Linux Fundamentals & System Administration",
      "Introduction to Relational Databases (SQL Basics)",
      "Shell Scripting & Automation Essentials",
      "Basic Networking Concepts for IT Support",
    ],
  },
  Specialisation: {
    duration: "1 Month",
    modules: [
      "Advanced SQL Queries & Database Design",
      "Linux Server Security & Hardening",
      "Hands-on Monitoring Tools: Splunk, Grafana",
      "Log Management & Analysis with ELK Stack",
    ],
  },
  Industry: {
    duration: "1 Month",
    modules: [
      "Job Readiness & Interview Skills",
      "Resume Building & Personal Branding",
      "Mock Interviews & Technical Interview Prep",
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
    <section className="bg-cyan-900/30 backdrop-blur-sm border border-cyan-700/50 p-6 md:p-10 rounded-xl w-full shadow-md my-4 text-white">
      <h2 className="text-xl md:text-2xl font-semibold mb-6">
        Industry-focused curriculum covering Linux, SQL, Monitoring Tools, and
        job-ready interview skills
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
        <p className="text-sm text-cyan-300">
          📅 Seats filling Fast - Enroll Soon!
        </p>
      </div>
    </section>
  );
};

export default CurriculumSection;
