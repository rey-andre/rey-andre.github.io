"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { LogOut, Loader2 } from "lucide-react";

export default function LogoutButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleLogout = async () => {
    startTransition(async () => {
      try {
        const supabase = createClient();
        await supabase.auth.signOut();
        router.push("/admin/login");
        router.refresh();
      } catch (err) {
        console.error("Logout error:", err);
      }
    });
  };

  return (
    <button
      onClick={handleLogout}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[#e1bee7]/20 text-xs text-gray-300 hover:text-white hover:border-[#ff3f81] hover:bg-[#ff3f81]/10 transition-all disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : (
        <LogOut className="w-3.5 h-3.5 text-[#ff3f81]" />
      )}
      <span>Sign Out</span>
    </button>
  );
}
