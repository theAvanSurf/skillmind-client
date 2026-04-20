import axios, { AxiosError } from "axios";
import { AppConfiguration } from "@/configurations/app.config";
import { cookies } from "next/headers";

type ErrorResponseData = {
    message?: string;
    detail?: string | { msg: string }[];
    errorCode?: string;
    errors?: string[];
    statusCode?: number;
};

const extractMessage = (data: ErrorResponseData): string => {
    if (data.message) return data.message;
    if (typeof data.detail === "string") return data.detail;
    if (Array.isArray(data.detail)) return data.detail.map((e) => e.msg).join(", ");
    if (data.errors?.length) return data.errors.join(", ");
    return "Internal Server Error";
};

export const httpClient = axios.create({
    baseURL: AppConfiguration.API_URL,
    timeout: 0,
    headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.request.use(
    async (config) => {
        const cookieStore = await cookies();
        const token = cookieStore.get("token")?.value;
        const activeProfileId = cookieStore.get("activeProfileId")?.value;

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        if (activeProfileId) {
            config.headers["X-Profile-Id"] = activeProfileId;
        }

        if (process.env.NODE_ENV === "development" && process.env.DEBUG_HTTP === "1") {
            console.log("[httpClient] → REQUEST", {
                method: config.method?.toUpperCase(),
                url: `${config.baseURL}${config.url}`,
            });
        }

        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => {
        return response.data;
    },
    (error: AxiosError<ErrorResponseData>) => {
        const message = error.response?.data
            ? extractMessage(error.response.data)
            : error.message ?? "Internal Server Error";

        return Promise.reject(
            new AxiosError(message, String(error.response?.status ?? 500), error.config, error.request, error.response)
        );
    }
);

export default httpClient;
