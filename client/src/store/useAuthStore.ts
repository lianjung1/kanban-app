import { create } from "zustand";
import { persist } from "zustand/middleware";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AuthStore } from "../types/AuthStore";

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setIsAuthenticated: (isAuthenticated) => set({ isAuthenticated }),
      setUser: (user) => set({ user }),

      signup: async (user) => {
        try {
          const response = await axiosInstance.post("/auth/register", user);
          set({ user: response.data, isAuthenticated: true });
          toast.success("Account created");
        } catch (error) {
          toast.error("Error creating account");
          set({ user: null, isAuthenticated: false });
        }
      },

      login: async (user) => {
        try {
          const response = await axiosInstance.post("/auth/login", user);
          set({ user: response.data, isAuthenticated: true });
          toast.success("Login successful");
        } catch (error) {
          toast.error("Invalid credentials");
          set({ user: null, isAuthenticated: false });
        }
      },

      logout: async () => {
        try {
          await axiosInstance.post("/auth/logout");
          set({ user: null, isAuthenticated: false });
          toast.success("Logout successful");
        } catch (error) {
          set({ user: null, isAuthenticated: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);
