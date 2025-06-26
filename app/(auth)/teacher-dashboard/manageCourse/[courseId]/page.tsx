"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import CourseStructureEditor from "./_tabs/CourseStructureEditor";
import PracticeEditor from "./_tabs/practiceEditor";
import ProjectEditor from "./_tabs/ProjectEditor";

export default function EditCoursePage() {
  const { courseId } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `http://localhost:5000/api/courses/${courseId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await res.json();
        setCourse(data.course);
      } catch (err) {
        console.error("Failed to load course:", err);
        toast.error("Error fetching course");
      } finally {
        setLoading(false);
      }
    };

    if (courseId) fetchCourse();
  }, [courseId]);

  if (loading)
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="text-center relative z-10">
          <div className="relative mb-8">
            <div className="w-20 h-20 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
            <div className="w-16 h-16 border-4 border-cyan-300/20 border-t-cyan-300 rounded-full animate-spin mx-auto absolute top-2 left-1/2 transform -translate-x-1/2 animate-reverse-spin"></div>
          </div>
          <div className="space-y-4">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Loading Course
            </h2>
            <p className="text-cyan-200/80 text-lg">
              Preparing your editing environment...
            </p>
            <div className="flex justify-center space-x-2 mt-4">
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce delay-200"></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 flex items-center justify-center relative overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="text-center relative z-10 max-w-md mx-auto p-8">
          <div className="bg-gradient-to-br from-red-900/30 to-red-800/20 backdrop-blur-xl border border-red-500/30 rounded-2xl p-8 shadow-2xl">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              Course Not Found
            </h2>
            <p className="text-red-200/80 mb-6">
              The course you're looking for could not be loaded. It may have
              been moved or deleted.
            </p>
            <button
              onClick={() => window.history.back()}
              className="bg-gradient-to-r from-cyan-600 to-cyan-500 hover:from-cyan-500 hover:to-cyan-400 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-cyan-500/25"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-gradient-to-r from-cyan-900/40 via-slate-900/40 to-indigo-900/40 backdrop-blur-xl border-b border-cyan-500/20 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-1">
                  Course Editor
                </h1>
                <p className="text-cyan-200/80">
                  Editing:{" "}
                  <span className="text-cyan-300 font-semibold">
                    {course.title}
                  </span>
                </p>
              </div>
            </div>

            <div className="hidden md:flex items-center space-x-3">
              <div className="bg-gradient-to-r from-green-900/30 to-emerald-900/30 border border-green-500/30 px-4 py-2 rounded-xl">
                <span className="text-green-400 text-sm font-medium">
                  ● Live Editing
                </span>
              </div>
              <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 border border-slate-600/30 px-4 py-2 rounded-xl">
                <span className="text-slate-300 text-sm">ID: {courseId}</span>
              </div>
            </div>
          </div>

          {/* Warning Banner */}
          <div className="bg-gradient-to-r from-amber-900/20 via-orange-900/20 to-red-900/20 backdrop-blur-sm border border-amber-500/30 rounded-2xl p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-amber-200 font-semibold text-lg mb-2">
                  Shared Editing Environment
                </h3>
                <p className="text-amber-200/80 leading-relaxed">
                  All teachers have access to view and edit courses in this
                  system. Please exercise caution when modifying shared content
                  to maintain course integrity and avoid conflicts with other
                  educators.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="structure" className="w-full">
            {/* Enhanced Tab List */}
            <div className="mb-8">
              <TabsList className="bg-gradient-to-r from-slate-800/60 via-slate-900/60 to-slate-800/60 backdrop-blur-xl border border-cyan-500/20 p-2 rounded-2xl shadow-2xl w-full md:w-auto">
                <TabsTrigger
                  value="structure"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 text-cyan-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl px-6 py-3 font-medium flex-1 md:flex-none"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 11H5m14-7H5m14 14H5"
                      />
                    </svg>
                    Structure
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="practice"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 text-cyan-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl px-6 py-3 font-medium flex-1 md:flex-none"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                      />
                    </svg>
                    Practice
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-cyan-500 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-cyan-500/25 text-cyan-300 hover:text-white hover:bg-slate-700/50 transition-all duration-300 rounded-xl px-6 py-3 font-medium flex-1 md:flex-none"
                >
                  <span className="flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Projects
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content with Enhanced Styling */}
            <div className="bg-gradient-to-br from-slate-900/30 via-slate-800/30 to-cyan-900/20 backdrop-blur-xl border border-cyan-500/20 rounded-3xl shadow-2xl overflow-hidden">
              <TabsContent value="structure" className="mt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 11H5m14-7H5m14 14H5"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Course Structure
                    </h2>
                  </div>
                  <CourseStructureEditor
                    courseId={courseId as string}
                    course={course}
                  />
                </div>
              </TabsContent>

              <TabsContent value="practice" className="mt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Practice Exercises
                    </h2>
                  </div>
                  <PracticeEditor courseId={courseId as string} />
                </div>
              </TabsContent>

              <TabsContent value="projects" className="mt-0 p-8">
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 10V3L4 14h7v7l9-11h-7"
                        />
                      </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white">
                      Course Projects
                    </h2>
                  </div>
                  <ProjectEditor courseId={courseId as string} />
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
