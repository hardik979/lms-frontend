"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import {
  IconChevronLeft,
  IconChevronRight,
  IconList,
} from "@tabler/icons-react";

type SolveLayoutProps = {
  title: string;
  difficulty: "easy" | "medium" | "hard";
  isSolved: boolean;
  children: React.ReactNode;
  onPrev?: () => void;
  onNext?: () => void;
  disablePrev?: boolean;
  disableNext?: boolean;
  allQuestions: { _id: string; title: string }[];
};

export default function SolveLayout({
  title,
  difficulty,
  isSolved,
  children,
  onPrev,
  onNext,
  disablePrev,
  disableNext,
  allQuestions,
}: SolveLayoutProps) {
  const router = useRouter();
  const difficultyColor =
    difficulty === "easy"
      ? "bg-green-100 text-green-700"
      : difficulty === "medium"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-red-100 text-red-700";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b bg-cyan-950 shadow-sm">
        <div className="flex  items-center gap-3">
          <button onClick={() => router.back()}>
            <IconChevronLeft
              className="text-neutral-100 hover:text-black hover:bg-white p-1 rounded-full"
              size={20}
            />
          </button>
          <h1 className="text-lg font-semibold text-neutral-100">{title}</h1>
          <Badge className={difficultyColor + " capitalize"}>
            {difficulty}
          </Badge>
          <Badge
            className={
              isSolved
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-600"
            }
          >
            {isSolved ? "Solved" : "Unsolved"}
          </Badge>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1"
            >
              <IconList size={16} />
              All Questions
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">All Questions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allQuestions.map((q) => (
                <Button
                  key={q._id}
                  variant="outline"
                  className="justify-start text-left"
                  onClick={() => router.push(`/solve/${q._id}`)}
                >
                  {q.title}
                </Button>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Bottom Navigation */}
      <div className="flex justify-between items-center px-6 py-4 border-t bg-cyan-950 shadow-md">
        <Button
          disabled={disablePrev}
          onClick={onPrev}
          variant="secondary"
          className="flex items-center gap-1"
        >
          <IconChevronLeft size={16} />
          Previous
        </Button>

        <Button
          disabled={disableNext}
          onClick={onNext}
          variant="secondary"
          className="flex items-center gap-1"
        >
          Next
          <IconChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
}
