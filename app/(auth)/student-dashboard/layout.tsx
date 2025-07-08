"use client";

import { Montserrat } from "next/font/google";
import Sidebar from "@/components/SidebarNew";
import DashNav from "@/components/DashNav";
import { useState } from "react";

const montserrat = Montserrat({ subsets: ["latin"] });

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex bg-slate-800 min-h-screen">
      <Sidebar
        isOpen={sidebarOpen}
        role="student"
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 overflow-y-auto max-h-screen">
        <DashNav toggleSidebar={() => setSidebarOpen(true)} />

        <main className={`mt-16 p-4 ${montserrat.className}`}>{children}</main>
      </div>
    </div>
  );
}
