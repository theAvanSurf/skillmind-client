import { useMutation } from "@tanstack/react-query";
import { UpdateProfileRequest, Profile } from "../types/profile.types";
import { ProfilesService } from "../services/profile-services";
import { sileo } from "sileo";

const profileServices = new ProfilesService();

export function useUpdateProfile() {
    return useMutation<Profile, unknown, { id: string; request: UpdateProfileRequest }>({
        mutationKey: ["update-profile"],
        mutationFn: async ({ id, request }) => {
            return await sileo.promise(profileServices.updateProfile(id, request), {
                loading: { title: "Updating profile..." },
                success: { title: "Profile updated!" },
                error: (err: any) => ({
                    title: "Update failed",
                    description: err.message || "Could not update profile"
                })
            });
        },
    });
}
