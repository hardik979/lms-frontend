"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { useActiveCourseId } from "@/lib/hooks/useDefaultCourse";
import { BadgeCheckIcon, Lock } from "lucide-react";
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
    return (
      <div className="flex justify-center items-center min-h-screen bg-cyan-950">
        <LoadingPage />
      </div>
    );
  }

  return (
    <div
      className="p-6 bg-cyan-950 min-h-screen text-white rounded-2xl"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <h1 className="text-3xl font-bold mb-2 text-white underline">Projects</h1>
      <p className="text-cyan-300 mb-6 text-sm md:text-base">
        Augment your fundamentals and get hands-on with real-world projects.
      </p>

      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {projects.map((project) => {
          const isLocked = !hasAccess;

          return (
            <div
              key={project._id}
              className={`relative bg-neutral-100 p-4 rounded-xl shadow-md transition-all ${
                isLocked ? "opacity-60 cursor-not-allowed" : "hover:shadow-lg"
              }`}
            >
              <div className="flex justify-center mb-4">
                <div className="w-24 h-24 relative rounded-full overflow-hidden border-2 border-cyan-200">
                  <Image
                    src={project.thumbnail || "/placeholder.png"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="text-center text-black">
                <h3 className="text-lg font-bold mb-1">{project.title}</h3>
                <p className="text-sm text-gray-700">{project.subheading}</p>
              </div>

              {isLocked ? (
                <Lock className="absolute top-3 right-3 text-gray-400" />
              ) : (
                <>
                  <Link
                    href={`/student-dashboard/projects/${project._id}`}
                    className="text-sm text-red-600 font-semibold block mt-3 text-center"
                  >
                    Start now →
                  </Link>
                  <BadgeCheckIcon className="absolute bottom-3 right-3 w-4 h-4 text-cyan-500" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
