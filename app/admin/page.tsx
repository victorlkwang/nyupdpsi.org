import type { Metadata } from "next";
import { requireRole } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AdminUserTable, { type AdminUserRow } from "@/components/AdminUserTable";

export const metadata: Metadata = { title: "Manage Members" };

export default async function AdminPage() {
  const admin = await requireRole("ADMIN");
  const users = await prisma.user.findMany({
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
  });

  const rows: AdminUserRow[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    verified: user.emailVerifiedAt !== null,
  }));

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="text-2xl font-extrabold text-black">Manage Members &amp; Roles</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Promote members to <strong>BRO</strong> so they can view rush applications. Admins can view
        everything and manage roles. You can&rsquo;t change your own role.
      </p>
      <AdminUserTable users={rows} currentUserId={admin.id} />
    </section>
  );
}
