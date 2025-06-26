"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";
import { useRoleStore } from "@/store/useRoleStore";

export default function RedirectPage() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const router = useRouter();
  const setRole = useRoleStore((s) => s.setRole);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const checkAndRedirect = async () => {
      const token = await getToken();
      if (!token) return;

      // Optional: sync user to DB
      await fetch("http://localhost:5000/api/users/sync", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      const res = await fetch("http://localhost:5000/api/users/me", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      setRole(data.role);

      if (data.role === "student") {
        router.replace("/student-dashboard/home");
      } else if (data.role === "teacher") {
        router.replace("/teacher-dashboard/Courseupload");
      } else if (data.role === "admin") {
        router.replace("/admin-dashboard");
      } else {
        router.replace("/unauthorized"); // fallback
      }
    };

    checkAndRedirect();
  }, [getToken, isLoaded, isSignedIn, router, setRole]);

  return <LoadingPage />;
}
