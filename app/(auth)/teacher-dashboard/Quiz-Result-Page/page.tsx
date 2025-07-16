"use client";
import { API_BASE_URL } from "@/lib/api";
import { useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Calendar,
  Users,
  Award,
  Clock,
} from "lucide-react";

interface Answer {
  questionId: string;
  studentAnswer: string;
  questionText: string;
}

interface Attempt {
  _id: string;
  studentName: string;
  attemptedAt: string;
  quizId: {
    _id: string;
    title: string;
    difficultyLevel: string;
  };
  answers: Answer[];
}

export default function TeacherQuizResultsPage() {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedAttempts, setExpandedAttempts] = useState<Set<string>>(
    new Set()
  );
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      const token = await getToken();
      const res = await fetch(
        `${API_BASE_URL}/api/daily-quiz/results?date=${selectedDate}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await res.json();
      setAttempts(data.attempts || []);
      setLoading(false);
    };
    fetchResults();
  }, [selectedDate]);

  const toggleExpanded = (attemptId: string) => {
    const newExpanded = new Set(expandedAttempts);
    if (newExpanded.has(attemptId)) {
      newExpanded.delete(attemptId);
    } else {
      newExpanded.add(attemptId);
    }
    setExpandedAttempts(newExpanded);
  };

  const getDifficultyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return "text-green-400 bg-green-400/10";
      case "medium":
        return "text-yellow-400 bg-yellow-400/10";
      case "hard":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  const groupedAttempts = attempts.reduce((acc, attempt) => {
    const quizTitle = attempt.quizId.title;
    if (!acc[quizTitle]) {
      acc[quizTitle] = [];
    }
    acc[quizTitle].push(attempt);
    return acc;
  }, {} as Record<string, Attempt[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
            <Award className="text-cyan-400" />
            Daily Quiz Results
          </h1>
          <p className="text-slate-400">
            Track student performance and quiz attempts
          </p>
        </div>

        {/* Date Selector */}
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-700/50">
          <label className=" text-white font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-cyan-400" />
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-slate-900 border border-slate-600 px-4 py-3 rounded-lg text-white focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 outline-none transition-all duration-200"
          />
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
            <span className="ml-4 text-white">Loading quiz results...</span>
          </div>
        )}

        {/* Empty State */}
        {!loading && attempts.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 rounded-xl p-8 border border-slate-700/50">
              <Users className="w-16 h-16 text-slate-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                No Quiz Attempts
              </h3>
              <p className="text-slate-400">
                No students have attempted quizzes on the selected date.
              </p>
            </div>
          </div>
        )}

        {/* Results */}
        {!loading && attempts.length > 0 && (
          <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Users className="w-8 h-8 text-cyan-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {attempts.length}
                    </p>
                    <p className="text-slate-400">Total Attempts</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Award className="w-8 h-8 text-green-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {Object.keys(groupedAttempts).length}
                    </p>
                    <p className="text-slate-400">Unique Quizzes</p>
                  </div>
                </div>
              </div>
              <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                <div className="flex items-center gap-3">
                  <Clock className="w-8 h-8 text-yellow-400" />
                  <div>
                    <p className="text-2xl font-bold text-white">
                      {new Set(attempts.map((a) => a.studentName)).size}
                    </p>
                    <p className="text-slate-400">Unique Students</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quiz Results by Quiz */}
            {Object.entries(groupedAttempts).map(
              ([quizTitle, quizAttempts]) => (
                <div
                  key={quizTitle}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden"
                >
                  <div className="p-6 border-b border-slate-700/50">
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {quizTitle}
                    </h3>
                    <div className="flex items-center gap-4 text-sm">
                      <span
                        className={`px-3 py-1 rounded-full font-medium ${getDifficultyColor(
                          quizAttempts[0].quizId.difficultyLevel
                        )}`}
                      >
                        {quizAttempts[0].quizId.difficultyLevel}
                      </span>
                      <span className="text-slate-400">
                        {quizAttempts.length} attempts
                      </span>
                    </div>
                  </div>

                  <div className="divide-y divide-slate-700/50">
                    {quizAttempts.map((attempt) => (
                      <div key={attempt._id} className="group">
                        <div
                          className="p-6 hover:bg-slate-700/30 transition-colors cursor-pointer flex items-center justify-between"
                          onClick={() => toggleExpanded(attempt._id)}
                        >
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {attempt.studentName.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="font-semibold text-white">
                                  {attempt.studentName}
                                </p>
                                <p className="text-sm text-slate-400">
                                  {new Date(
                                    attempt.attemptedAt
                                  ).toLocaleString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-slate-400">
                              <span>
                                {attempt.answers.length} answers submitted
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="text-sm text-slate-400">
                              {expandedAttempts.has(attempt._id)
                                ? "Hide"
                                : "Show"}{" "}
                              answers
                            </div>
                            {expandedAttempts.has(attempt._id) ? (
                              <ChevronUp className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-slate-400 group-hover:text-cyan-400 transition-colors" />
                            )}
                          </div>
                        </div>

                        {expandedAttempts.has(attempt._id) && (
                          <div className="px-6 pb-6 bg-slate-900/30">
                            <div className="grid gap-3">
                              {attempt.answers.map((ans, i) => (
                                <div
                                  key={ans.questionId}
                                  className="bg-slate-800/50 rounded-lg p-4 border border-slate-700/30"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-6 h-6 bg-cyan-400/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                      <span className="text-xs font-bold text-cyan-400">
                                        {i + 1}
                                      </span>
                                    </div>
                                    <div className="flex-1">
                                      <p className="text-cyan-400 font-semibold mb-1">
                                        {ans.questionText ||
                                          "Question not found"}
                                      </p>
                                      <p className="text-white leading-relaxed">
                                        {ans.studentAnswer}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
