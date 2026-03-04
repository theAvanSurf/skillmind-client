"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { sileo } from "sileo";
import { Profile } from "@/features/profiles/components/profile";
import { useSession } from "@/features/sessions/hooks/useSession";
import { useRouter } from "next/navigation";

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
    const router = useRouter();
    const [isManaging, setIsManaging] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
            setIsLoggingOut(true);
            await sileo.promise(fetch("/api/auth/logout", { method: "POST" }), {
                loading: { title: "Logging out..." },
                success: { title: "See you soon!" },
                error: { title: "Logout failed" }
            });
            router.push("/login");
        } catch (error) {
            console.error("Logout failed:", error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return (
        <>
            <button
                disabled={isLoggingOut}
                onClick={handleLogout}
                className="fixed top-8 right-8 z-50 flex items-center gap-2 px-6 py-2.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 font-semibold tracking-wider text-xs uppercase transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg hover:shadow-red-500/30 disabled:opacity-40"
            >
                <LogOut size={16} />
                {isLoggingOut ? "Logging out..." : "Log off"}
            </button>

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
                    <div className="flex flex-col items-center gap-6 py-10">
                        <button onClick={() => router.push("/create-profile")} className="group flex flex-col items-center gap-3 cursor-pointer select-none">
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
                            <span className="text-gray-600 group-hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide">
                                Add Profile
                            </span>
                        </button>
                        <p className="text-gray-500 text-sm">No profiles yet. Add your first one!</p>
                    </div>
                ) : (
                    data.profiles.map((profile) => (
                        <Profile
                            key={profile.id}
                            ProfileName={profile.profileName}
                            ProfilePicture={profile.profilePhotoUrl}
                            isKids={profile.kidsProfile}
                            isDimmed={false}
                            isManaging={isManaging}
                            onClick={() => {
                                if (isManaging) {
                                    router.push(`/edit-profile/${profile.id}`);
                                } else {
                                    router.push(`/select-profile/${profile.id}`);
                                }
                            }}
                        />
                    ))
                )}

                {/* Add Profile — hidden while loading, on error, or when no profiles (empty state already shown above) */}
                {!isLoading && !error && !!data?.profiles?.length && (
                    <button onClick={() => router.push("/create-profile")} className="group flex flex-col items-center gap-3 cursor-pointer select-none">
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
                        <span className="text-gray-600 group-hover:text-white transition-colors duration-200 text-sm font-medium tracking-wide">
                            Add Profile
                        </span>
                    </button>
                )}
            </div>

            <button
                disabled={isLoading || !!error || !data?.profiles?.length}
                onClick={() => setIsManaging(prev => !prev)}
                className={`text-sm font-semibold tracking-[0.2em] uppercase px-8 py-2 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:scale-100 ${isManaging
                    ? "bg-white text-black hover:bg-gray-200"
                    : "bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white hover:scale-105"
                    }`}
            >
                {isManaging ? "Done" : "Manage Profiles"}
            </button>
        </>
    );
}
