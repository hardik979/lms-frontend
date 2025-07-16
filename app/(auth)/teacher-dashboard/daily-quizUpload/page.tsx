"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "react-toastify";
import { API_BASE_URL } from "@/lib/api";
import { Upload, Plus, X } from "lucide-react";

// Define a type-safe enum for questionType
type QuestionTypeEnum = "text" | "mcq";

type Question = {
  question: string;
  questionType: QuestionTypeEnum;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
};

export default function UploadDailyQuizPage() {
  const { getToken } = useAuth();
  const [date, setDate] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [difficultyLevel, setDifficultyLevel] = useState("easy");
  const [questions, setQuestions] = useState<Question[]>([
    {
      question: "",
      questionType: "text",
      options: { A: "", B: "", C: "", D: "" },
    },
  ]);
  const [isUploading, setIsUploading] = useState(false);

  const handleQuestionChange = (
    index: number,
    key: "question" | "questionType",
    value: string
  ) => {
    const updated = [...questions];
    if (key === "questionType" && value !== "text" && value !== "mcq") return;
    updated[index][key] = value as any;
    setQuestions(updated);
  };

  const handleOptionChange = (
    index: number,
    optionKey: keyof Question["options"],
    value: string
  ) => {
    const updated = [...questions];
    updated[index].options[optionKey] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question: "",
        questionType: "text",
        options: { A: "", B: "", C: "", D: "" },
      },
    ]);
  };

  const removeQuestion = (index: number) => {
    if (questions.length === 1) return;
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!date || !title || !difficultyLevel) {
      toast.error("All quiz fields are required");
      return;
    }

    for (const q of questions) {
      if (!q.question) {
        toast.error("Each question must have text");
        return;
      }
      if (q.questionType === "mcq") {
        const { A, B, C, D } = q.options;
        if (!A || !B || !C || !D) {
          toast.error("MCQ options A–D are required");
          return;
        }
      }
    }

    setIsUploading(true);
    try {
      const token = await getToken();

      const quizRes = await fetch(`${API_BASE_URL}/api/daily-quiz/create`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ date, title, description, difficultyLevel }),
      });

      const quizData = await quizRes.json();
      if (!quizRes.ok) {
        toast.error(quizData.error || "Quiz creation failed");
        setIsUploading(false);
        return;
      }

      const quizId = quizData.quiz._id;

      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const res = await fetch(
          `${API_BASE_URL}/api/daily-quiz/${quizId}/questions`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              question: q.question,
              questionType: q.questionType,
              options: q.questionType === "mcq" ? q.options : undefined,
            }),
          }
        );

        if (!res.ok) throw new Error(`Failed to upload question ${i + 1}`);
      }

      toast.success("✅ Daily quiz uploaded");
      setTitle("");
      setDescription("");
      setDate("");
      setDifficultyLevel("easy");
      setQuestions([
        {
          question: "",
          questionType: "text",
          options: { A: "", B: "", C: "", D: "" },
        },
      ]);
    } catch (err) {
      console.error(err);
      toast.error("❌ Server error");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-4">Upload Daily Quiz</h1>

      <label className="block mb-2">Quiz Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-4"
        placeholder="Quiz title"
      />

      <label className="block mb-2">Description (optional)</label>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-4"
      />

      <label className="block mb-2">Quiz Date</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-4"
      />

      <label className="block mb-2">Difficulty Level</label>
      <select
        value={difficultyLevel}
        onChange={(e) => setDifficultyLevel(e.target.value)}
        className="w-full p-2 rounded bg-slate-800 border border-slate-600 mb-4"
      >
        <option value="SQL">SQL</option>
        <option value="linux">Linux</option>
        <option value="ITIL">ITIL</option>
        <option value="Tools">Tools (Monitoring & Ticketing) </option>
        <option value="easy">Easy</option>
        <option value="medium">Medium</option>
        <option value="hard">Hard</option>
      </select>

      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Questions</h2>
        {questions.map((q, i) => (
          <div
            key={i}
            className="mb-4 bg-slate-800 p-4 rounded border border-slate-600"
          >
            <label className="block mb-2">Question {i + 1}</label>
            <textarea
              value={q.question}
              onChange={(e) =>
                handleQuestionChange(i, "question", e.target.value)
              }
              className="w-full p-2 rounded bg-slate-900 border border-slate-600 mb-2"
              placeholder="Enter question text"
            />

            <label className="block mb-2">Question Type</label>
            <select
              value={q.questionType}
              onChange={(e) =>
                handleQuestionChange(
                  i,
                  "questionType",
                  e.target.value as QuestionTypeEnum
                )
              }
              className="w-full p-2 rounded bg-slate-900 border border-slate-600 mb-2"
            >
              <option value="text">Text Answer</option>
              <option value="mcq">MCQ</option>
            </select>

            {q.questionType === "mcq" && (
              <div className="grid grid-cols-2 gap-4 mb-2">
                {(["A", "B", "C", "D"] as const).map((opt) => (
                  <input
                    key={opt}
                    type="text"
                    value={q.options[opt]}
                    onChange={(e) => handleOptionChange(i, opt, e.target.value)}
                    placeholder={`Option ${opt}`}
                    className="p-2 rounded bg-slate-900 border border-slate-600"
                  />
                ))}
              </div>
            )}

            {questions.length > 1 && (
              <button
                className="text-red-400 mt-2 flex items-center"
                onClick={() => removeQuestion(i)}
              >
                <X className="w-4 h-4 mr-1" /> Remove
              </button>
            )}
          </div>
        ))}

        <button
          onClick={addQuestion}
          className="flex items-center gap-2 px-4 py-2 rounded bg-cyan-700 hover:bg-cyan-800 transition"
        >
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isUploading}
        className="w-full py-3 rounded bg-emerald-600 hover:bg-emerald-700 transition text-white font-semibold flex justify-center items-center gap-2"
      >
        {isUploading ? (
          <>
            <Upload className="animate-spin w-5 h-5" /> Uploading...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5" /> Submit Quiz
          </>
        )}
      </button>
    </div>
  );
}
