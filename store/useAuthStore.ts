import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string | null;
  phone?: string | null;
  provider?: string;
  avatar?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
}

// 3. Tạo zustand store
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  setUser: (user) => set({ user }),
  setToken: (token) => set({ token }),
}));
