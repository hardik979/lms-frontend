"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { useActiveCourseId } from "@/lib/hooks/useDefaultCourse";
import { motion } from "framer-motion";
import { BadgeCheckIcon, Lock, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import LoadingPage from "@/components/Loader";

type Project = {
  _id: string;
  title: string;
  objective: string;
  techStack: string[];
  githubRepo: string;
  subheading: string;
  thumbnail: string;
};

export default function ProjectsPage() {
  const { getToken } = useAuth();
  const activeCourseId = useActiveCourseId();
  const setCourseId = useSelectedCourseStore((state) => state.setCourseId);
  const [projects, setProjects] = useState<Project[]>([]);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Don't run until courseId is available
    if (!activeCourseId) return;

    setCourseId(activeCourseId);

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const token = await getToken();
        if (!token) {
          setHasAccess(false);
          return;
        }

        const res = await fetch(
          `http://localhost:5000/api/projects/${activeCourseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (res.status === 403) {
          setHasAccess(false);
          return;
        }

        const data = await res.json();
        setProjects(data.projects || []);
        setHasAccess(true);
      } catch (err) {
        console.error("❌ Failed to fetch projects", err);
        setHasAccess(false);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [activeCourseId, getToken, setCourseId]);

  if (loading || !activeCourseId) {
    return <LoadingPage />;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 p-4 sm:p-6 lg:p-8"
    >
      <div className="max-w-full mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white">
                Projects
              </h1>
              <p className="text-cyan-200 text-sm sm:text-base">
                Build real-world applications and strengthen your skills
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-6 text-sm text-cyan-300">
            <span>{projects.length} projects available</span>
            <span className="flex items-center gap-1">
              <BadgeCheckIcon className="w-4 h-4" />
              Hands-on learning
            </span>
          </div>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {projects.map((project, index) => {
            const isLocked = !hasAccess;

            return (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                className={`group relative bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden transition-all duration-300 ${
                  isLocked
                    ? "opacity-60 cursor-not-allowed"
                    : "hover:bg-white/15 hover:border-white/30 hover:shadow-xl hover:scale-[1.02]"
                }`}
              >
                {/* Project Image */}
                <div className="relative h-48 bg-gradient-to-br from-cyan-500/20 to-blue-600/20 flex items-center justify-center">
                  {project.thumbnail ? (
                    <Image
                      src={project.thumbnail}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                      <Code2 className="w-8 h-8 text-white" />
                    </div>
                  )}

                  {/* Lock/Access Indicator */}
                  {isLocked ? (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                      <Lock className="w-4 h-4 text-white" />
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-emerald-500/80 flex items-center justify-center">
                      <BadgeCheckIcon className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Project Content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>

                  <p className="text-cyan-200 text-sm mb-4 line-clamp-2">
                    {project.subheading}
                  </p>

                  {/* Tech Stack */}
                  {project.techStack && project.techStack.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.techStack.slice(0, 3).map((tech, techIndex) => (
                        <span
                          key={techIndex}
                          className="px-2 py-1 bg-cyan-500/20 text-cyan-300 text-xs rounded-md border border-cyan-500/30"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.techStack.length > 3 && (
                        <span className="px-2 py-1 bg-white/10 text-white text-xs rounded-md">
                          +{project.techStack.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Action Button */}
                  {!isLocked && (
                    <Link
                      href={`/student-dashboard/projects/${project._id}`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 group-hover:shadow-lg"
                    >
                      Start Project
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  )}

                  {isLocked && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-500/20 text-gray-400 text-sm font-medium rounded-lg cursor-not-allowed">
                      <Lock className="w-4 h-4" />
                      Locked
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Empty State */}
        {projects.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-cyan-500/20 flex items-center justify-center">
              <Code2 className="w-8 h-8 text-cyan-300" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No Projects Available
            </h3>
            <p className="text-cyan-200 text-sm">
              Projects will be available once you enroll in a course
            </p>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
