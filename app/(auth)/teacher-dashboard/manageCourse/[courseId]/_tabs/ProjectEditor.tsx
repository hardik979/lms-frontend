"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  PlusCircle,
  MinusCircle,
  Github,
  Code2,
} from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";
import { API_BASE_URL } from "@/lib/api";

type Project = {
  _id: string;
  title: string;
  subheading: string;
  objective: string;
  techStack: string[];
  githubRepo: string;
  parts: string[];
};

export default function ProjectEditor({ courseId }: { courseId: string }) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${API_BASE_URL}/api/projects?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setProjects(data.projects || []);
      } catch (err) {
        console.error("Failed to fetch projects");
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [courseId]);

  const startEditing = (project: Project) => {
    setEditingId(project._id);
    setEditForm({
      ...project,
      techStack: project.techStack.join(", "),
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/api/projects/update/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...editForm,
            techStack:
              typeof editForm.techStack === "string"
                ? editForm.techStack.split(",").map((t: string) => t.trim())
                : [],
            parts: editForm.parts.map((p: any) =>
              typeof p === "string" ? p : p.title || JSON.stringify(p)
            ),
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      setProjects((prev) =>
        prev.map((p) => (p._id === editingId ? updated.project : p))
      );
      toast.success("Project updated!");
      cancelEditing();
    } catch (err) {
      toast.error("Update failed");
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this project?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/projects/delete/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");
      setProjects((prev) => prev.filter((p) => p._id !== id));
      toast.success("Project deleted!");
    } catch (err) {
      toast.error("Error deleting project");
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-800/20 to-cyan-800/20 rounded-lg p-6 border border-teal-700/30">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-semibold text-white mb-2">Projects</h2>
            <p className="text-teal-200/80 text-sm">
              Manage and edit course projects
            </p>
          </div>
          <a href={`/teacher-dashboard/upload-project?courseId=${courseId}`}>
            <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg">
              <Plus size={16} className="mr-2" /> Add Project
            </Button>
          </a>
        </div>
      </div>

      {loading ? (
        <LoadingPage />
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-lg border border-teal-700/20">
          <Code2 size={48} className="mx-auto text-teal-400/50 mb-4" />
          <p className="text-teal-300 italic text-lg">No projects yet.</p>
          <p className="text-teal-400/70 text-sm mt-2">
            Projects will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-700/30 rounded-lg p-6 space-y-4 backdrop-blur-sm"
            >
              {editingId === project._id ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />
                  <Input
                    placeholder="Subheading"
                    value={editForm.subheading || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, subheading: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />
                  <Textarea
                    placeholder="Objective"
                    value={editForm.objective || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, objective: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20 min-h-[100px]"
                  />
                  <Input
                    placeholder="Tech Stack (comma separated)"
                    value={editForm.techStack || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, techStack: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />
                  <Input
                    placeholder="GitHub Repo"
                    value={editForm.githubRepo || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, githubRepo: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-teal-200 flex items-center gap-2">
                      <div className="w-1 h-4 bg-cyan-400 rounded"></div>
                      Project Parts
                    </h4>
                    <div className="space-y-2 pl-3">
                      {(editForm.parts || []).map(
                        (part: string, index: number) => (
                          <div key={index} className="flex gap-2 items-center">
                            <Input
                              value={part}
                              onChange={(e) => {
                                const updatedParts = [
                                  ...(editForm.parts || []),
                                ];
                                updatedParts[index] = e.target.value;
                                setEditForm({
                                  ...editForm,
                                  parts: updatedParts,
                                });
                              }}
                              className="bg-teal-800/20 border-teal-600/40 text-white placeholder:text-teal-300/60 focus:border-teal-400 focus:ring-teal-400/20"
                            />
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const updatedParts = [
                                  ...(editForm.parts || []),
                                ];
                                updatedParts.splice(index, 1);
                                setEditForm({
                                  ...editForm,
                                  parts: updatedParts,
                                });
                              }}
                              className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                            >
                              <MinusCircle size={16} />
                            </Button>
                          </div>
                        )
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setEditForm({
                            ...editForm,
                            parts: [...(editForm.parts || []), ""],
                          })
                        }
                        className="border-teal-600/50 text-teal-400 hover:bg-teal-700/30 hover:text-white hover:border-teal-500"
                      >
                        <PlusCircle size={16} className="mr-2" /> Add Step
                      </Button>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-teal-700/30">
                    <Button
                      onClick={handleUpdate}
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
                    >
                      <Save size={16} className="mr-2" /> Save Changes
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={cancelEditing}
                      className="text-teal-200 hover:bg-teal-800/30 hover:text-white border border-teal-600/30"
                    >
                      <X size={16} className="mr-1" /> Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {project.title}
                    </h3>
                    <p className="text-teal-200/90 font-medium mb-2">
                      {project.subheading}
                    </p>
                    <p className="text-teal-300/80 text-sm mb-3 leading-relaxed">
                      {project.objective}
                    </p>

                    <div className="flex flex-wrap gap-4 text-sm">
                      {project.techStack && project.techStack.length > 0 && (
                        <div className="flex items-start gap-2">
                          <span className="text-teal-400 font-medium">
                            Tech:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {project.techStack.map((tech, i) => (
                              <span
                                key={i}
                                className="bg-teal-700/40 text-teal-200 px-2 py-1 rounded-md text-xs"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {project.githubRepo && (
                        <div className="flex items-center gap-2">
                          <Github size={14} className="text-teal-400" />
                          <a
                            href={project.githubRepo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-teal-300 hover:text-teal-200 text-xs underline"
                          >
                            Repository
                          </a>
                        </div>
                      )}

                      {project.parts && project.parts.length > 0 && (
                        <span className="text-teal-300/70 text-xs">
                          {project.parts.length} parts
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(project)}
                      className="border-teal-600/50 text-teal-200 hover:bg-teal-700/30 hover:text-white hover:border-teal-500"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project._id)}
                      className="bg-red-600/80 hover:bg-red-700 text-white border-red-500/50"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
