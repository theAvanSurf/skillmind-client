/** NestJS returns PascalCase — normalise to the camelCase the client expects */

export function normalizeSession(raw: any) {
    const normalizeProfile = (p: any) => ({
        id: p?.Id ?? p?.id ?? "",
        userId: p?.UserId ?? p?.userId ?? "",
        profileName: p?.ProfileName ?? p?.profileName ?? "",
        profilePhotoUrl: p?.ProfilePhotoUrl ?? p?.profilePhotoUrl ?? "",
        profileType: p?.ProfileType ?? p?.profileType ?? 0,
        kidsProfile: p?.KidsProfile ?? p?.kidsProfile ?? false,
    });

    const normalizeDevice = (d: any) => ({
        deviceId: d?.DeviceId ?? d?.deviceId ?? "",
        profileId: d?.ProfileId ?? d?.profileId ?? "",
    });

    return {
        sessionId: raw?.SessionId ?? raw?.sessionId ?? "",
        userId: raw?.UserId ?? raw?.userId ?? "",
        profiles: (raw?.Profiles ?? raw?.profiles ?? []).map(normalizeProfile),
        connectedDevices: (raw?.ConnectedDevices ?? raw?.connectedDevices ?? []).map(normalizeDevice),
        connectedDevicesCount: raw?.ConnectedDevicesCount ?? raw?.connectedDevicesCount ?? 0,
        sessionJwtToken: raw?.SessionJwtToken ?? raw?.sessionJwtToken ?? null,
        createdAt: raw?.CreatedAt ?? raw?.createdAt ?? "",
        expiresAt: raw?.ExpiresAt ?? raw?.expiresAt ?? "",
    };
}
