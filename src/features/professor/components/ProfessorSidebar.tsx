"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Award,
  DollarSign,
  Users,
  Video,
  ChevronRight,
  LogOut,
} from "lucide-react"
import { useSignOut } from "@/features/auth/hooks/useSignOut"

const navItems = [
  { label: "Dashboard", href: "/professor/dashboard", icon: LayoutDashboard },
  { label: "My Courses", href: "/professor/courses", icon: BookOpen },
  { label: "Exams", href: "/professor/exams", icon: GraduationCap },
  { label: "Certificates", href: "/professor/certificates", icon: Award },
  { label: "Students", href: "/professor/students", icon: Users },
  { label: "Live Streaming", href: "/professor/streaming", icon: Video },
  { label: "Earnings", href: "/professor/earnings", icon: DollarSign },
]

export default function ProfessorSidebar() {
  const pathname = usePathname()
  const { signOut, isLoading } = useSignOut()

  return (
    <aside className="w-60 shrink-0 border-r border-white/5 bg-[#0F0F16] hidden md:flex flex-col">
      <div className="px-5 py-5 border-b border-white/5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">Professor</p>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/")
          return (
            <Link
              key={href}
              href={href}
              className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-blue-500/10 text-blue-400"
                  : "text-white/45 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <Icon size={16} className={active ? "text-blue-400" : "text-white/30 group-hover:text-white/60"} />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={14} className="text-blue-400/50" />}
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/5">
        <button
          onClick={() => void signOut()}
          disabled={isLoading}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/45 transition-all hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
        >
          <LogOut size={16} className="text-white/30 group-hover:text-red-400" />
          <span>{isLoading ? "Signing out…" : "Sign Out"}</span>
        </button>
      </div>
    </aside>
  )
}
