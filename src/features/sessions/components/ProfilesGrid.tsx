"use client";

import { Profile } from "@/features/profiles/components/profile";
import { useSession } from "@/features/sessions/hooks/useSession";

function ProfileSkeleton() {
    return (
        <div className="flex flex-col items-center gap-3">
            <div className="w-50 h-50 rounded-md bg-gray-700 animate-pulse" />
            <div className="h-4 w-20 rounded bg-gray-700 animate-pulse" />
        </div>
    );
}

function ErrorState({ message }: { message?: string }) {
    return (
        <div className="flex flex-col items-center gap-3 text-center text-red-400 py-6">
            <svg width="48" height="48" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm font-medium">
                {message ?? "Something went wrong. Please try again."}
            </p>
        </div>
    );
}

export function ProfilesGrid() {
    const { data, error, isLoading } = useSession();

    return (
        <>
            <div className="flex flex-wrap items-center justify-center gap-4 my-10">
                {isLoading ? (
                    Array.from({ length: 3 }).map((_, i) => (
                        <ProfileSkeleton key={i} />
                    ))
                ) : error ? (
                    <div className="w-full">
                        <ErrorState message={error?.message} />
                    </div>
                ) : !data?.profiles?.length ? (
                    <p className="text-gray-500 text-sm py-6">No profiles found.</p>
                ) : (
                    data.profiles.map((profile) => (
                        <Profile
                            key={profile.id}
                            ProfileName={profile.profileName}
                            ProfilePicture={profile.profilePhotoUrl}
                            isKids={profile.kidsProfile}
                            isDimmed={false}
                        />
                    ))
                )}

                {/* Add Profile — hidden while loading or on error */}
                {!isLoading && !error && (
                    <div className="group flex flex-col items-center gap-3 cursor-pointer select-none">
                        <div className="w-50 h-50 rounded-md border-2 border-gray-600 group-hover:border-white transition-all duration-200 flex items-center justify-center group-hover:-translate-y-2">
                            <svg
                                className="text-gray-600 group-hover:text-white transition-colors duration-200"
                                width="60"
                                height="60"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
                            </svg>
                        </div>
                        <p className="text-gray-600 group-hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide">
                            Add Profile
                        </p>
                    </div>
                )}
            </div>

            <button
                disabled={isLoading || !!error}
                className="bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white text-sm font-semibold tracking-[0.2em] uppercase px-8 py-2 rounded-xl transition-all duration-200 hover:scale-105 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
                Manage Profiles
            </button>
        </>
    );
}
