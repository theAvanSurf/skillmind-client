const DEVICE_ID_KEY = "skillmind.deviceId";

function createDeviceId(): string {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
        return crypto.randomUUID();
    }

    return `device-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function getOrCreateDeviceId(): string {
    if (typeof window === "undefined") {
        return "server-device";
    }

    const existing = window.localStorage.getItem(DEVICE_ID_KEY);
    if (existing) return existing;

    const id = createDeviceId();
    window.localStorage.setItem(DEVICE_ID_KEY, id);
    return id;
}
