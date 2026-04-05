import axios, { AxiosError } from "axios";

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

export const httpClientBrowser = axios.create({
    baseURL: "/api",
    timeout: 10000,
    headers: { "Content-Type": "application/json" },
});

httpClientBrowser.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<ErrorResponseData>) => {
        const message = error.response?.data
            ? extractMessage(error.response.data)
            : error.message ?? "Internal Server Error";

        return Promise.reject(
            new AxiosError(message, String(error.response?.status ?? 500), error.config, error.request, error.response)
        );
    }
);

export default httpClientBrowser;