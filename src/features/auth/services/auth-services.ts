import { LoginAPIResponse, LoginRequest, SignUpRequest, SignUpResponse, ConfirmRequest } from "@/features/auth/types/auth.types";
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
}