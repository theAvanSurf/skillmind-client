import { useCallback, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getDeviceId } from "@/utils/deviceId";

export function useSignOut() {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);

    const signOut = useCallback(async () => {
        setIsLoading(true);
        try {
            // 1. Remove this device from the backend Redis session so it cleans up properly.
            //    If this is the last device, the backend will delete the session entirely.
            const deviceId = getDeviceId();
            if (deviceId) {
                await fetch(`/api/sessions/devices/${deviceId}`, {
                    method: "DELETE",
                }).catch(() => {
                    // Non-fatal — continue with local sign-out even if this fails
                });
            }

            // 2. Wipe all cached queries so no stale data leaks after logout
            queryClient.clear();

            // 3. Clear client-accessible cookies
            document.cookie = "activeProfileId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

            // 4. Server route clears httpOnly token cookie and redirects
            await fetch("/api/auth/signout", { method: "POST", redirect: "manual" });

            window.location.href = "/login";
        } catch {
            window.location.href = "/login";
        } finally {
            setIsLoading(false);
        }
    }, [queryClient]);

    return { signOut, isLoading };
}

