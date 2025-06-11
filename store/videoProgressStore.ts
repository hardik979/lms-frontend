// stores/useSelectedCourseStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type Course = {
  _id: string;
  title: string;
  description?: string;
  // Add other fields if needed
};

type CourseStore = {
  selectedCourse: Course | null;
  setSelectedCourse: (course: Course) => void;
};

export const useSelectedCourseStore = create<CourseStore>()(
  persist(
    (set) => ({
      selectedCourse: null,
      setSelectedCourse: (course) => set({ selectedCourse: course }),
    }),
    {
      name: "selected-course", // stored in localStorage
    }
  )
);
