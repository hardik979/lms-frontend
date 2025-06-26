// store/useRoleStore.ts
import { create } from "zustand";

type Role = "student" | "teacher" | "admin" | null;

type RoleStore = {
  role: Role;
  setRole: (role: Role) => void;
};

export const useRoleStore = create<RoleStore>((set) => ({
  role: null,
  setRole: (role) => set({ role }),
}));
