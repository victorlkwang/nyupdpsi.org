"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { buttonClass, inputClass, labelClass } from "@/components/formStyles";

export default function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  if (!token) {
    return (
      <p className="text-sm font-semibold text-red-700">
        This reset link is missing its token. Please request a new one from the{" "}
        <Link href="/forgot-password" className="text-red-600 underline">
          forgot password
        </Link>{" "}
        page.
      </p>
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    const password = formData.get("password");
    const confirm = formData.get("confirm");
    if (password !== confirm) {
      setError("Passwords don't match.");
      setStatus("idle");
      return;
    }

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
      setTimeout(() => router.push("/login?reset=1"), 1500);
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-black px-6 py-8 text-center text-white">
        <p className="text-lg font-bold">Password updated!</p>
        <p className="mt-2 text-sm text-gray-300">Redirecting you to the login page&hellip;</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="password" className={labelClass}>
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={8}
          placeholder="At least 8 characters"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="confirm" className={labelClass}>
          Confirm new password
        </label>
        <input id="confirm" name="confirm" type="password" required className={inputClass} />
      </div>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={status === "submitting"} className={buttonClass}>
        {status === "submitting" ? "Updating..." : "Update password"}
      </button>
    </form>
  );
}
