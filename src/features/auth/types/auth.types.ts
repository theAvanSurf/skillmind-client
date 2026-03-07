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

export interface SignUpRequest {
    Name: string;
    LastName: string;
    UserName: string;
    Email: string;
    Password: string;
    BirthDate: string;
    PhoneNumber: string;
    Country: string;
    AccountTypes: number;
    Role: number;
}

export interface SignUpResponse {
    id: string;
    name: string;
    lastName: string;
    email: string;
    username: string;
    isVerified: string;
    hasError: string;
    errors: string[];
}

export interface ConfirmRequest {
    UserId: string;
    Code: string;
}