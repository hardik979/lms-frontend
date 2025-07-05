"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "@clerk/nextjs";
import { API_BASE_URL } from "@/lib/api";

type PracticeQuestion = {
  _id: string;
  title: string;
  description: string;
  difficulty: string;
  examples: { input: string; output: string }[];
  testCases: { input: string; expectedOutput: string }[];
};

export default function PracticeEditor({ courseId }: { courseId: string }) {
  const [questions, setQuestions] = useState<PracticeQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<PracticeQuestion>>({});
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = await getToken();
        const res = await fetch(
          `${API_BASE_URL}/api/practice?courseId=${courseId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, [courseId]);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this question?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/practice/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");

      setQuestions((prev) => prev.filter((q) => q._id !== id));
      toast.success("Question deleted successfully!");
    } catch (err) {
      toast.error("Error deleting question");
      console.error(err);
    }
  };

  const startEditing = (q: PracticeQuestion) => {
    setEditingId(q._id);
    setEditForm({ ...q });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const handleUpdate = async () => {
    try {
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/api/practice/update/${editingId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) throw new Error("Update failed");

      const updated = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === editingId ? updated.question : q))
      );
      toast.success("Question updated!");
      cancelEditing();
    } catch (err) {
      toast.error("Failed to update");
      console.error(err);
    }
  };

  const updateExample = (
    index: number,
    field: "input" | "output",
    value: string
  ) => {
    const newExamples = [...(editForm.examples || [])];
    newExamples[index][field] = value;
    setEditForm({ ...editForm, examples: newExamples });
  };

  const updateTestCase = (
    index: number,
    field: "input" | "expectedOutput",
    value: string
  ) => {
    const newCases = [...(editForm.testCases || [])];
    newCases[index][field] = value;
    setEditForm({ ...editForm, testCases: newCases });
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-teal-800/20 to-cyan-800/20 rounded-lg p-6 border border-teal-700/30">
        <h2 className="text-2xl font-semibold text-white mb-2">
          Practice Questions
        </h2>
        <p className="text-teal-200/80 text-sm">
          Manage and edit practice questions for this course
        </p>
      </div>

      {loading ? (
        <div className="text-center py-8">
          <p className="text-teal-200">Loading questions...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-teal-900/30 to-cyan-900/30 rounded-lg border border-teal-700/20">
          <p className="text-teal-300 italic text-lg">
            No practice questions yet.
          </p>
          <p className="text-teal-400/70 text-sm mt-2">
            Questions will appear here once they are created.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q._id}
              className="bg-gradient-to-r from-teal-900/40 to-cyan-900/40 border border-teal-700/30 rounded-lg p-6 space-y-4 backdrop-blur-sm"
            >
              {editingId === q._id ? (
                <div className="space-y-4">
                  <Input
                    placeholder="Title"
                    value={editForm.title || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />
                  <Textarea
                    placeholder="Description"
                    value={editForm.description || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20 min-h-[100px]"
                  />
                  <Input
                    placeholder="Difficulty"
                    value={editForm.difficulty || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, difficulty: e.target.value })
                    }
                    className="bg-teal-800/30 border-teal-600/50 text-white placeholder:text-teal-300/70 focus:border-teal-400 focus:ring-teal-400/20"
                  />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-teal-200 flex items-center gap-2">
                      <div className="w-1 h-4 bg-teal-400 rounded"></div>
                      Examples
                    </h4>
                    <div className="space-y-2 pl-3">
                      {(editForm.examples || []).map((ex, i) => (
                        <div key={i} className="flex gap-3">
                          <Input
                            value={ex.input}
                            placeholder="Input"
                            onChange={(e) =>
                              updateExample(i, "input", e.target.value)
                            }
                            className="bg-teal-800/20 border-teal-600/40 text-white placeholder:text-teal-300/60 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                          <Input
                            value={ex.output}
                            placeholder="Output"
                            onChange={(e) =>
                              updateExample(i, "output", e.target.value)
                            }
                            className="bg-teal-800/20 border-teal-600/40 text-white placeholder:text-teal-300/60 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold text-sm text-teal-200 flex items-center gap-2">
                      <div className="w-1 h-4 bg-cyan-400 rounded"></div>
                      Test Cases
                    </h4>
                    <div className="space-y-2 pl-3">
                      {(editForm.testCases || []).map((tc, i) => (
                        <div key={i} className="flex gap-3">
                          <Input
                            value={tc.input}
                            placeholder="Input"
                            onChange={(e) =>
                              updateTestCase(i, "input", e.target.value)
                            }
                            className="bg-teal-800/20 border-teal-600/40 text-white placeholder:text-teal-300/60 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                          <Input
                            value={tc.expectedOutput}
                            placeholder="Expected Output"
                            onChange={(e) =>
                              updateTestCase(
                                i,
                                "expectedOutput",
                                e.target.value
                              )
                            }
                            className="bg-teal-800/20 border-teal-600/40 text-white placeholder:text-teal-300/60 focus:border-teal-400 focus:ring-teal-400/20"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4 border-t border-teal-700/30">
                    <Button
                      onClick={handleUpdate}
                      className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 text-white shadow-lg"
                    >
                      <Save size={16} className="mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={cancelEditing}
                      className="text-teal-200 hover:bg-teal-800/30 hover:text-white border border-teal-600/30"
                    >
                      <X size={16} className="mr-1" />
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-white text-lg mb-2">
                      {q.title}
                    </h3>
                    <div className="flex items-center gap-3">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-teal-600/80 to-cyan-600/80 text-white">
                        {q.difficulty}
                      </span>
                      <span className="text-teal-300/70 text-sm">
                        {q.examples?.length || 0} examples •{" "}
                        {q.testCases?.length || 0} test cases
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => startEditing(q)}
                      className="border-teal-600/50 text-teal-500 hover:bg-teal-700/30 hover:text-white hover:border-teal-500"
                    >
                      <Pencil size={16} />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(q._id)}
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
