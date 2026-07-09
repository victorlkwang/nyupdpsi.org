"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { TemplateContent } from "@/lib/messaging";

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600";

export default function MessageTemplateEditor({
  kind,
  title,
  description,
  template,
}: {
  kind: "THANK_YOU" | "GOOD_KID";
  title: string;
  description: string;
  template: TemplateContent;
}) {
  const router = useRouter();
  const [emailSubject, setEmailSubject] = useState(template.emailSubject);
  const [emailBody, setEmailBody] = useState(template.emailBody);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<"idle" | "saved" | "error">("idle");
  const [error, setError] = useState("");

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setStatus("idle");
    setError("");
    try {
      const res = await fetch("/api/admin/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind, emailSubject, emailBody }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Couldn't save.");
        setStatus("error");
        return;
      }
      setStatus("saved");
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
      setStatus("error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={save} className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
      <h2 className="text-lg font-bold text-black">{title}</h2>
      <p className="mb-4 text-sm text-gray-500">{description}</p>

      <label className="mb-3 block">
        <span className="mb-1 block text-xs font-semibold text-gray-600">Email subject</span>
        <input value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} className={inputClass} />
      </label>
      <label className="mb-4 block">
        <span className="mb-1 block text-xs font-semibold text-gray-600">Email body</span>
        <textarea
          value={emailBody}
          onChange={(e) => setEmailBody(e.target.value)}
          rows={6}
          className={inputClass}
        />
      </label>

      {error && <p className="mb-3 text-sm font-semibold text-red-700">{error}</p>}
      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save"}
        </button>
        {status === "saved" && <span className="text-sm font-semibold text-green-700">Saved ✓</span>}
      </div>
    </form>
  );
}
