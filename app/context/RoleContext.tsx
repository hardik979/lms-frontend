"use client";

import { createContext, useContext } from "react";

export const RoleContext = createContext<{
  role: string;
}>({
  role: "student", // default fallback
});

export const useRole = () => useContext(RoleContext);
