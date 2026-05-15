"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function DashboardLogoutButton() {
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);

  async function handleLogout() {
    setIsSigningOut(true);

    const supabase = createClient();
    await supabase.auth.signOut();

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={isSigningOut}
      className="flex w-full items-center justify-center gap-2 rounded-lg border px-3 py-2 text-[11px] font-semibold transition hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
      style={{
        color: "#a1a1aa",
        background: "rgba(255,255,255,0.025)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <LogOut className="h-3.5 w-3.5" />
      {isSigningOut ? "Signing out..." : "Sign out"}
    </button>
  );
}