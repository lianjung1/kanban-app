import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { UserForm } from "../types/UserForm";
import { User } from "../types/User";
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
  isAuthenticated: false,
  setIsAuthenticated: (isAuthenticated: boolean) => set({ isAuthenticated }),

  user: null,
  setUser: (user: User) => set({ user }),

  signup: async (user: UserForm) => {
    try {
      const response = await axiosInstance.post("/auth/register", user);
      set({ user: response.data });
      set({ isAuthenticated: true });
      toast.success("Account created");
    } catch (error) {
      toast.error("Error creating account");
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },

  login: async (user: UserForm) => {
    try {
      const response = await axiosInstance.post("/auth/login", user);
      set({ user: response.data });
      set({ isAuthenticated: true });
      toast.success("Login successful");
    } catch (error) {
      toast.error("Invalid credentials");
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      set({ isAuthenticated: false });
      toast.success("Logout successful");
    } catch (error) {
      set({ user: null });
      set({ isAuthenticated: false });
    }
  },
}));
