"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function StudentDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/student-dashboard/home");
  }, [router]);

  return <p className="text-white">Redirecting to Home...</p>;
}
