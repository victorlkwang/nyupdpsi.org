"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { buttonClass, inputClass, labelClass } from "@/components/formStyles";

export default function ForgotPasswordForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setError("");

    const formData = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.get("email") }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? "Something went wrong. Please try again.");
        setStatus("idle");
        return;
      }
      setStatus("success");
    } catch {
      setError("Something went wrong. Please try again.");
      setStatus("idle");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-lg bg-black px-6 py-8 text-center text-white">
        <p className="text-lg font-bold">Check your email</p>
        <p className="mt-2 text-sm text-gray-300">
          If an account exists for that email, we&rsquo;ve sent a password reset link. It expires in
          1 hour.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <p className="text-sm text-gray-700">
        Enter your email and we&rsquo;ll send you a link to reset your password.
      </p>

      <div>
        <label htmlFor="email" className={labelClass}>
          Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>

      {error && <p className="text-sm font-semibold text-red-700">{error}</p>}

      <button type="submit" disabled={status === "submitting"} className={buttonClass}>
        {status === "submitting" ? "Sending..." : "Send reset link"}
      </button>

      <p className="text-center text-sm text-gray-600">
        <Link href="/login" className="font-semibold text-red-600 hover:underline">
          Back to login
        </Link>
      </p>
    </form>
  );
}
