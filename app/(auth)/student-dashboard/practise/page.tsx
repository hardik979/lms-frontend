"use client";

import PracticeProblemList from "@/components/ui/PractiseProblemList";
import { useSelectedCourseStore } from "@/store/useCourseStore";

export default function PracticePage() {
  const courseId = useSelectedCourseStore((s) => s.courseId);

  if (!courseId) {
    return <div className="text-white p-8">No course selected</div>;
  }

  return (
    <div
      className="min-h-screen bg-cyan-950 rounded-2xl"
      style={{
        backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
        backgroundSize: "20px 20px",
      }}
    >
      <PracticeProblemList courseId={courseId} />
    </div>
  );
}
