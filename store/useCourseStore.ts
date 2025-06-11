import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseStore = {
  courseId: string | null;
  setCourseId: (id: string) => void;
};

export const useSelectedCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      courseId: "683047f0007b2b71a9a1f4da", // ✅ default on first load
      setCourseId: (id) => set({ courseId: id }),
    }),
    {
      name: "selected-course", // used in localStorage
    }
  )
);
