import type { Metadata } from "next";
import Link from "next/link";
import { requireUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export const metadata: Metadata = { title: "My Account" };

const ROLE_LABEL: Record<string, string> = {
  ADMIN: "Admin",
  BRO: "Brother",
  RANDO: "Member",
};

export default async function AccountPage() {
  const user = await requireUser();
  const canViewApplications = user.role === "ADMIN" || user.role === "BRO";

  return (
    <section className="mx-auto max-w-2xl px-4 py-16">
      <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-10">
        <p className="text-xs font-bold uppercase tracking-widest text-red-600">My Account</p>
        <h1 className="mt-2 text-2xl font-extrabold text-black">Hi, {user.name}</h1>
        <p className="mt-1 text-sm text-gray-600">{user.email}</p>
        <span className="mt-4 inline-block rounded-full bg-black px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
          {ROLE_LABEL[user.role] ?? user.role}
        </span>

        <hr className="my-8 border-gray-200" />

        <div className="space-y-3">
          <Link
            href="/directory"
            className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
          >
            Browse the brother directory &amp; lineages &rarr;
          </Link>
          {canViewApplications && (
            <Link
              href="/applications"
              className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
            >
              View rush applications &rarr;
            </Link>
          )}
          {user.role === "ADMIN" && (
            <Link
              href="/admin"
              className="block rounded-xl border border-gray-200 px-5 py-4 font-semibold text-black transition hover:border-red-600 hover:text-red-600"
            >
              Manage members &amp; roles &rarr;
            </Link>
          )}
          {user.role === "RANDO" && (
            <p className="rounded-xl bg-gray-50 px-5 py-4 text-sm text-gray-600">
              Your account is active. Once an admin marks you as a brother, you&rsquo;ll be able to
              view rush applications here.
            </p>
          )}
        </div>

        <div className="mt-8">
          <LogoutButton className="text-sm font-bold text-gray-500 transition-colors hover:text-red-600 disabled:opacity-50" />
        </div>
      </div>
    </section>
  );
}
