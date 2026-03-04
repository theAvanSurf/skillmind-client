import { useMutation } from "@tanstack/react-query";
import { ProfilesService } from "../services/profile-services";
import { sileo } from "sileo";

const profileServices = new ProfilesService();

export function useDeleteProfile() {
    return useMutation<void, unknown, string>({
        mutationKey: ["delete-profile"],
        mutationFn: async (id: string) => {
            return await sileo.promise(profileServices.deleteProfile(id), {
                loading: { title: "Deleting profile..." },
                success: { title: "Profile deleted" },
                error: (err: any) => ({
                    title: "Delete failed",
                    description: err.message || "Could not delete profile"
                })
            });
        },
    });
}
