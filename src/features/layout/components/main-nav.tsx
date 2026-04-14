"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { Brain, Menu, X } from "lucide-react"
import { ProfileSwitcher } from "./ProfileSwitcher"
import type { Profile } from "@/features/profiles/types/profile.types"
import type { Device } from "@/types/session.types"

interface MainNavProps {
  userName?: string
  userAvatar?: string | null
  initialProfiles?: Profile[]
  initialDevices?: Device[]
  activeProfileId?: string
}

const navLinks = [
  { label: "Home", href: "/main" },
  { label: "My Courses", href: "/my-courses" },
  { label: "Courses", href: "/courses" },
  { label: "Resources", href: "/resources" },
  { label: "Community", href: "/community" },
  { label: "Teach", href: "/professor/dashboard" },
]

export default function MainNav({
  userName = "Sabrina",
  userAvatar = null,
  initialProfiles = [],
  initialDevices = [],
  activeProfileId = "",
}: MainNavProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const mounted = useRef(false)

  useEffect(() => {
    mounted.current = true
    const handler = () => {
      setScrolled(window.scrollY > 72)
      // close mobile menu on scroll
      if (window.scrollY > 10) setMenuOpen(false)
    }
    window.addEventListener("scroll", handler, { passive: true })
    handler()
    return () => window.removeEventListener("scroll", handler)
  }, [])

  const ease = "cubic-bezier(0.32, 0.72, 0, 1)"
  const dur = "0.55s"
  const transition = mounted.current ? `all ${dur} ${ease}` : "none"

  return (
    <>
      {/* Spacer */}
      <div className="h-16" />

      {/* Fixed outer shell — pill morphs here, overflow:hidden clips to pill shape */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center"
        style={{ padding: scrolled ? "0 16px" : "0" }}
      >
        <div
          className="pointer-events-auto w-full backdrop-blur-xl"
          style={{
            transition,
            willChange: "max-width, border-radius, margin-top, background-color, box-shadow",
            maxWidth: scrolled ? "720px" : "100vw",
            borderRadius: scrolled ? "9999px" : "0px",
            marginTop: scrolled ? "10px" : "0px",
            backgroundColor: scrolled ? "rgba(6,6,10,0.88)" : "rgba(28,28,34,0.60)",
            boxShadow: scrolled
              ? "0 8px 40px rgba(0,0,0,0.6), inset 0 0 0 1px rgba(255,255,255,0.09)"
              : "0 1px 0 0 rgba(255,255,255,0.06)",
          }}
        >
          {/* ── Main bar ── */}
          <div
            className="flex items-center justify-between"
            style={{
              transition,
              height: scrolled ? "42px" : "64px",
              paddingLeft: scrolled ? "14px" : "24px",
              paddingRight: scrolled ? "14px" : "24px",
            }}
          >
            {/* Logo */}
            <Link href="/main" className="flex shrink-0 items-center gap-1.5" onClick={() => setMenuOpen(false)}>
              <div
                className="relative flex items-center justify-center"
                style={{ transition, width: scrolled ? "18px" : "24px", height: scrolled ? "18px" : "24px" }}
              >
                <Brain className="h-full w-full text-blue-500" />
                <div
                  className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-indigo-500"
                  style={{ transition, opacity: scrolled ? 0 : 1 }}
                />
              </div>
              <span
                className="font-semibold leading-none tracking-tight"
                style={{ transition, fontSize: scrolled ? "13px" : "17px" }}
              >
                <span className="text-blue-500">Skill</span>
                <span className="text-white">Mind</span>
              </span>
            </Link>

            {/* Desktop nav links */}
            <ul className="hidden items-center sm:flex" style={{ transition, gap: scrolled ? "2px" : "4px" }}>
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="block font-medium text-white/50 hover:text-white/90"
                    style={{ transition, fontSize: scrolled ? "11px" : "14px" }}
                  >
                    <span
                      className="block hover:bg-white/7"
                      style={{
                        transition,
                        paddingLeft: scrolled ? "8px" : "14px",
                        paddingRight: scrolled ? "8px" : "14px",
                        paddingTop: scrolled ? "4px" : "8px",
                        paddingBottom: scrolled ? "4px" : "8px",
                        borderRadius: scrolled ? "9999px" : "8px",
                      }}
                    >
                      {link.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Right: profile switcher + hamburger */}
            <div className="flex shrink-0 items-center gap-2">
              <ProfileSwitcher
                initialName={userName}
                initialAvatar={userAvatar ?? null}
                initialProfiles={initialProfiles}
                initialDevices={initialDevices}
                activeProfileId={activeProfileId}
                scrolled={scrolled}
                transition={transition}
              />
              {/* Hamburger — mobile only */}
              <button
                className="flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white sm:hidden"
                onClick={() => setMenuOpen((o) => !o)}
                aria-label="Toggle menu"
              >
                {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/*
        Mobile drawer — rendered OUTSIDE the pill so it's never clipped by
        overflow:hidden + border-radius:9999px. Sits at z-49, below the nav (z-50).
        Slides down from the top using translateY.
      */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 z-40 sm:hidden"
        style={{
          // Push the panel down by the nav bar height so it appears right below it
          paddingTop: scrolled ? "62px" : "64px",
          transition: `padding-top ${dur} ${ease}`,
        }}
      >
        <div
          className="pointer-events-auto overflow-hidden bg-[rgba(6,6,10,0.96)] backdrop-blur-2xl"
          style={{
            transition: `transform 0.38s ${ease}, opacity 0.28s ease`,
            transform: menuOpen ? "translateY(0)" : "translateY(-110%)",
            opacity: menuOpen ? 1 : 0,
            boxShadow: "0 12px 40px rgba(0,0,0,0.7)",
          }}
        >
          <div className="px-4 pb-5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center rounded-xl px-3 py-3.5 text-[15px] font-medium text-white/60 transition hover:bg-white/8 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 border-t border-white/8 pt-3">
              <ProfileSwitcher
                initialName={userName}
                initialAvatar={userAvatar ?? null}
                initialProfiles={initialProfiles}
                initialDevices={initialDevices}
                activeProfileId={activeProfileId}
                scrolled={false}
                transition="none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Backdrop tap-to-close */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-30 sm:hidden"
          onClick={() => setMenuOpen(false)}
        />
      )}
    </>
  )
}
