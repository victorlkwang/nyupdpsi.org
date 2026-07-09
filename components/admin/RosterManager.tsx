"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Status = "ACTIVE" | "ALUMNI";

export type BrotherRow = {
  id: string;
  crossingNumber: number | null;
  firstName: string;
  lastName: string | null;
  pledgeName: string;
  status: Status;
  major: string | null;
  gradYear: number | null;
  instagram: string | null;
  bigId: string | null;
  classId: string;
  hasPhoto: boolean;
  bigLabel: string | null;
  name: string;
};

export type ClassData = {
  id: string;
  name: string;
  term: string | null;
  activeCount: number;
  brothers: BrotherRow[];
};

export type BrotherOption = { id: string; label: string };
export type ClassOption = { id: string; name: string };

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600";

export default function RosterManager({
  classes,
  classOptions,
  bigOptions,
}: {
  classes: ClassData[];
  classOptions: ClassOption[];
  bigOptions: BrotherOption[];
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BrotherRow | null>(null);
  const [creating, setCreating] = useState<string | null>(null); // classId to preselect
  const [addingClass, setAddingClass] = useState(false);

  async function call(url: string, options: RequestInit): Promise<boolean> {
    setError("");
    try {
      const res = await fetch(url, options);
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(body.error ?? "Something went wrong.");
        return false;
      }
      router.refresh();
      return true;
    } catch {
      setError("Network error. Please try again.");
      return false;
    }
  }

  async function toggleStatus(b: BrotherRow) {
    const next: Status = b.status === "ACTIVE" ? "ALUMNI" : "ACTIVE";
    setBusyId(b.id);
    await call(`/api/admin/roster/brothers/${b.id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    setBusyId(null);
  }

  async function graduateClass(c: ClassData) {
    if (!confirm(`Graduate all ${c.activeCount} active brother(s) in ${c.name} to alumni?`)) return;
    setBusyId(c.id);
    await call(`/api/admin/roster/classes/${c.id}/graduate`, { method: "POST" });
    setBusyId(null);
  }

  async function remove(b: BrotherRow) {
    if (!confirm(`Delete ${b.name}? This can't be undone. Any littles will lose their big.`)) return;
    setBusyId(b.id);
    await call(`/api/admin/roster/brothers/${b.id}`, { method: "DELETE" });
    setBusyId(null);
  }

  return (
    <div>
      {error && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm font-semibold text-red-700">
          {error}
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          onClick={() => setCreating(classOptions[0]?.id ?? "")}
          className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700"
        >
          + Add brother
        </button>
        <button
          onClick={() => setAddingClass(true)}
          className="rounded-full bg-gray-200 px-5 py-2 text-sm font-semibold text-black shadow transition hover:bg-gray-300"
        >
          + Add class
        </button>
      </div>

      <div className="space-y-8">
        {classes.map((c) => (
          <div key={c.id} className="rounded-2xl border border-gray-200 bg-white shadow">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gray-100 px-4 py-3">
              <div>
                <h2 className="text-lg font-bold text-black">{c.name}</h2>
                <p className="text-xs text-gray-500">
                  {c.term ? `${c.term} · ` : ""}
                  {c.brothers.length} brother{c.brothers.length === 1 ? "" : "s"} · {c.activeCount}{" "}
                  active
                </p>
              </div>
              {c.activeCount > 0 && (
                <button
                  onClick={() => graduateClass(c)}
                  disabled={busyId === c.id}
                  className="rounded-full border border-gray-300 px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-red-600 hover:text-red-600 disabled:opacity-50"
                >
                  Graduate class
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="bg-gray-50 text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2">#</th>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Big</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Photo</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {c.brothers.map((b) => (
                    <tr key={b.id}>
                      <td className="px-4 py-2 text-gray-500">
                        {b.crossingNumber ? `#${b.crossingNumber}` : "—"}
                      </td>
                      <td className="px-4 py-2 font-medium text-black">{b.name}</td>
                      <td className="px-4 py-2 text-gray-600">{b.bigLabel ?? "—"}</td>
                      <td className="px-4 py-2">
                        <span
                          className={
                            b.status === "ACTIVE"
                              ? "rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800"
                              : "rounded-full bg-gray-100 px-2 py-0.5 text-xs font-semibold text-gray-600"
                          }
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-2 text-gray-400">{b.hasPhoto ? "✓" : "—"}</td>
                      <td className="px-4 py-2">
                        <div className="flex justify-end gap-2 text-xs font-semibold">
                          <button
                            onClick={() => setEditing(b)}
                            className="text-gray-600 hover:text-red-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => toggleStatus(b)}
                            disabled={busyId === b.id}
                            className="text-gray-600 hover:text-red-600 disabled:opacity-50"
                          >
                            {b.status === "ACTIVE" ? "Graduate" : "Reactivate"}
                          </button>
                          <button
                            onClick={() => remove(b)}
                            disabled={busyId === b.id}
                            className="text-gray-400 hover:text-red-600 disabled:opacity-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {c.brothers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-4 text-center text-sm text-gray-400">
                        No brothers in this class yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {(editing || creating !== null) && (
        <BrotherForm
          brother={editing}
          defaultClassId={creating ?? undefined}
          classOptions={classOptions}
          bigOptions={bigOptions}
          onClose={() => {
            setEditing(null);
            setCreating(null);
          }}
          onError={setError}
        />
      )}

      {addingClass && (
        <ClassForm onClose={() => setAddingClass(false)} onError={setError} />
      )}
    </div>
  );
}

// --- Modals -----------------------------------------------------------------

function Modal({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 p-4">
      <div className="my-8 w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl">
        <h2 className="mb-4 text-xl font-bold text-black">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function BrotherForm({
  brother,
  defaultClassId,
  classOptions,
  bigOptions,
  onClose,
  onError,
}: {
  brother: BrotherRow | null;
  defaultClassId?: string;
  classOptions: ClassOption[];
  bigOptions: BrotherOption[];
  onClose: () => void;
  onError: (msg: string) => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const isEdit = brother !== null;
  // A brother can't be his own big.
  const bigChoices = bigOptions.filter((o) => o.id !== brother?.id);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    onError("");
    const form = new FormData(e.currentTarget);
    const url = isEdit
      ? `/api/admin/roster/brothers/${brother.id}`
      : "/api/admin/roster/brothers";
    try {
      const res = await fetch(url, { method: isEdit ? "PATCH" : "POST", body: form });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        onError(body.error ?? "Could not save.");
        setSaving(false);
        return;
      }
      router.refresh();
      onClose();
    } catch {
      onError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title={isEdit ? `Edit ${brother.name}` : "Add brother"}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">First name *</span>
            <input name="firstName" defaultValue={brother?.firstName ?? ""} required className={inputClass} />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Last name</span>
            <input name="lastName" defaultValue={brother?.lastName ?? ""} className={inputClass} />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">
            Pledge name / nickname *
          </span>
          <input name="pledgeName" defaultValue={brother?.pledgeName ?? ""} required className={inputClass} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Class *</span>
            <select
              name="classId"
              defaultValue={brother?.classId ?? defaultClassId ?? classOptions[0]?.id}
              required
              className={inputClass}
            >
              {classOptions.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Status *</span>
            <select name="status" defaultValue={brother?.status ?? "ACTIVE"} className={inputClass}>
              <option value="ACTIVE">Active</option>
              <option value="ALUMNI">Alumni</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Crossing number</span>
            <input
              name="crossingNumber"
              type="number"
              defaultValue={brother?.crossingNumber ?? ""}
              placeholder="e.g. 260"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-gray-600">Grad year</span>
            <input
              name="gradYear"
              type="number"
              defaultValue={brother?.gradYear ?? ""}
              placeholder="e.g. 2027"
              className={inputClass}
            />
          </label>
        </div>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Major</span>
          <input name="major" defaultValue={brother?.major ?? ""} className={inputClass} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Instagram handle</span>
          <input
            name="instagram"
            defaultValue={brother?.instagram ?? ""}
            placeholder="without the @"
            className={inputClass}
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Big</span>
          <select name="bigId" defaultValue={brother?.bigId ?? ""} className={inputClass}>
            <option value="">— none —</option>
            {bigChoices.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">
            Photo {isEdit && brother.hasPhoto ? "(replace current)" : ""}
          </span>
          <input name="photo" type="file" accept="image/*" className="block w-full text-sm text-gray-600" />
        </label>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : isEdit ? "Save changes" : "Add brother"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function ClassForm({
  onClose,
  onError,
}: {
  onClose: () => void;
  onError: (msg: string) => void;
}) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    onError("");
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/admin/roster/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.get("name"), term: form.get("term") }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        onError(body.error ?? "Could not create class.");
        setSaving(false);
        return;
      }
      router.refresh();
      onClose();
    } catch {
      onError("Network error. Please try again.");
      setSaving(false);
    }
  }

  return (
    <Modal title="Add pledge class">
      <form onSubmit={onSubmit} className="space-y-4">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Class name *</span>
          <input name="name" required placeholder="e.g. Beta Mu" className={inputClass} />
        </label>
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-gray-600">Term</span>
          <input name="term" placeholder="e.g. Fall 2026" className={inputClass} />
        </label>
        <p className="text-xs text-gray-500">
          New classes are added to the end of the timeline (they appear last in the class tabs).
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-4 py-2 text-sm font-semibold text-gray-500 hover:text-black"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-red-600 px-5 py-2 text-sm font-semibold text-white shadow transition hover:bg-red-700 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Add class"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
