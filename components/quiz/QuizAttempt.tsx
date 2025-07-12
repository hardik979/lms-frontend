"use client";
import { useState } from "react";

interface Question {
  _id: string;
  question: string;
  options: Record<string, string>;
}

interface Props {
  questions: Question[];
  selectedAnswers: Record<string, string>;
  setSelectedAnswers: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >;
  onSubmit: () => void;
  isSubmitting: boolean;
}

export default function QuizAttempt({
  questions,
  selectedAnswers,
  setSelectedAnswers,
  onSubmit,
  isSubmitting,
}: Props) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const current = questions[currentQuestion];

  const handleAnswer = (questionId: string, option: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Daily Quiz</h1>

      <p className="text-cyan-300 mb-2">
        Question {currentQuestion + 1} of {questions.length}
      </p>
      <h2 className="text-xl font-semibold">{current.question}</h2>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(current.options).map(([key, val]) => (
          <button
            key={key}
            onClick={() => handleAnswer(current._id, key)}
            className={`p-4 rounded-xl text-left border-2 transition-all ${
              selectedAnswers[current._id] === key
                ? "border-green-500 bg-green-800"
                : "border-gray-600 hover:border-cyan-400"
            }`}
          >
            <span className="font-bold mr-2">{key}.</span> {val}
          </button>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => setCurrentQuestion((prev) => Math.max(0, prev - 1))}
          className="px-4 py-2 bg-gray-700 rounded-md disabled:opacity-40"
          disabled={currentQuestion === 0}
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentQuestion((prev) =>
              Math.min(questions.length - 1, prev + 1)
            )
          }
          className="px-4 py-2 bg-cyan-600 rounded-md disabled:opacity-40"
          disabled={currentQuestion === questions.length - 1}
        >
          Next
        </button>
      </div>

      <div className="text-center mt-8">
        <button
          onClick={onSubmit}
          disabled={
            Object.keys(selectedAnswers).length !== questions.length ||
            isSubmitting
          }
          className="px-8 py-3 bg-green-600 rounded-xl font-bold text-white mt-4 disabled:bg-gray-600"
        >
          {isSubmitting
            ? "Submitting..."
            : `Submit Quiz (${Object.keys(selectedAnswers).length}/${
                questions.length
              })`}
        </button>
      </div>
    </div>
  );
}
