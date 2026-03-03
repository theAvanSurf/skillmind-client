import type { ReactNode } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type Props = {
    children: ReactNode;
};

export default async function Layout({ children }: Props) {
    const cookieStore = await cookies();
    const userToken = cookieStore.get("token");

    if (!userToken) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-[#181823] text-white">
            <main className="mx-auto max-w-360 px-4 pb-14 pt-0 sm:px-6 lg:px-10">
                {children}
            </main>
        </div>
    );
}