"use client";
// app/student-dashboard/layout.tsx
import Sidebar from "@/components/SidebarNew";
import DashNav from "@/components/DashNav";

export default function StudentDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-cyan-950 min-h-screen">
      <Sidebar isOpen={true} role="teacher" />{" "}
      {/* You can make it responsive later */}
      <div className="flex-1 md:ml-64">
        <DashNav toggleSidebar={() => {}} />
        <main className="mt-16 p-4">{children}</main>
      </div>
    </div>
  );
}
