import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUserTable, { type AdminUserRow } from "@/components/AdminUserTable";
import BackToAccount from "@/components/BackToAccount";

export const metadata: Metadata = { title: "Manage Members" };
export const dynamic = "force-dynamic";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string }>;
}) {
  const admin = await requireRole("ADMIN");
  const showArchived = (await searchParams).view === "archived";
  const users = await prisma.user.findMany({
    where: { archivedAt: showArchived ? { not: null } : null },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.emailVerifiedAt !== null,
    isSpam: user.isSpam,
    archived: user.archivedAt !== null,
  }));

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <BackToAccount />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-black">
          {showArchived ? "Archived Accounts" : "Manage Members & Roles"}
        </h1>
        <Link
          href={showArchived ? "/admin" : "/admin?view=archived"}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-black transition hover:border-red-600 hover:text-red-600"
        >
          {showArchived ? "← Back to active" : "View archived"}
        </Link>
      </div>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Promote members to <strong>BRO</strong> so they can view rush applications. Flag junk
        signups as <strong>spam</strong>, then archive or delete them. You can&rsquo;t change or
        moderate your own account.
      </p>
      <div className="mb-6 space-y-3">
        <Link
          href="/admin/roster"
          className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
        >
          Manage roster (brothers, classes &amp; photos) &rarr;
        </Link>
        <Link
          href="/admin/messages"
          className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
        >
          Customize rush messages (thank-you &amp; follow-up) &rarr;
        </Link>
        <Link
          href="/admin/attendance"
          className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
        >
          Rush attendance &amp; form switcher &rarr;
        </Link>
      </div>
      <AdminUserTable users={rows} currentUserId={admin.id} />
    </section>
  );
}
