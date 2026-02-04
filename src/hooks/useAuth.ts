"use client";

import { useAuthStore } from "src/store/auth.store";
import { useRouter } from "next/navigation";

export function useAuth() {
  const { setUser, setLoading, loading } = useAuthStore();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);

    // SIMULACIÓN BACKEND
    await new Promise((res) => setTimeout(res, 1000));

    // mock simple
    if (email === "test@test.com" && password === "123456") {
      setUser(email);
      setLoading(false);
      router.push("/community");
    } else {
      setLoading(false);
      throw new Error("Credenciales inválidas");
    }
  };

  const register = async (email: string, password: string) => {
    setLoading(true);

      void password;

    // SIMULACIÓN BACKEND
    await new Promise((res) => setTimeout(res, 1000));

    setUser(email);
    setLoading(false);
    router.push("/community");
  };

  return {
    login,
    register,
    loading,
  };
}
