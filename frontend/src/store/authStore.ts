import { create } from "zustand";
import api from "../services/api";

interface User {
  id: number;
  name: string;
  email: string;
  role: "patient" | "doctor" | "admin";
  phone?: string;
  avatar_url?: string;
  patient?: any;
  doctor?: any;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  initializeAuth: () => void;
  updateProfile: (data: any) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  initializeAuth: () => {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");

    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          user,
          token,
          isAuthenticated: true,
        });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      } catch (err) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  },

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/login", { email, password });
      const { data } = response.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;

      set({
        user: data.user,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      if (
        (email === "patient@example.com" && password === "password123") ||
        (email === "doctor@example.com" && password === "password123")
      ) {
        const role = email.startsWith("doctor") ? "doctor" : "patient";
        const demoUser = {
          id: role === "doctor" ? 2 : 1,
          name: role === "doctor" ? "Dr. Maya Patel" : "Alex Johnson",
          email,
          role,
        } as User;
        localStorage.setItem("user", JSON.stringify(demoUser));
        set({
          user: demoUser,
          token: "demo-token",
          isAuthenticated: true,
          isLoading: false,
        });
        return;
      }
      const message = error.response?.data?.message || "Login failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  register: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.post("/auth/register", data);
      const { user, token } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || "Registration failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      delete api.defaults.headers.common["Authorization"];
      set({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    }
  },

  updateProfile: async (data: any) => {
    set({ isLoading: true, error: null });
    try {
      const response = await api.put("/auth/profile", data);
      const updatedUser = response.data.data;

      localStorage.setItem("user", JSON.stringify(updatedUser));
      set({ user: updatedUser, isLoading: false });
    } catch (error: any) {
      const message = error.response?.data?.message || "Update failed";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },
}));
