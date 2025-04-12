import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { UserForm } from "../types/UserForm";
import { User } from "../types/User";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  user: null,
  setUser: (user: User) => set({ user }),

  signup: async (user: UserForm) => {
    try {
      const response = await axiosInstance.post("/auth/register", user);
      set({ user: response.data.user });
      set({ isAuthenticated: true });
    } catch (error) {
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },

  login: async (user: UserForm) => {
    try {
      const response = await axiosInstance.post("/auth/login", user);
      set({ user: response.data.user });
      set({ isAuthenticated: true });
    } catch (error) {
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      set({ isAuthenticated: false });
    } catch (error) {
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },
}));
