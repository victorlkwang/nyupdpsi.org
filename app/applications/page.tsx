import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { EVENT_LABEL } from "@/lib/events";
import BackToAccount from "@/components/BackToAccount";
import ApplicationsTable, { type ApplicationRow } from "@/components/ApplicationsTable";

export const metadata: Metadata = { title: "Rush Applications" };
export const dynamic = "force-dynamic";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
});

export default async function ApplicationsPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const user = await requireRole("BRO", "ADMIN");
  const showArchived = (await searchParams).view === "archived";

  const applications = await prisma.rushApplication.findMany({
    where: { archivedAt: showArchived ? { not: null } : null },
    orderBy: { createdAt: "desc" },
  });

  const rows: ApplicationRow[] = applications.map((app) => ({
    id: app.id,
    submitted: dateFormatter.format(app.createdAt),
    fullName: app.fullName,
    nyuEmail: app.nyuEmail,
    phoneNumber: app.phoneNumber,
    year: app.year,
    school: app.school,
    instagramHandle: app.instagramHandle,
    events: app.attendedEvents.map((e) => EVENT_LABEL[e]),
    applied: app.year !== null,
    archived: app.archivedAt !== null,
    thankYouSent: app.thankYouSentAt !== null,
    messageSent: app.messageSentAt ? dateFormatter.format(app.messageSentAt) : null,
  }));

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <BackToAccount />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-black">
            {showArchived ? "Archived Responses" : "Rush Applications"}
          </h1>
          <p className="mt-1 text-sm text-gray-600">
            {applications.length} {showArchived ? "archived" : "rushee"}
            {applications.length === 1 ? "" : "s"}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href={showArchived ? "/applications" : "/applications?view=archived"}
            className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-black transition hover:border-red-600 hover:text-red-600"
          >
            {showArchived ? "← Back to active" : "View archived"}
          </Link>
          {user.role === "ADMIN" && !showArchived && (
            <Link
              href="/admin/messages"
              className="rounded-full border border-gray-300 px-5 py-2.5 text-sm font-bold text-black transition hover:border-red-600 hover:text-red-600"
            >
              Edit messages
            </Link>
          )}
          {/* Plain anchor: file download from an API route, not page navigation. */}
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages */}
          <a
            href="/api/applications/export"
            className="rounded-full bg-black px-5 py-2.5 text-sm font-bold text-white transition hover:bg-red-600"
          >
            Download CSV
          </a>
        </div>
      </div>

      {applications.length === 0 ? (
        <p className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-gray-500 shadow">
          {showArchived ? "Nothing archived." : "No responses yet."}
        </p>
      ) : (
        <ApplicationsTable applications={rows} />
      )}
    </section>
  );
}
