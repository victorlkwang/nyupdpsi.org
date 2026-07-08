"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Role = "ADMIN" | "BRO" | "RANDO";

export type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  role: Role;
  verified: boolean;
};

const ROLES: Role[] = ["ADMIN", "BRO", "RANDO"];

export default function AdminUserTable({
  users,
  currentUserId,
}: {
  users: AdminUserRow[];
  currentUserId: string;
}) {
  const router = useRouter();
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function changeRole(userId: string, role: Role) {
    setPendingId(userId);
    setError("");
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role }),
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(body.error ?? "Couldn't update that user.");
        return;
      }
      router.refresh();
    } catch {
      setError("Couldn't update that user.");
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div>
      {error && <p className="mb-4 text-sm font-semibold text-red-700">{error}</p>}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 bg-white shadow">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Verified</th>
              <th className="px-4 py-3">Role</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-black">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3">
                    {user.verified ? (
                      <span className="text-green-700">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={user.role}
                      disabled={isSelf || pendingId === user.id}
                      onChange={(event) => changeRole(user.id, event.target.value as Role)}
                      className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400"
                      title={isSelf ? "You can't change your own role" : undefined}
                    >
                      {ROLES.map((role) => (
                        <option key={role} value={role}>
                          {role}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
