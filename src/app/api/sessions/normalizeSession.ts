import type { Profile } from "@/features/profiles/types/profile.types";
import type { Session } from "@/types/session.types";
import type { Device } from "@/types/session.types";

type UnknownRecord = Record<string, unknown>;

function asRecord(value: unknown): UnknownRecord | null {
    return value !== null && typeof value === "object" ? (value as UnknownRecord) : null;
}

function asString(value: unknown, fallback = ""): string {
    return typeof value === "string" ? value : fallback;
}

function asBoolean(value: unknown, fallback = false): boolean {
    return typeof value === "boolean" ? value : fallback;
}

function normalizeProfile(value: unknown): Profile | null {
    const record = asRecord(value);
    if (!record) return null;

    const id = asString(record.id);
    if (!id) return null;

    const profileType =
        typeof record.profileType === "number"
            ? record.profileType
            : 0;

    return {
        id,
        userId: asString(record.userId),
        profileName: asString(record.profileName, "Profile"),
        profilePhotoUrl: asString(record.profilePhotoUrl),
        profileType,
        kidsProfile: asBoolean(record.kidsProfile),
    };
}

function normalizeConnectedDevices(value: unknown): Device[] {
    if (!Array.isArray(value)) return [];

    return value
        .map((entry) => {
            const record = asRecord(entry);
            if (!record) return null;

            const deviceId = asString(record.deviceId);
            const profileId = asString(record.profileId);

            if (!deviceId || !profileId) return null;
            return { deviceId, profileId };
        })
        .filter((entry): entry is NonNullable<typeof entry> => entry !== null);
}

function pickSessionPayload(raw: unknown): UnknownRecord {
    const direct = asRecord(raw);
    if (!direct) return {};

    const data = asRecord(direct.data);
    if (data) return data;

    return direct;
}

export function normalizeSession(raw: unknown): Session {
    const payload = pickSessionPayload(raw);

    const profiles = Array.isArray(payload.profiles)
        ? payload.profiles
              .map(normalizeProfile)
              .filter((profile): profile is Profile => profile !== null)
        : [];

    const connectedDevices = normalizeConnectedDevices(payload.connectedDevices);

    return {
        sessionId: asString(payload.sessionId),
        userId: asString(payload.userId),
        profiles,
        connectedDevices,
        connectedDevicesCount:
            typeof payload.connectedDevicesCount === "number"
                ? payload.connectedDevicesCount
                : connectedDevices.length,
        createdAt: asString(payload.createdAt),
        expiresAt: asString(payload.expiresAt),
    };
}
