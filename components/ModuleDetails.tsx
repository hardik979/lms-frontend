"use client";

import { IconLock, IconBook } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const ModuleDetail = () => {
  const lessons = [
    {
      title: "Introduction to SQL",
      unlocked: true,
      playbackId: "Akgwj01RP32g013SpGmrU2xkrdyxe7GDSW1gftWnR7JuM",
    },
    { title: "Progress Tracker Overview", unlocked: false },
    { title: "Learning Objective", unlocked: false },
    { title: "Introduction to Python Programming", unlocked: false },
    { title: "Data Types in Python", unlocked: false },
    { title: "Indexing & Slicing", unlocked: false },
    { title: "Operators in Data Types", unlocked: false },
    { title: "In-Built Functions & Methods", unlocked: false },
    {
      title: "Skill Mastery Challenge - Getting Started with Python",
      unlocked: false,
    },
  ];

  const chapters = [
    { title: "Getting Started With SQL", unlocked: true },
    { title: "Python Control Flow", unlocked: false },
    { title: "Mid Course Assessment", unlocked: false },
    { title: "Object Oriented Programming", unlocked: false },
    { title: "Revision & Beyond", unlocked: false },
    { title: "End Course Assessment", unlocked: false },
  ];

  const [lessonProgress, setLessonProgress] = useState<{
    [key: string]: string;
  }>({});

  useEffect(() => {
    const progressMap: { [key: string]: string } = {};
    lessons.forEach((lesson) => {
      if (lesson.unlocked && lesson.playbackId) {
        const stored = localStorage.getItem(`progress_${lesson.playbackId}`);
        progressMap[lesson.playbackId] = stored || "0";
      }
    });
    setLessonProgress(progressMap);
  }, []);

  return (
    <section className="bg-cyan-950 text-white rounded-xl shadow-md p-6 md:p-8 my-10 mx-4 md:mx-10">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Module 1: Introduction to Computer Programming
        </h2>
        <p className="text-sm text-cyan-300 mt-1">
          27 Lessons • 4 Weeks • 5 Credits • EBook Included
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-cyan-800 rounded-full mb-6">
        <div className="h-2 bg-cyan-400 rounded-full" style={{ width: "0%" }} />
      </div>
      <p className="text-sm text-cyan-300 mb-6">Progress: 0%</p>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Chapters */}
        <div>
          {chapters.map((chap, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-4 rounded-md border mb-2 ${
                chap.unlocked
                  ? "border-cyan-500 bg-cyan-900 text-cyan-100 font-semibold"
                  : "bg-cyan-800 text-cyan-400 border-cyan-700"
              }`}
            >
              <span>
                <strong>Chapter {idx + 1}</strong>: {chap.title}
              </span>
              {!chap.unlocked && <IconLock size={18} />}
            </div>
          ))}
        </div>

        {/* Right: Lessons */}
        <div>
          <h3 className="text-base font-semibold mb-3 text-white">Lessons</h3>
          <div className="space-y-2">
            {lessons.map((lesson, idx) => {
              const progressText =
                lesson.unlocked && lesson.playbackId
                  ? `Watched: ${lessonProgress[lesson.playbackId] || "0"}%`
                  : "";

              const lessonContent = (
                <div
                  key={idx}
                  className={`flex flex-col p-3 rounded-md border ${
                    lesson.unlocked
                      ? "border-cyan-400 bg-cyan-900 text-white hover:bg-cyan-700 cursor-pointer"
                      : "bg-cyan-800 text-neutral-200 border-cyan-700"
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <IconBook size={16} />
                      <span className="text-sm">{lesson.title}</span>
                    </div>
                    {!lesson.unlocked && <IconLock size={16} />}
                  </div>
                  {progressText && (
                    <span className="text-xs text-cyan-400 mt-1">
                      {progressText}
                    </span>
                  )}
                </div>
              );

              return lesson.unlocked ? (
                <Link key={idx} href="/lessons">
                  {lessonContent}
                </Link>
              ) : (
                <div key={idx}>{lessonContent}</div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModuleDetail;
