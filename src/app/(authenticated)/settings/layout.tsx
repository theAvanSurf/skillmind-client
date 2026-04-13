import Link from "next/link";
import { ReactNode } from "react";
import { User, CreditCard, Shield, Bell } from "lucide-react";

export default function SettingsLayout({ children }: { children: ReactNode }) {
    const navItems = [
        { label: "Profile", href: "/settings/profile", icon: User },
        { label: "Billing & Payment", href: "/settings/billing", icon: CreditCard },
    ];

    return (
        <div className="flex h-full min-h-screen bg-[#0A0A0F] text-white">
            <aside className="w-64 border-r border-white/5 bg-[#0F0F16] p-6 hidden md:block">
                <nav className="space-y-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                                item.label === "Billing & Payment"
                                    ? "bg-white/10 text-white"
                                    : "text-white/60 hover:bg-white/5 hover:text-white"
                            }`}
                        >
                            <item.icon className="h-5 w-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>
            </aside>
            <main className="flex-1 p-6 lg:p-12 overflow-y-auto w-full max-w-4xl mx-auto">
                {children}
            </main>
        </div>
    );
}
