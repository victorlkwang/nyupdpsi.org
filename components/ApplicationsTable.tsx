"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export type ApplicationRow = {
  id: string;
  submitted: string;
  fullName: string;
  nyuEmail: string;
  phoneNumber: string;
  year: string;
  school: string;
  instagramHandle: string | null;
  thankYouSent: boolean;
  messageSent: string | null;
};

export default function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const allSelected = applications.length > 0 && selected.size === applications.length;

  function toggle(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(applications.map((a) => a.id)));
  }

  async function sendToSelected() {
    const ids = [...selected];
    if (ids.length === 0) return;
    if (!confirm(`Send the follow-up message to ${ids.length} selected rushee(s)?`)) return;
    setSending(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch("/api/applications/send-message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Couldn't send the messages.");
        return;
      }
      const parts = [`Emailed ${body.sent}`];
      if (body.failed) parts.push(`${body.failed} failed`);
      setNotice(parts.join(" · "));
      setSelected(new Set());
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSending(false);
    }
  }

  const selectAllRef = useMemo(
    () => (el: HTMLInputElement | null) => {
      if (el) el.indeterminate = selected.size > 0 && !allSelected;
    },
    [selected.size, allSelected]
  );

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <button
          onClick={sendToSelected}
          disabled={sending || selected.size === 0}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white shadow transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending…" : `Send message to ${selected.size} selected`}
        </button>
        {notice && <span className="text-sm font-semibold text-green-700">{notice}</span>}
        {error && <span className="text-sm font-semibold text-red-700">{error}</span>}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">
                <input
                  ref={selectAllRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Select all"
                  className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                />
              </th>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">NYU Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Instagram</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app.id} className={selected.has(app.id) ? "bg-red-50" : undefined}>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(app.id)}
                    onChange={() => toggle(app.id)}
                    aria-label={`Select ${app.fullName}`}
                    className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                  />
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {app.submitted}
                  {app.thankYouSent && (
                    <span className="mt-0.5 block text-[11px] font-semibold text-green-700">
                      ✓ thank-you sent
                    </span>
                  )}
                  {app.messageSent && (
                    <span className="mt-0.5 block text-[11px] font-semibold text-gray-500">
                      ✉ messaged {app.messageSent}
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-black">{app.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{app.nyuEmail}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{app.phoneNumber}</td>
                <td className="px-4 py-3 text-gray-600">{app.year}</td>
                <td className="px-4 py-3 text-gray-600">{app.school}</td>
                <td className="px-4 py-3 text-gray-600">{app.instagramHandle ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
