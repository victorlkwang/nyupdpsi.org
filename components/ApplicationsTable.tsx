"use client";

import { useState } from "react";
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
  isGoodKid: boolean;
  thankYouSent: boolean;
  goodKidSent: string | null;
};

export default function ApplicationsTable({ applications }: { applications: ApplicationRow[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function toggleGoodKid(id: string, isGoodKid: boolean) {
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isGoodKid }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error ?? "Couldn't update that rushee.");
        return;
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  async function sendGoodKid(id: string, name: string) {
    if (!confirm(`Send the good-kid message to ${name}?`)) return;
    setBusyId(id);
    setError("");
    try {
      const res = await fetch(`/api/applications/${id}/send-good-kid`, { method: "POST" });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Couldn't send the message.");
        return;
      }
      if (body.sms === false && body.smsReason) {
        setError(`Email sent, but text was not: ${body.smsReason}`);
      }
      router.refresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-3 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">{error}</p>
      )}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
        <table className="w-full min-w-[1000px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Submitted</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">NYU Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">School</th>
              <th className="px-4 py-3">Instagram</th>
              <th className="px-4 py-3">Good kid</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {applications.map((app) => (
              <tr key={app.id} className="align-top">
                <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                  {app.submitted}
                  {app.thankYouSent && (
                    <span className="mt-0.5 block text-[11px] font-semibold text-green-700" title="Automatic thank-you sent">
                      ✓ thank-you sent
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-medium text-black">{app.fullName}</td>
                <td className="px-4 py-3 text-gray-600">{app.nyuEmail}</td>
                <td className="whitespace-nowrap px-4 py-3 text-gray-600">{app.phoneNumber}</td>
                <td className="px-4 py-3 text-gray-600">{app.year}</td>
                <td className="px-4 py-3 text-gray-600">{app.school}</td>
                <td className="px-4 py-3 text-gray-600">{app.instagramHandle ?? "—"}</td>
                <td className="px-4 py-3">
                  <div className="flex flex-col gap-1.5">
                    <label className="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={app.isGoodKid}
                        disabled={busyId === app.id}
                        onChange={(e) => toggleGoodKid(app.id, e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300 text-red-600 focus:ring-red-600"
                      />
                      <span className="text-gray-700">Good kid</span>
                    </label>
                    {app.isGoodKid &&
                      (app.goodKidSent ? (
                        <span className="text-[11px] font-semibold text-green-700">
                          ✓ sent {app.goodKidSent}
                        </span>
                      ) : (
                        <button
                          onClick={() => sendGoodKid(app.id, app.fullName)}
                          disabled={busyId === app.id}
                          className="w-fit rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          Send message
                        </button>
                      ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
