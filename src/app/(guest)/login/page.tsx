"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import AuthLayout from "@/features/auth/components/AuthLayout";

const inputCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white placeholder-white/25 outline-none transition focus:border-blue-500/50 focus:bg-white/[0.09] focus:ring-2 focus:ring-blue-500/15";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (email === "test@test.com" && password === "123456") {
        router.push("/dashboard");
      } else {
        setError("Invalid email or password");
      }
      setLoading(false);
    }, 1500);
  };

  return (
    <AuthLayout>
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold text-white">Welcome back</h1>
        <p className="mt-1.5 text-sm text-white/45">
          Sign in to your SkillMind account
        </p>
      </div>

      <div className="space-y-4">
        {/* Email */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/50">
            Email
          </label>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" && email && password && handleLogin()
            }
            className={inputCls}
          />
        </div>

        {/* Password */}
        <div>
          <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-white/50">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && email && password && handleLogin()
              }
              className={`${inputCls} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 transition hover:text-white/60"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Remember + Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-white/20 bg-white/5 accent-blue-500"
            />
            <span className="text-xs text-white/45">Remember me</span>
          </label>
          <a
            href="#"
            className="text-xs font-medium text-blue-400 transition hover:text-blue-300"
          >
            Forgot password?
          </a>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-center text-xs text-red-400">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full rounded-xl bg-linear-to-r from-blue-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Signing in…
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </div>

      <p className="mt-5 text-center text-xs text-white/40">
        Don&apos;t have an account?{" "}
        <button
          onClick={() => router.push("/register")}
          className="font-semibold text-blue-400 transition hover:text-blue-300"
        >
          Create Account
        </button>
      </p>
    </AuthLayout>
  );
}
