"use client";

import { useState, type FormEvent } from "react";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600";
const labelClass = "mb-1 block text-sm font-semibold text-black";

type Status = "idle" | "submitting" | "success" | "error";

export default function AttendanceForm({ eventLabel }: { eventLabel: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: formData.get("name"),
      nyuEmail: formData.get("nyuEmail"),
      phoneNumber: formData.get("phoneNumber"),
      instagramHandle: formData.get("instagramHandle"),
      company: formData.get("company"),
    };
    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();
      if (!response.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-10">
      <h3 className="text-center text-2xl font-extrabold text-black md:text-3xl">Sign In</h3>
      <p className="mt-2 text-center text-sm font-semibold text-red-600">{eventLabel}</p>
      <p className="mt-4 text-center text-sm text-gray-600">
        Thanks for coming out! Drop your info below so we can keep in touch.
      </p>

      <hr className="my-8 border-gray-200" />

      {status === "success" ? (
        <div className="rounded-lg bg-black px-6 py-8 text-center text-white">
          <p className="text-lg font-bold">You&rsquo;re checked in! ✓</p>
          <p className="mt-2 text-sm text-gray-300">Thanks for coming to {eventLabel}.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label htmlFor="name" className={labelClass}>
              Full Name *
            </label>
            <input id="name" name="name" type="text" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="nyuEmail" className={labelClass}>
              NYU Email *
            </label>
            <input
              id="nyuEmail"
              name="nyuEmail"
              type="text"
              required
              placeholder="netid@nyu.edu"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number *
            </label>
            <input id="phoneNumber" name="phoneNumber" type="tel" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="instagramHandle" className={labelClass}>
              Instagram Handle (optional)
            </label>
            <input
              id="instagramHandle"
              name="instagramHandle"
              type="text"
              placeholder="@yourhandle"
              className={inputClass}
            />
          </div>

          {status === "error" && (
            <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "submitting" ? "Signing in..." : "Sign In"}
          </button>
        </form>
      )}
    </div>
  );
}
