const DEVICE_ID_KEY = "skillmind:deviceId";

/**
 * Returns a stable device ID for this browser, creating and persisting one
 * in localStorage if none exists yet.
 */
export function getOrCreateDeviceId(): string {
    if (typeof window === "undefined") return "";
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
        id = crypto.randomUUID();
        localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
}

export function getDeviceId(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(DEVICE_ID_KEY);
}
