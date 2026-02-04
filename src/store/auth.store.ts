import { create } from "zustand";

type AuthState = {
  user: string | null;
  loading: boolean;
  setUser: (email: string | null) => void;
  setLoading: (value: boolean) => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  setUser: (user) => set({ user }),
  setLoading: (loading) => set({ loading }),
}));
