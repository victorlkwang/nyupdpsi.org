"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RushEvent } from "@prisma/client";
import { RUSH_EVENTS } from "@/lib/events";

const RUSH_FORM = "RUSH_FORM";

export default function FormSwitcher({ activeEvent }: { activeEvent: RushEvent | null }) {
  const router = useRouter();
  const current = activeEvent ?? RUSH_FORM;
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function choose(value: string) {
    if (value === current) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/form-setting", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activeEvent: value === RUSH_FORM ? null : value }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Couldn't switch the form.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const options = [{ value: RUSH_FORM, label: "Rush interest form (default)" }, ...RUSH_EVENTS];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
      <h2 className="text-lg font-bold text-black">Active /rush form</h2>
      <p className="mt-1 mb-4 text-sm text-gray-500">
        Everyone visiting the Rush page sees whichever form is selected. Switch to an event during it
        to collect attendance, then switch back to the interest form.
      </p>
      {error && <p className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => {
          const active = o.value === current;
          return (
            <button
              key={o.value}
              onClick={() => choose(o.value)}
              disabled={saving}
              className={`rounded-xl border px-4 py-3 text-left text-sm font-semibold transition disabled:opacity-50 ${
                active
                  ? "border-red-600 bg-red-600 text-white"
                  : "border-gray-200 text-black hover:border-red-600 hover:text-red-600"
              }`}
            >
              {active && <span className="mr-1">●</span>}
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
