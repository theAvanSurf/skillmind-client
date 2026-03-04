"use client"

import { useState, useEffect } from "react"
import { Pencil, Check, Baby, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Profile, ProfileTypes, CreateProfileRequest } from "@/features/profiles/types/profile.types"
import { useGetImages } from "@/shared/hooks/useGetImages"
import { useCreateProfile } from "@/features/profiles/hooks/useCreateProfile"
export default function AddProfileClient() {
    const router = useRouter()
    const { data: profileImages, isLoading, error } = useGetImages()
    const { mutate: createProfile, isPending: isCreating } = useCreateProfile()

    const [draftName, setDraftName] = useState("")
    const [draftAvatar, setDraftAvatar] = useState<string | undefined>(undefined)
    const [draftKids, setDraftKids] = useState(false)

    // Set initial avatar once profileImages are loaded AND if drafting a new profile
    useEffect(() => {
        if (profileImages && profileImages.length > 0 && draftAvatar === undefined) {
            setDraftAvatar(profileImages[0].secureUrl);
        }
    }, [profileImages, draftAvatar]);
    const [nameError, setNameError] = useState("")

    const validateName = (name: string): string => {
        const trimmed = name.trim()
        if (!trimmed) return "Profile name is required"
        if (trimmed.length < 2) return "At least 2 characters"
        if (trimmed.length > 20) return "Max 20 characters"
        return ""
    }

    function generateId() {
        return Math.random().toString(36).slice(2, 9)
    }

    const handleSave = () => {
        const err = validateName(draftName)
        if (err) { setNameError(err); return }

        if (!draftAvatar) {
            console.error("No avatar selected or loaded.");
            return;
        }

        const request: CreateProfileRequest = {
            ProfileName: draftName.trim(),
            ProfilePhotoUrl: draftAvatar,
            ProfileType: draftKids ? ProfileTypes.Kids : ProfileTypes.Adult,
            KidsProfile: draftKids,
        }

        createProfile(request, {
            onSuccess: () => {
                router.push('/select-profile')
            },
            onError: (err) => {
                console.error("Failed to create profile:", err)
                // Optionally set a specialized error state here
            }
        })
    }

    return (
        <div className="max-w-lg mx-auto py-10 space-y-6">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-8 shadow-2xl shadow-black/30 backdrop-blur-2xl space-y-6">

                {/* Header */}
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white">Add Profile</h2>
                    <p className="mt-1 text-xs text-white/40">
                        Fill in the details below to create a new profile.
                    </p>
                </div>

                {/* Avatar preview — centered */}
                <div className="flex flex-col items-center gap-3">
                    <div className="relative">
                        <div className="h-24 w-24 overflow-hidden rounded-full border-2 border-white/15 bg-white/6 flex items-center justify-center">
                            {isLoading ? (
                                <div className="h-full w-full bg-gray-700 animate-pulse" />
                            ) : draftAvatar ? (
                                <img src={draftAvatar} alt="Selected avatar" className="h-full w-full object-cover" />
                            ) : (
                                <span className="text-white/20 text-xs text-center px-2">No Image</span>
                            )}
                        </div>
                        <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg ring-2 ring-[#0a0a0f]">
                            <Pencil size={11} className="text-white" />
                        </span>
                    </div>
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-white/35">Avatar</p>
                </div>

                {/* Avatar Grid */}
                <div>
                    <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/35 text-center">
                        Choose Avatar
                    </p>
                    {error ? (
                        <p className="text-sm text-red-400 text-center py-4">Failed to load avatars.</p>
                    ) : (
                        <div className="grid grid-cols-6 gap-2">
                            {isLoading
                                ? Array.from({ length: 6 }).map((_, i) => (
                                    <div key={i} className="aspect-square rounded-full bg-gray-700 animate-pulse border-2 border-transparent" />
                                ))
                                : profileImages?.map((image) => (
                                    <button
                                        key={image.publicId}
                                        type="button"
                                        onClick={() => setDraftAvatar(image.secureUrl)}
                                        className={`relative overflow-hidden rounded-full border-2 transition-all ${draftAvatar === image.secureUrl
                                            ? "border-blue-500 shadow-md shadow-blue-500/30"
                                            : "border-white/10 hover:border-white/30"
                                            }`}
                                    >
                                        <img src={image.secureUrl} alt="" className="h-full w-full object-cover aspect-square" />
                                        {draftAvatar === image.secureUrl && (
                                            <span className="absolute inset-0 flex items-center justify-center bg-blue-500/20">
                                                <Check size={14} className="text-white drop-shadow" />
                                            </span>
                                        )}
                                    </button>
                                ))
                            }
                        </div>
                    )}
                </div>

                {/* Profile Name */}
                <div>
                    <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/35">
                        Profile Name
                    </label>
                    <input
                        type="text"
                        value={draftName}
                        maxLength={21}
                        onChange={(e) => { setDraftName(e.target.value); setNameError("") }}
                        onBlur={() => setNameError(validateName(draftName))}
                        placeholder="e.g. Sabrina"
                        className={`w-full rounded-xl border px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition bg-white/6 focus:bg-white/9 focus:ring-2 ${nameError
                            ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/15"
                            : "border-white/10 focus:border-blue-500/50 focus:ring-blue-500/15"
                            }`}
                    />
                    {nameError && <p className="mt-1 text-xs text-red-400">{nameError}</p>}
                </div>

                {/* Kids toggle */}
                <div className="flex items-start justify-between gap-4 rounded-xl border border-white/6 bg-white/3 p-4">
                    <div className="flex items-start gap-3">
                        <Baby size={18} className="mt-0.5 shrink-0 text-blue-400/70" />
                        <div>
                            <p className="text-sm font-medium text-white/80">Kids Profile</p>
                            <p className="mt-0.5 text-xs text-white/35">
                                Shows age-appropriate content with a simplified interface
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={() => setDraftKids((k) => !k)}
                        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full border transition-all ${draftKids ? "border-blue-500/50 bg-blue-500" : "border-white/15 bg-white/10"
                            }`}
                    >
                        <span
                            className={`absolute top-0.5 block h-5 w-5 rounded-full bg-white shadow transition-transform ${draftKids ? "translate-x-5" : "translate-x-0.5"
                                }`}
                        />
                    </button>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="flex-1 rounded-xl border border-white/10 py-3 text-sm font-medium text-white/50 transition hover:border-white/20 hover:text-white/70"
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        disabled={isCreating}
                        className="flex-1 rounded-xl bg-linear-to-r from-blue-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isCreating ? "Creating..." : "Add Profile"}
                    </button>
                </div>
            </div>
        </div>
    )
}
