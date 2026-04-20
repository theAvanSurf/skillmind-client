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
    timeout: 0,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

httpClientBrowser.interceptors.response.use(
    (response) => response.data,
    (error: AxiosError<ErrorResponseData>) => {
        if (error.response?.status === 401) {
            if (typeof window !== "undefined") {
                // httpOnly cookie can't be cleared via document.cookie — call server-side DELETE
                fetch("/api/sessions/select-profile", { method: "DELETE" }).finally(() => {
                    window.location.href = "/login";
                });
            }
        }

        const message = error.response?.data
            ? extractMessage(error.response.data)
            : error.message ?? "Internal Server Error";

        return Promise.reject(
            new AxiosError(message, String(error.response?.status ?? 500), error.config, error.request, error.response)
        );
    }
);

export default httpClientBrowser;