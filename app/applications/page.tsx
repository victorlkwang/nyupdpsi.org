import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import BackToAccount from "@/components/BackToAccount";

export const metadata: Metadata = { title: "Rush Applications" };

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function ApplicationsPage() {
  await requireRole("BRO", "ADMIN");
  const applications = await prisma.rushApplication.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <BackToAccount />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black">Rush Applications</h1>
          <p className="mt-1 text-sm text-gray-600">
            {applications.length} submission{applications.length === 1 ? "" : "s"}
          </p>
        </div>
        <a
          href="/api/applications/export"
          className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
        >
          Download CSV
        </a>
      </div>

      {applications.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow">
          No applications yet.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
              <tr>
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
                <tr key={app.id} className="align-top">
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {dateFormatter.format(app.createdAt)}
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
      )}
    </section>
  );
}
