import { LoginAPIResponse, LoginRequest, SignUpRequest, SignUpResponse, ConfirmRequest, CreateProfessorProfileRequest } from "@/features/auth/types/auth.types";
import axios from "axios";

export default class AuthenticationServices {

    async login(request: LoginRequest): Promise<LoginAPIResponse> {
        const response = await axios.post<LoginAPIResponse>("/api/auth/login", request);
        return response.data;
    }

    async signUp(request: SignUpRequest): Promise<SignUpResponse> {
        const response = await axios.post<SignUpResponse>("/api/auth/sign-up", request);
        return response.data;
    }

    async confirmAccount(request: ConfirmRequest): Promise<void> {
        await axios.post("/api/auth/confirm", request);
    }

    async createProfessorProfile(request: CreateProfessorProfileRequest, token: string): Promise<void> {
        try {
            await axios.post("/api/professor/profile", request, {
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const data = error.response?.data as { Message?: string; message?: string } | undefined;
                const message = (data?.Message ?? data?.message ?? "").toLowerCase();

                // Core returns 400 when the profile already exists; treat as success.
                if (status === 400 && message.includes("already exists")) {
                    return;
                }
            }

            throw error;
        }
    }
}