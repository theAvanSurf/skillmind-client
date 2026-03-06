"use client"

import { useState, useEffect } from "react"
import { Pencil, Check, Baby, Trash2, ChevronLeft, Save } from "lucide-react"
import { useRouter } from "next/navigation"
import { useGetImages } from "@/shared/hooks/useGetImages"
import { useSession } from "@/features/sessions/hooks/useSession"
import { ProfileTypes, CreateProfileRequest, UpdateProfileRequest } from "@/features/profiles/types/profile.types"
import { useUpdateProfile } from "@/features/profiles/hooks/useUpdateProfile"
import { useDeleteProfile } from "@/features/profiles/hooks/useDeleteProfile"

interface EditProfileClientProps {
    profileId: string;
}

export default function EditProfileClient({ profileId }: EditProfileClientProps) {
    const router = useRouter()
    const { data: profileImages, isLoading: imagesLoading } = useGetImages()
    const { data: sessionData, isLoading: sessionLoading } = useSession()
    const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile()
    const { mutate: deleteProfile, isPending: isDeleting } = useDeleteProfile()
    const profile = sessionData?.profiles?.find(p => String(p.id) === String(profileId))
    const [draftName, setDraftName] = useState("")
    const [draftAvatar, setDraftAvatar] = useState<string | undefined>(undefined)
    const [draftKids, setDraftKids] = useState(false)
    const [nameError, setNameError] = useState("")

    useEffect(() => {
        if (profile) {
            setDraftName(profile.profileName)
            setDraftAvatar(profile.profilePhotoUrl)
            setDraftKids(profile.kidsProfile)
        }
    }, [profile])

    if (sessionLoading) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
            </div>
        )
    }

    if (!profile && !sessionLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <h2 className="text-xl text-white font-semibold">Profile not found</h2>
                <button onClick={() => router.back()} className="text-blue-400 hover:underline">Back to Profiles</button>
            </div>
        )
    }

    const validateName = (name: string): string => {
        const trimmed = name.trim()
        if (!trimmed) return "Profile name is required"
        if (trimmed.length < 2) return "At least 2 characters"
        return ""
    }

    const handleSave = () => {
        const err = validateName(draftName)
        if (err) { setNameError(err); return }

        if (!draftAvatar) return;

        const request: UpdateProfileRequest = {
            ProfileName: draftName.trim(),
            ProfilePhotoUrl: draftAvatar,
            ProfileType: draftKids ? ProfileTypes.Kids : ProfileTypes.Adult,
            KidsProfile: draftKids
        }

        updateProfile({ id: profileId, request }, {
            onSuccess: () => router.push('/select-profile'),
            onError: (err) => console.error("Update failed:", err)
        })
    }

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this profile?")) return;

        deleteProfile(profileId, {
            onSuccess: () => router.push('/select-profile'),
            onError: (err) => console.error("Delete failed:", err)
        })
    }

    return (
        <div className="max-w-4xl mx-auto py-8 px-4">
            <button
                onClick={() => router.back()}
                className="group mb-8 flex items-center gap-2 text-white/50 hover:text-white transition-colors"
            >
                <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="flex flex-col lg:flex-row gap-10">
                <div className="lg:w-1/3 flex flex-col items-center">
                    <div className="relative group/avatar">
                        <div className="h-48 w-48 overflow-hidden rounded-2xl border-4 border-white/10 bg-white/5 shadow-2xl transition-all group-hover/avatar:border-blue-500/50">
                            {draftAvatar ? (
                                <img src={draftAvatar} alt="Profile" className="h-full w-full object-cover" />
                            ) : (
                                <div className="h-full w-full bg-gray-800 animate-pulse" />
                            )}
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/avatar:opacity-100 transition-opacity flex items-center justify-center">
                                <Pencil size={32} className="text-white" />
                            </div>
                        </div>
                    </div>
                    <div className="mt-6 text-center">
                        <h1 className="text-3xl font-bold text-white mb-2">{profile?.profileName}</h1>
                        <p className="text-white/40 text-sm">Update your settings and appearance</p>
                    </div>
                </div>

                <div className="flex-1 space-y-8">
                    <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                            General Settings
                        </h3>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-white/30 mb-2">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={draftName}
                                    onChange={(e) => { setDraftName(e.target.value); setNameError("") }}
                                    className={`w-full bg-white/5 border rounded-xl px-4 py-3 text-white outline-none transition-all focus:ring-2 ${nameError ? 'border-red-500/50 focus:ring-red-500/20' : 'border-white/10 focus:border-blue-500/50 focus:ring-blue-500/20'
                                        }`}
                                />
                                {nameError && <p className="mt-2 text-xs text-red-400">{nameError}</p>}
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/5">
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-lg ${draftKids ? 'bg-orange-500/20 text-orange-500' : 'bg-blue-500/20 text-blue-500'}`}>
                                        <Baby size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-white">Kids Profile</p>
                                        <p className="text-xs text-white/40">Only show G-rated content</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setDraftKids(!draftKids)}
                                    className={`relative h-6 w-12 rounded-full transition-all border ${draftKids ? 'bg-orange-500 border-orange-400' : 'bg-white/10 border-white/10'
                                        }`}
                                >
                                    <div className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${draftKids ? 'left-6' : 'left-0.5'
                                        }`} />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-white/8 bg-white/4 p-6 backdrop-blur-md">
                        <h3 className="text-lg font-semibold text-white mb-4">Select New image</h3>
                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                            {imagesLoading ? (
                                Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-xl bg-white/5 animate-pulse" />
                                ))
                            ) : (
                                profileImages?.map((img) => (
                                    <button
                                        key={img.publicId}
                                        onClick={() => setDraftAvatar(img.secureUrl)}
                                        className={`relative aspect-square rounded-xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${draftAvatar === img.secureUrl ? 'border-blue-500 shadow-lg shadow-blue-500/20' : 'border-transparent hover:border-white/20'
                                            }`}
                                    >
                                        <img src={img.secureUrl} className="h-full w-full object-cover" alt="" />
                                        {draftAvatar === img.secureUrl && (
                                            <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                                <Check size={16} className="text-white" />
                                            </div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                        <button
                            onClick={handleSave}
                            disabled={isUpdating || isDeleting}
                            className="w-full sm:flex-1 bg-white text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Save size={18} />
                            {isUpdating ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isUpdating || isDeleting}
                            className="w-full sm:w-auto px-8 py-4 border border-red-500/20 text-red-500 font-semibold rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Trash2 size={18} />
                            {isDeleting ? "Deleting..." : "Delete Profile"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
