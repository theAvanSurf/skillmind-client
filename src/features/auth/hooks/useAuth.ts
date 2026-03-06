import { useMutation } from "@tanstack/react-query";
import { LoginAPIResponse, LoginRequest } from "@/features/auth/types/auth.types";
import AuthenticationServices from "@/features/auth/services/auth-services";

const authService = new AuthenticationServices();

export function useLogin() {
    return useMutation<LoginAPIResponse, Error, LoginRequest>({
        mutationFn: (request: LoginRequest) => authService.login(request),
        onSuccess: (data) => {
            console.log("Logged in!", data);
        },
        onError: (error) => {
            console.error("Login failed", error.message);
        },
    });
}