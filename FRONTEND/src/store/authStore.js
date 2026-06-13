import { create } from "zustand";
import axios from "axios";
import { toast } from "react-hot-toast";

const API = "http://localhost:4001";

const authHeader = () => ({
  headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
});

export const useAuth = create((set) => ({
  currentUser: null,
  loading: false,
  isAuthenticated: false,
  error: null,

  login: async (userCred) => {
    try {
      set({ loading: true, currentUser: null, isAuthenticated: false, error: null });
      const res = await axios.post(`${API}/auth/login`, userCred);
      if (res.status === 200) {
        localStorage.setItem("token", res.data.token);
        set({ currentUser: res.data.payload, loading: false, isAuthenticated: true, error: null });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      set({ loading: false, isAuthenticated: false, currentUser: null, error: errorMessage });
    }
  },

  logout: async () => {
    try {
      await axios.get(`${API}/auth/logout`, authHeader());
    } catch (_) {}
    localStorage.removeItem("token");
    set({ currentUser: null, isAuthenticated: false, error: null, loading: false });
  },

  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ currentUser: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      set({ loading: true });
      const res = await axios.get(`${API}/auth/check-auth`, authHeader());
      set({ currentUser: res.data.payload, isAuthenticated: true, loading: false });
    } catch (err) {
      localStorage.removeItem("token");
      set({ currentUser: null, isAuthenticated: false, loading: false });
    }
  },
}));
