"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

const guestLinks = [
  { href: "/", label: "Inicio" },
  { href: "/courses", label: "Cursos" },
  { href: "/pricing", label: "Planes" },
  { href: "/about", label: "Sobre nosotros" },
];

export default function GuestLayout({ children }: Props) {
  const pathname = usePathname();

  const hideNav =
    pathname === "/login" || pathname.startsWith("/register");

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#eef2ff_0,transparent_28%),radial-gradient(circle_at_90%_15%,#cffafe_0,transparent_22%),#f8fafc] text-slate-900">
      {!hideNav && (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/82 backdrop-blur-md">
          <div className="mx-auto grid max-w-7xl grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-3.5">
            {/* Brand */}
            <Link
              href="/"
              className="text-[18px] font-bold tracking-tight text-slate-900 no-underline"
            >
              Skillmind
            </Link>

            {/* Nav links */}
            <nav className="flex flex-wrap items-center justify-center gap-1">
              {guestLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-3 py-1.5 text-sm font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-semibold text-slate-900 transition hover:border-sky-400 hover:shadow-[0_8px_20px_rgba(14,165,233,0.12)]"
              >
                Iniciar sesion
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 px-4 py-2 text-sm font-bold text-white shadow-[0_10px_30px_rgba(99,102,241,0.25)] transition hover:-translate-y-px hover:shadow-[0_14px_34px_rgba(99,102,241,0.3)]"
              >
                Crear cuenta
              </Link>
            </div>
          </div>
        </header>
      )}

      <main className="mx-auto max-w-7xl px-5 py-9">{children}</main>
    </div>
  );
}
