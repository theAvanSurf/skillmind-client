export interface User {
  email: string;
  name?: string;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  setLoading: (value: boolean) => void;
}
