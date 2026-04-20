"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { User, CreditCard, Monitor } from "lucide-react";

const navItems = [
    { label: "Profile", href: "/settings/profile", icon: User },
    { label: "Billing & Payment", href: "/settings/billing", icon: CreditCard },
    { label: "Sessions", href: "/settings/sessions", icon: Monitor },
];

export default function SettingsLayout({ children }: { children: ReactNode }) {
    const pathname = usePathname();

    return (
        <div className="flex min-h-screen bg-[#0A0A0F] text-white -mx-4 sm:-mx-6 lg:-mx-10 -mb-14">
            <aside className="w-64 border-r border-white/5 bg-[#0F0F16] p-6 hidden md:block shrink-0">
                <nav className="space-y-1">
                    {navItems.map((item) => {
                        const active = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-white/10 text-white"
                                        : "text-white/60 hover:bg-white/5 hover:text-white"
                                }`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>
            </aside>
            <main className="flex-1 p-6 lg:p-10 overflow-y-auto w-full">
                {children}
            </main>
        </div>
    );
}
