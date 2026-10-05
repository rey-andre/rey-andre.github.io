"use client";

import React, { useState, useTransition, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { ArrowLeft, Lock, Mail, Eye, EyeOff, ShieldAlert, Loader2 } from "lucide-react";
import NetworkCanvas from "@/components/ui/NetworkCanvas";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/admin";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email || !password) {
      setErrorMsg("Please enter both email and password.");
      return;
    }

    startTransition(async () => {
      try {
        const supabase = createClient();
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          setErrorMsg(error.message || "Failed to sign in. Please check your credentials.");
          return;
        }

        router.push(redirectTo);
        router.refresh();
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : "An unexpected error occurred.";
        setErrorMsg(message);
      }
    });
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 overflow-hidden">
      {/* Background Canvas */}
      <NetworkCanvas />

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-[420px]">
        <div className="profile-card p-6 sm:p-8 bg-[#070522]/95 border border-[#e1bee7]/15">
          {/* Back to Home Link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-[#e1bee7]/70 hover:text-[#ff3f81] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Profile
          </Link>

          {/* Header */}
          <div className="text-center mb-6">
            <div className="relative w-16 h-16 mx-auto mb-3 rounded-full p-0.5 bg-gradient-to-tr from-[#ff3f81] via-[#e1bee7] to-[#ff3f81] shadow-lg shadow-[#ff3f81]/20">
              <div className="relative w-full h-full rounded-full overflow-hidden bg-[#070522] flex items-center justify-center">
                <Image
                  src="/image/logoRey0.png"
                  alt="Rey Logo"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              CMS Admin Portal
            </h1>
            <p className="text-xs text-[#e1bee7]/80 mt-1">
              Sign in to manage portfolio and profile content
            </p>
          </div>

          {/* Error Message Alert */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-md bg-red-950/60 border border-red-500/40 flex items-start gap-2.5 text-xs text-red-200">
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="email"
                className="block text-xs font-medium text-gray-200"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@example.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-[#19153c]/80 border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81] focus:ring-1 focus:ring-[#ff3f81] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label
                htmlFor="password"
                className="block text-xs font-medium text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-10 py-2.5 bg-[#19153c]/80 border border-[#e1bee7]/20 rounded-md text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#ff3f81] focus:ring-1 focus:ring-[#ff3f81] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-2 py-2.5 px-4 rounded-md bg-[#ff3f81] border border-[#ff3f81] text-white font-medium text-sm text-center flex items-center justify-center gap-2 transition-all duration-300 hover:bg-[#e0326f] hover:shadow-lg hover:shadow-[#ff3f81]/30 active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : (
                <span>Sign In to Dashboard</span>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <p className="text-[11px] text-gray-400">
              Secured with Supabase Authentication
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#19153c] flex items-center justify-center text-[#ff3f81]">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
