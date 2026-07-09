import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { RUSH_EVENTS } from "@/lib/events";
import FormSwitcher from "@/components/admin/FormSwitcher";

export const metadata: Metadata = { title: "Rush Attendance" };
export const dynamic = "force-dynamic";

export default async function AdminAttendancePage() {
  await requireRole("ADMIN");

  const [setting, rushees] = await Promise.all([
    prisma.formSetting.findUnique({ where: { id: 1 } }),
    prisma.rushApplication.findMany({
      where: { attendedEvents: { isEmpty: false }, archivedAt: null },
      orderBy: { fullName: "asc" },
    }),
  ]);

  const rows = rushees
    .map((r) => ({
      name: r.fullName,
      nyuEmail: r.nyuEmail,
      phoneNumber: r.phoneNumber,
      instagramHandle: r.instagramHandle,
      events: new Set<string>(r.attendedEvents),
    }))
    .sort((a, b) => b.events.size - a.events.size);
  const totalCheckIns = rushees.reduce((n, r) => n + r.attendedEvents.length, 0);
  const perEvent = Object.fromEntries(
    RUSH_EVENTS.map((e) => [e.value, rushees.filter((r) => r.attendedEvents.includes(e.value)).length])
  );

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-red-600"
      >
        <span aria-hidden="true">&larr;</span> Back to admin
      </Link>
      <h1 className="text-2xl font-extrabold text-black">Rush Attendance</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Switch what the public <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">/rush</code>{" "}
        page shows, then track who signed in at each event.
      </p>

      <FormSwitcher activeEvent={setting?.activeEvent ?? null} />

      <div className="mt-10 mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-black">Attendees</h2>
          <p className="text-sm text-gray-500">
            {rows.length} unique rushee{rows.length === 1 ? "" : "s"} across {totalCheckIns} check-in
            {totalCheckIns === 1 ? "" : "s"}
          </p>
        </div>
        {/* Plain anchor: file download from an API route, not page navigation. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
        <a
          href="/api/admin/attendance/export"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
        >
          Download CSV
        </a>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow">
          No check-ins yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">NYU Email</th>
                <th className="px-4 py-3">Phone</th>
                <th className="px-4 py-3">Instagram</th>
                {RUSH_EVENTS.map((e) => (
                  <th key={e.value} className="px-2 py-3 text-center" title={e.label}>
                    {e.label.replace(/^Activity Night w\/ /, "AN ")}
                    <div className="font-normal normal-case text-gray-400">{perEvent[e.value]}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {rows.map((r) => (
                <tr key={`${r.nyuEmail}|${r.phoneNumber}`}>
                  <td className="whitespace-nowrap px-4 py-3 font-medium text-black">{r.name}</td>
                  <td className="px-4 py-3 text-gray-600">{r.nyuEmail}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-600">{r.phoneNumber}</td>
                  <td className="px-4 py-3 text-gray-600">{r.instagramHandle ?? "—"}</td>
                  {RUSH_EVENTS.map((e) => (
                    <td key={e.value} className="px-2 py-3 text-center">
                      {r.events.has(e.value) ? (
                        <span className="font-bold text-green-600">✓</span>
                      ) : (
                        <span className="text-gray-200">·</span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
