"use client";

import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import type { User } from "@/types/auth.types";

export function useAuth() {
  const { user, setUser, setLoading, loading } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);

    // TODO: Replace with real API call
    await new Promise((res) => setTimeout(res, 1000));

    if (email === "test@test.com" && password === "123456") {
      const authedUser: User = { email };
      setUser(authedUser);
      setLoading(false);
      router.push("/dashboard");
    } else {
      setLoading(false);
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (email: string, _password: string) => {
    setLoading(true);

    // TODO: Replace with real API call
    await new Promise((res) => setTimeout(res, 1000));

    const newUser: User = { email };
    setUser(newUser);
    setLoading(false);
    router.push("/dashboard");
  };

  const logout = () => {
    setUser(null);
    router.push("/login");
  };

  return {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
  };
}
