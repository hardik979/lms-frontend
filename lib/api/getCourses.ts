import { Course } from "@/types";
export const getCourses = async (): Promise<Course[]> => {
  const res = await fetch("http://localhost:5000/api/users/courses", {
    next: { revalidate: 60 }, // ISR if using App Router
  });
  const data = await res.json();
  return data.courses;
};
