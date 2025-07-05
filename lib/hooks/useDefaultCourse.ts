"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useSelectedCourseStore } from "@/store/useCourseStore";
import { API_BASE_URL } from "../api";

export function useActiveCourseId() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseIdFromURL = searchParams.get("courseId");

  const { getToken } = useAuth();
  const { courseId: courseIdFromStore, setCourseId } = useSelectedCourseStore();
  const [finalCourseId, setFinalCourseId] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      if (courseIdFromURL) {
        setFinalCourseId(courseIdFromURL);
        setCourseId(courseIdFromURL); // ✅ update Zustand
        return;
      }

      // ✅ Use Zustand store if exists
      if (courseIdFromStore) {
        setFinalCourseId(courseIdFromStore);
        router.replace(
          `${window.location.pathname}?courseId=${courseIdFromStore}`
        );
        return;
      }

      // 🧠 Fetch default if nothing is found
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/users/courses`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();

        // 🔥 Updated logic: exact match on title (case-sensitive)
        const jobAssistanceCourse =
          data.courses.find(
            (c: any) => c.title === "100% Job-Assistance Bootcamp"
          ) || data.courses[0]; // fallback to first course if not found

        if (jobAssistanceCourse) {
          setFinalCourseId(jobAssistanceCourse._id);
          setCourseId(jobAssistanceCourse._id);
          router.replace(
            `${window.location.pathname}?courseId=${jobAssistanceCourse._id}`
          );
        }
      } catch (err) {
        console.error("❌ Failed to fetch default course", err);
      }
    };

    init();
  }, [courseIdFromURL, courseIdFromStore, router, getToken, setCourseId]);

  return finalCourseId;
}
