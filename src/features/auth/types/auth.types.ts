export interface LoginRequest {
    userName: string;
    password: string;
}

export interface LoginAPIResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    roles: string[];
    isVerified: boolean;
    jwtToken: string;
    refreshToken: string;
}