import React from "react";

type Difficulty = "easy" | "medium" | "hard";

interface Props {
  onSelect: (difficulty: Difficulty) => void;
}

export default function DifficultySelector({ onSelect }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 mt-6">
      <h2 className="text-2xl font-bold">Choose Difficulty Level</h2>
      <div className="flex gap-4">
        {(["easy", "medium", "hard"] as Difficulty[]).map((level) => (
          <button
            key={level}
            onClick={() => onSelect(level)}
            className={`px-6 py-3 rounded-xl text-lg font-semibold shadow-lg
              ${
                level === "easy"
                  ? "bg-green-600 hover:bg-green-700"
                  : level === "medium"
                  ? "bg-yellow-600 hover:bg-yellow-700"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {level.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}
