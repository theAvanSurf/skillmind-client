import httpClient from "@/configurations/httpClient";
import { API_ENDPOINTS } from "@/shared/endpoints";
import { LoginAPIResponse, LoginRequest } from "@/features/auth/types/auth.types";
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest): Promise<NextResponse> {
    try {
        const body: LoginRequest = await req.json();
        const response = await httpClient.post<LoginAPIResponse>(API_ENDPOINTS.AUTH.LOGIN, body) as unknown as LoginAPIResponse;

        const res = NextResponse.json(response, { status: 200 });
        const userRole = response.roles?.find((role) => role.toLowerCase() === "professor");

        res.cookies.set("token", response.jwtToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });

        if (userRole) {
            res.cookies.set("userRole", userRole.toLowerCase(), {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "strict",
                maxAge: 60 * 60 * 24 * 7,
                path: "/",
            });
        } else {
            res.cookies.set("userRole", "", { maxAge: 0, path: "/" });
        }

        return res;
    } catch (err) {
        console.error("Login error type:", Object.prototype.toString.call(err));
        console.error("Login error:", err);

        if (axios.isAxiosError(err)) {
            const status = Number(err.code) || 500;
            return NextResponse.json(
                { message: err.message },
                { status: status >= 100 && status < 600 ? status : 500 }
            );
        }

        const message = err instanceof Error ? err.message : "Internal Server Error";
        return NextResponse.json({ message }, { status: 500 });
    }
}
