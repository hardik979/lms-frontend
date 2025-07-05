"use client";
// app/teacher-dashboard/layout.tsx
import Sidebar from "@/components/SidebarNew";
import DashNav from "@/components/DashNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";
import { useRoleStore } from "@/store/useRoleStore";
import { API_BASE_URL } from "@/lib/api";
export default function TeacherDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const [authorized, setAuthorized] = useState(false);
  const role = useRoleStore((state) => state.role);
  const setRole = useRoleStore((state) => state.setRole);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const checkRole = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        const res = await fetch(`${API_BASE_URL}/api/users/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        setRole(data.role); // set in global state

        if (data.role !== "teacher") {
          router.replace("/student-dashboard/home"); // 👈 Redirect students
        } else {
          setAuthorized(true);
        }
      } catch (error) {
        console.error("Role check failed", error);
        router.replace("/student-dashboard/home");
      }
    };

    checkRole();
  }, [isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn || !authorized) return <LoadingPage />;
  return (
    <div className="flex bg-cyan-950 min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        role="teacher"
        onClose={() => setSidebarOpen(false)}
      />{" "}
      {/* You can make it responsive later */}
      <div className="flex-1 overflow-y-auto max-h-screen">
        <DashNav toggleSidebar={() => setSidebarOpen(true)} />
        <main className="mt-16 p-4">{children}</main>
      </div>
    </div>
  );
}
