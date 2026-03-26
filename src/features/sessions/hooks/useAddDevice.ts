import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddDeviceRequest, SessionResponse } from "@/features/sessions/types/session.types";
import SessionServices from "@/features/sessions/services/session-services";

const sessionService = new SessionServices();

export function useAddDevice() {
    const queryClient = useQueryClient();
    return useMutation<SessionResponse, Error, AddDeviceRequest>({
        mutationKey: ["session-add-device"],
        mutationFn: (body) => sessionService.addDevice(body),
        onSuccess: (updated) => {
            // Keep the cache fresh so ProfilesGrid reflects the new device immediately
            queryClient.setQueryData(["session"], updated);
        },
    });
}

export function useRemoveDevice() {
    const queryClient = useQueryClient();
    return useMutation<SessionResponse, Error, string>({
        mutationKey: ["session-remove-device"],
        mutationFn: (deviceId) => sessionService.removeDevice(deviceId),
        onSuccess: (updated) => {
            queryClient.setQueryData(["session"], updated);
        },
    });
}
