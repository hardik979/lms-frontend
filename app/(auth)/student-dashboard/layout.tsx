"use client";

import { Montserrat } from "next/font/google";
import Sidebar from "@/components/SidebarNew";
import DashNav from "@/components/DashNav";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import LoadingPage from "@/components/Loader";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { getToken, isLoaded, isSignedIn } = useAuth(); // ⬅️ added isLoaded
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return; // ⬅️ wait for Clerk auth

    const checkRoleAndRedirect = async () => {
      try {
        const token = await getToken();
        if (!token) return;

        await fetch("http://localhost:5000/api/users/sync", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const res = await fetch("http://localhost:5000/api/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (data.role === "teacher") {
          router.replace("/teacher-dashboard/Courseupload");
        } else {
          setAuthorized(true);
        }
      } catch (err) {
        console.error("Auth check failed", err);
      } finally {
        setLoading(false);
      }
    };

    checkRoleAndRedirect();
  }, [getToken, isLoaded, isSignedIn, router]);

  //  Don't render anything until role check finishes
  if (loading || !isLoaded || !isSignedIn) return <LoadingPage />;
  if (!authorized) return null;

  return (
    <div
      className="flex bg-cyan-50 min-h-screen"
      style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.04) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.04) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
      }}
    >
      <Sidebar isOpen={true} role="student" />
      <div className="flex-1 md:ml-64">
        <DashNav toggleSidebar={() => {}} />
        <main className={`mt-16 p-4 ${montserrat.className}`}>{children}</main>
      </div>
    </div>
  );
}
