import axios from "axios";

function handle401Redirect() {
  if (typeof window === "undefined") return;
  const path = window.location.pathname;
  if (path.startsWith("/login") || path.startsWith("/sign-up") || path.startsWith("/confirm")) return;
  // httpOnly cookie requires server-side DELETE — document.cookie can't touch it
  fetch("/api/sessions/select-profile", { method: "DELETE" }).finally(() => {
    window.location.href = "/login";
  });
}

function extractErrorMessage(error: any): string {
  const data = error.response?.data;
  if (!data) return error.message || "Something went wrong";
  const errors: string[] = data.errors ?? (Array.isArray(data) ? data : []);
  if (errors.length > 0) return errors.join("\n");
  return data.message || error.message || "Something went wrong";
}

// Global interceptor covers all raw axios.* calls (profile-services, session-services, etc.)
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) handle401Redirect();
    return Promise.reject(new Error(extractErrorMessage(error)));
  }
);

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) handle401Redirect();
    return Promise.reject(new Error(extractErrorMessage(error)));
  }
);
