import React from "react";
import Link from "next/link";
import { Brain } from "lucide-react";

interface MainNavProps {
  userName?: string;
  userAvatar?: string | null;
}

const navLinks = [
  { label: "Home", href: "/dashboard" },
  { label: "My Courses", href: "/my-courses" },
  { label: "Courses", href: "/courses" },
  { label: "Resources", href: "/resources" },
  { label: "Community", href: "/community" },
];

const MainNav: React.FC<MainNavProps> = ({
  userName = "Sabrina",
  userAvatar = null,
}) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-white/[0.08] bg-[#07071a]/95 shadow-lg shadow-black/20 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-6 md:px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex shrink-0 items-center gap-2">
          <div className="relative">
            <Brain className="h-6 w-6 text-orange-500" />
            <div className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-purple-500" />
          </div>
          <span className="text-lg font-semibold tracking-tight">
            <span className="text-orange-500">Skill</span>
            <span className="text-white">Mind</span>
          </span>
        </Link>

        {/* Navigation links */}
        <ul className="hidden flex-1 items-center justify-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="rounded-lg px-3.5 py-2 text-sm font-medium text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/90"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* User profile */}
        <div className="flex shrink-0 items-center gap-2.5">
          {userAvatar ? (
            <img
              src={userAvatar}
              alt={userName}
              className="h-9 w-9 rounded-full object-cover ring-2 ring-gray-100"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-orange-400 to-purple-500 text-sm font-semibold text-white shadow-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
          )}
          <span className="hidden text-sm font-medium text-white/60 md:block">
            {userName}
          </span>
        </div>
      </div>
    </nav>
  );
};

export default MainNav;