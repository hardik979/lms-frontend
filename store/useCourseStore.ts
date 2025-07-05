import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseStore = {
  courseId: string | null;
  setCourseId: (id: string) => void;
};

export const useSelectedCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      courseId: "68678c7dd04068add6b440af", // ✅ default on first load
      setCourseId: (id) => set({ courseId: id }),
    }),
    {
      name: "selected-course", // used in localStorage
    }
  )
);
