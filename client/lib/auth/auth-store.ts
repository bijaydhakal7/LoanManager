import { create } from "zustand";
import type { User } from "@/lib/types";

type AuthState = {
  user: User | null;
  accessToken: string | null;
  isRestoring: boolean;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  setAuth: (token: string, user: User) => void;
  clearAuth: () => void;
  startRestoring: () => void;
  finishRestoring: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  isRestoring: true,
  setAccessToken: (token) => set({ accessToken: token }),
  setUser: (user) => set({ user }),
  setAuth: (token, user) => set({ accessToken: token, user }),
  clearAuth: () => set({ user: null, accessToken: null }),
  startRestoring: () => set({ isRestoring: true }),
  finishRestoring: () => set({ isRestoring: false }),
}));
