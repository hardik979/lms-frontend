"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import LoadingPage from "../Loader";

type Problem = {
  _id: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
};

export default function PracticeProblemList({
  courseId,
}: {
  courseId: string;
}) {
  const { getToken } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [solved, setSolved] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProblems = async () => {
      const token = await getToken();

      const [problemsRes, userRes] = await Promise.all([
        fetch(`http://localhost:5000/api/practise/questions/${courseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`http://localhost:5000/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const problemsData = await problemsRes.json();
      const userData = await userRes.json();

      setProblems(problemsData.questions || []);
      setSolved(userData.solvedProblems?.map((q: any) => q.questionId) || []);
      setLoading(false);
    };

    fetchProblems();
  }, [courseId, getToken]);

  if (loading) return <LoadingPage />;

  return (
    <div
      className="p-4 md:p-8 bg-cyan-950 rounded-2xl"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <h1 className="text-2xl font-bold mb-4 underline text-neutral-200">
        Coding Problems
      </h1>

      <div className="rounded-lg overflow-hidden border bg-white divide-y">
        {/* Header Row */}
        <div className="grid grid-cols-12 font-semibold bg-cyan-100 text-cyan-900 px-6 py-3 text-left">
          <span className="col-span-6">Problem</span>
          <span className="col-span-3">Difficulty</span>
          <span className="col-span-3">Status</span>
        </div>

        {/* Data Rows */}
        {problems.map((prob) => {
          const isSolved = solved.includes(prob._id);
          const difficultyColor =
            prob.difficulty === "easy"
              ? "text-green-600"
              : prob.difficulty === "medium"
              ? "text-yellow-600"
              : "text-red-600";

          return (
            <Link
              key={prob._id}
              href={`/solve/${prob._id}`}
              className="grid grid-cols-12 items-center px-6 py-4 hover:bg-cyan-50 transition cursor-pointer"
            >
              <span className="col-span-6 text-cyan-900">{prob.title}</span>
              <span
                className={`col-span-3 capitalize font-medium ${difficultyColor}`}
              >
                {prob.difficulty}
              </span>
              <span className="col-span-3">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    isSolved
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  {isSolved ? "Solved" : "Unsolved"}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
