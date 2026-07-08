"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonClass, inputClass, labelClass } from "@/components/formStyles";

export default function LoginForm({ notice }: { notice?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      // Full navigation so the server re-reads the new session cookie.
      router.push("/account");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {notice && (
        <p className="rounded-lg bg-green-50 px-4 py-3 text-sm font-semibold text-green-800">
          {notice}
        </p>
      )}

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input id="password" name="password" type="password" required className={inputClass} />
      </div>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={status === "submitting"} className={buttonClass}>
        {status === "submitting" ? "Logging in..." : "Log in"}
      </button>

      <div className="flex justify-between text-sm">
        <Link href="/signup" className="font-semibold text-red-600 hover:underline">
          Create an account
        </Link>
        <Link href="/forgot-password" className="font-semibold text-gray-600 hover:underline">
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
