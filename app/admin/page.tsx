import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUserTable, { type AdminUserRow } from "@/components/AdminUserTable";
import BackToAccount from "@/components/BackToAccount";

export const metadata: Metadata = { title: "Manage Members" };
export const dynamic = "force-dynamic";

type VerifiedFilter = "all" | "yes" | "no";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ view?: string; verified?: string }>;
}) {
  const admin = await requireRole("ADMIN");
  const sp = await searchParams;
  const showArchived = sp.view === "archived";
  const verified: VerifiedFilter = sp.verified === "yes" ? "yes" : sp.verified === "no" ? "no" : "all";

  // Build an /admin URL, overriding the given filter(s) and preserving the rest.
  const hrefFor = (next: { view?: "active" | "archived"; verified?: VerifiedFilter }) => {
    const params = new URLSearchParams();
    const view = next.view ?? (showArchived ? "archived" : "active");
    const v = next.verified ?? verified;
    if (view === "archived") params.set("view", "archived");
    if (v !== "all") params.set("verified", v);
    const qs = params.toString();
    return qs ? `/admin?${qs}` : "/admin";
  };

  const users = await prisma.user.findMany({
    where: {
      archivedAt: showArchived ? { not: null } : null,
      ...(verified === "yes" ? { emailVerifiedAt: { not: null } } : {}),
      ...(verified === "no" ? { emailVerifiedAt: null } : {}),
    },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.emailVerifiedAt !== null,
    archived: user.archivedAt !== null,
  }));

  const verifiedTabs: { key: VerifiedFilter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "yes", label: "Verified" },
    { key: "no", label: "Not verified" },
  ];

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <BackToAccount />
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-black">
          {showArchived ? "Archived Accounts" : "Manage Members & Roles"}
        </h1>
        <Link
          href={hrefFor({ view: showArchived ? "active" : "archived" })}
          className="rounded-full border border-gray-300 px-5 py-2 text-sm font-bold text-black transition hover:border-red-600 hover:text-red-600"
        >
          {showArchived ? "← Back to active" : "View archived"}
        </Link>
      </div>
      <p className="mt-1 mb-4 text-sm text-gray-600">
        Promote members to <strong>BRO</strong> so they can view rush applications. Archive or delete
        accounts as needed. You can&rsquo;t change or moderate your own account.
      </p>

      <div className="mb-6 inline-flex rounded-full border border-gray-200 bg-white p-1 shadow-sm">
        {verifiedTabs.map((tab) => (
          <Link
            key={tab.key}
            href={hrefFor({ verified: tab.key })}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
              verified === tab.key ? "bg-red-600 text-white" : "text-gray-600 hover:text-red-600"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

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
