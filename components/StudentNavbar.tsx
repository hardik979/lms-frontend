"use client";
import { useUser, SignOutButton, UserButton } from "@clerk/nextjs";
import { IconSearch, IconLogout } from "@tabler/icons-react";
import { useState } from "react";

export default function StudentNavbar() {
  const [query, setQuery] = useState("");

  return (
    <nav className="w-full bg-cyan-50 border-b px-6 py-4 flex justify-between items-center shadow-sm">
      {/* Search bar */}
      <div className="flex-1 mx-6 max-w-xl">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full border border-cyan-600 rounded-md px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
          <IconSearch className="absolute left-3 top-2.5 text-gray-400 h-5 w-5" />
        </div>
      </div>

      {/* User and Logout */}
      <div className="flex items-center gap-7">
        <UserButton
          appearance={{
            elements: {
              avatarBox: "h-12 w-12 border border-cyan-600",
            },
          }}
        />

        {/* Logout Button */}
        <SignOutButton>
          <button className="flex items-center gap-1 px-3 py-2 rounded bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium">
            <IconLogout className="h-4 w-4" />
            Logout
          </button>
        </SignOutButton>
      </div>
    </nav>
  );
}
