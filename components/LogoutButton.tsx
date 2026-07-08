"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={logout}
      disabled={pending}
      className={className ?? "font-bold text-white transition-colors hover:text-red-500 disabled:opacity-50"}
    >
      {pending ? "..." : "LOG OUT"}
    </button>
  );
}
