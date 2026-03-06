import {LoginAPIResponse, LoginRequest} from "@/features/auth/types/auth.types";
import axios from "axios";

export default class AuthenticationServices{

    async login(request: LoginRequest): Promise<LoginAPIResponse> {
        const response = await axios.post<LoginAPIResponse>("/api/auth/login", request);
        return response.data;
    }
}