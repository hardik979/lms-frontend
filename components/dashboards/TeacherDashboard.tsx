"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function TeacherDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/teacher-dashboard/upload");
  }, [router]);

  return <p className="text-white">Redirecting to Upload Page...</p>;
}
