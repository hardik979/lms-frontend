"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import LoadingPage from "@/components/Loader";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { FiGithub } from "react-icons/fi";

type Project = {
  _id: string;
  title: string;
  subheading?: string;
  objective: string;
  techStack: string[];
  githubRepo: string;
  thumbnail?: string;
  parts: { title: string; description: string }[];
};

export default function ProjectDetailPage() {
  const { id } = useParams();
  const { getToken } = useAuth();

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const token = await getToken();
      const res = await fetch(
        `http://localhost:5000/api/projects/single/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const data = await res.json();
      setProject(data.project);
      setLoading(false);
    };

    if (id) fetchProject();
  }, [id, getToken]);

  if (loading || !project) return <LoadingPage />;

  return (
    <div className="max-w-full rounded-2xl bg-gradient-to-br from-slate-900 via-cyan-900 to-slate-900 min-h-screen px-6 py-10 text-white">
      <div className="max-w-full mx-auto">
        {/* Back Button */}
        <div className="mb-8">
          <Link
            href="/student-dashboard/projects"
            className="inline-flex items-center text-sm text-cyan-300 hover:text-cyan-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Projects
          </Link>
        </div>

        {/* Header Section */}
        <div className="text-center mb-12">
          {/* Thumbnail */}
          {project.thumbnail && (
            <div className="flex justify-center mb-6">
              <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-cyan-700 shadow-lg">
                <Image
                  src={project.thumbnail}
                  alt={project.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}

          {/* Title & Subheading */}
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            {project.title}
          </h1>
          {project.subheading && (
            <p className="text-xl text-cyan-200 max-w-3xl mx-auto">
              {project.subheading}
            </p>
          )}
        </div>

        {/* Content Sections */}
        <div className="space-y-8 mb-12">
          {/* Tech Stack */}
          <div className="bg-cyan-900/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              Tech Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.techStack.map((tech, i) => (
                <Badge
                  key={i}
                  className="bg-cyan-800/60 border-cyan-600 text-cyan-100 text-sm px-4 py-2 font-medium hover:bg-cyan-700/60 transition-colors"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          {/* Objective */}
          <div className="bg-cyan-900/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800">
            <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center">
              <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
              Objective
            </h2>
            <p className="text-lg text-cyan-100 leading-relaxed">
              {project.objective}
            </p>
          </div>
        </div>

        {/* Project Parts */}
        <div className="mb-12">
          <h2 className="text-3xl font-semibold text-cyan-300 mb-8 flex items-center">
            <span className="w-3 h-3 bg-cyan-400 rounded-full mr-4"></span>
            Project Description
          </h2>

          <div className="space-y-6">
            {project.parts.map((part, index) => (
              <div
                key={index}
                className="bg-cyan-900/20 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800 hover:border-cyan-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-cyan-800 rounded-full flex items-center justify-center text-cyan-200 font-bold text-lg">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-cyan-200 mb-4">
                      {part.title}
                    </h3>
                    <div className="text-cyan-100 space-y-2">
                      {part.description
                        .split("\n")
                        .filter(Boolean)
                        .map((line, i) => (
                          <div key={i} className="flex items-start gap-3">
                            <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mt-2 flex-shrink-0"></span>
                            <span className="leading-relaxed">
                              {line.trim()}
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* GitHub Repo */}
        {project.githubRepo && (
          <div className="text-center">
            <div className="bg-cyan-900/30 backdrop-blur-sm p-8 rounded-2xl border border-cyan-800 inline-block">
              <h2 className="text-2xl font-semibold text-cyan-300 mb-4 flex items-center justify-center">
                <span className="w-2 h-2 bg-cyan-400 rounded-full mr-3"></span>
                Source Code
              </h2>
              <a
                href={project.githubRepo}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button className="bg-cyan-700 hover:bg-cyan-600 text-white px-8 py-3 text-lg font-medium rounded-xl transition-all duration-200 hover:scale-105 shadow-lg">
                  <FiGithub className="w-5 h-5 mr-3" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
