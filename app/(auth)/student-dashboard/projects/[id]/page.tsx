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
    <div
      className="w-full bg-cyan-950 min-h-screen px-6 py-10 rounded-2xl text-white"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      {/* Back Button */}
      <div className="mb-6">
        <Link
          href="/student-dashboard/projects"
          className="inline-flex items-center text-sm text-cyan-300 hover:underline"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Back to Projects
        </Link>
      </div>

      {/* Thumbnail */}
      {project.thumbnail && (
        <div className="flex justify-center mb-6">
          <div className="w-28 h-28 relative rounded-full overflow-hidden border-2 border-cyan-700">
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
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-neutral-100 mb-2 ">
          {project.title}
        </h1>
        {project.subheading && (
          <p className="text-lg text-neutral-200">{project.subheading}</p>
        )}
      </div>

      {/* Objective */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-cyan-200 mb-2">Objective</h2>
        <p className="text-base text-neutral-200">{project.objective}</p>
      </div>

      {/* Tech Stack */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-cyan-200 mb-2">Tech Stack</h2>
        <div className="flex flex-wrap gap-2">
          {project.techStack.map((tech, i) => (
            <Badge key={i} className="bg-cyan-800 border-cyan-600 text-sm">
              {tech}
            </Badge>
          ))}
        </div>
      </div>

      {/* Project Parts */}
      <div className="space-y-8">
        <h2 className="text-xl font-semibold text-cyan-200 mb-4">
          Project Description
        </h2>

        {project.parts.map((part, index) => (
          <div
            key={index}
            className="bg-cyan-950 p-6 rounded-xl border border-cyan-700"
          >
            <h3 className="text-lg font-bold text-cyan-300 mb-2">
              Part {index + 1}: {part.title}
            </h3>
            <ul className="list-disc list-inside text-neutral-300 space-y-1 whitespace-pre-line">
              {part.description
                .split("\n")
                .filter(Boolean)
                .map((line, i) => (
                  <li key={i}>{line.trim()}</li>
                ))}
            </ul>
          </div>
        ))}
      </div>
      {/* GitHub Repo */}
      {project.githubRepo && (
        <div className="mt-12">
          <h2 className="text-xl font-semibold text-cyan-200 mb-2">
            GitHub Repo
          </h2>
          <a
            href={project.githubRepo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <Button className="bg-cyan-600 hover:bg-cyan-700">
              View on GitHub <FiGithub className="w-4 h-4 ml-1" />
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}
