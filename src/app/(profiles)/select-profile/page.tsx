import { ProfilesGrid } from "@/features/sessions/components/ProfilesGrid";

export default function ProfilesSelector() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen px-4">
            <div className="text-center">
                <h1 className="font-bold text-2xl">Who&apos;s watching?</h1>
            </div>
            <ProfilesGrid />
        </main>
    );
}