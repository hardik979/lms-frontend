"use client";

import { IconMenu2 } from "@tabler/icons-react";
import { UserButton } from "@clerk/nextjs";

import { useRole } from "@/app/context/RoleContext";
import ShowCoursesDropdown from "./ShowCoursesDropdown";
import Link from "next/link";

export default function DashNav({
  toggleSidebar,
}: {
  toggleSidebar: () => void;
}) {
  const { role } = useRole();

  return (
    <header className="h-16 bg-cyan-950 border-b border-cyan-800 shadow-sm fixed top-0 left-0 right-0 z-50 flex items-center px-4 md:px-6">
      {/* Left Section: Hamburger + Logo */}
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="md:hidden text-white">
          <IconMenu2 size={28} />
        </button>
        <Link href={"/"}>
          {" "}
          <span className="text-lg font-bold text-white hidden md:block">
            <span className="text-yellow-400">IT</span> Jobs Factory
          </span>
        </Link>
      </div>

      {/* Center: Only for students */}
      {role === "student" && (
        <div className="flex-1 flex justify-start ml-40">
          <ShowCoursesDropdown />
        </div>
      )}

      {/* Right: User profile */}
      <div className="flex items-center gap-4">
        <UserButton />
      </div>
    </header>
  );
}
