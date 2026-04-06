import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export interface ProfessorAuthState {
  isProfessor: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useProfessorAuth(): ProfessorAuthState {
  const [state, setState] = useState<ProfessorAuthState>({
    isProfessor: false,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    const checkProfessorRole = async () => {
      try {
        // In a real app, you'd check the user's role from auth/session
        // For now, we check if userRole cookie is set to "professor"
        const userRole = document.cookie
          .split("; ")
          .find((row) => row.startsWith("userRole="))
          ?.split("=")[1];

        const isProfessor = userRole === "professor";

        if (!isProfessor) {
          router.push("/");
          setState({
            isProfessor: false,
            isLoading: false,
            error: "Unauthorized: Professor access required",
          });
        } else {
          setState({
            isProfessor: true,
            isLoading: false,
            error: null,
          });
        }
      } catch (err) {
        setState({
          isProfessor: false,
          isLoading: false,
          error: err instanceof Error ? err.message : "Auth check failed",
        });
      }
    };

    void checkProfessorRole();
  }, [router]);

  return state;
}
