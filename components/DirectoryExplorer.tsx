"use client";

import { useMemo, useState } from "react";
import type { DirectoryBrother } from "@/lib/roster";

type Bro = DirectoryBrother;

function csvEscape(value: unknown): string {
  const str = value == null ? "" : String(value);
  return `"${str.replace(/"/g, '""')}"`;
}

function downloadCsv(filename: string, header: string[], rows: (string | number | null)[][]) {
  const lines = [header, ...rows].map((r) => r.map(csvEscape).join(",")).join("\r\n");
  const blob = new Blob([lines], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DirectoryExplorer({ brothers }: { brothers: Bro[] }) {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const byId = useMemo(() => new Map(brothers.map((b) => [b.id, b])), [brothers]);
  const littlesOf = useMemo(() => {
    const map = new Map<string, Bro[]>();
    for (const b of brothers) {
      if (!b.bigId) continue;
      const arr = map.get(b.bigId) ?? [];
      arr.push(b);
      map.set(b.bigId, arr);
    }
    for (const arr of map.values()) {
      arr.sort((a, c) => (a.number ?? 1e9) - (c.number ?? 1e9));
    }
    return map;
  }, [brothers]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return brothers;
    return brothers.filter((b) =>
      [b.name, b.pledgeName, b.firstName, b.lastName, b.className, b.number ? `#${b.number}` : ""]
        .filter(Boolean)
        .some((f) => String(f).toLowerCase().includes(q))
    );
  }, [brothers, query]);

  const selected = selectedId ? byId.get(selectedId) ?? null : null;

  // Ancestry: walk bigs upward, oldest first. A fallback big (no linked row) is
  // shown as an unlinked root label.
  const ancestry = useMemo(() => {
    if (!selected) return { chain: [] as Bro[], rootLabel: null as string | null };
    const chain: Bro[] = [];
    const seen = new Set<string>();
    let cur: Bro | undefined = selected;
    let rootLabel: string | null = null;
    while (cur && !seen.has(cur.id)) {
      seen.add(cur.id);
      chain.unshift(cur);
      if (cur.bigId) {
        cur = byId.get(cur.bigId);
      } else {
        rootLabel = cur.bigLabel ?? null;
        cur = undefined;
      }
    }
    return { chain, rootLabel };
  }, [selected, byId]);

  function lineageMembers(root: Bro): { bro: Bro; relation: string }[] {
    // ancestors (with distance up), self, then all descendants (distance down)
    const out: { bro: Bro; relation: string }[] = [];
    let up = 0;
    for (let i = ancestry.chain.length - 2; i >= 0; i--) {
      up += 1;
      out.unshift({ bro: ancestry.chain[i], relation: `big (${up} up)` });
    }
    out.push({ bro: root, relation: "self" });
    const walk = (b: Bro, depth: number) => {
      for (const child of littlesOf.get(b.id) ?? []) {
        out.push({ bro: child, relation: `little (${depth} down)` });
        walk(child, depth + 1);
      }
    };
    walk(root, 1);
    return out;
  }

  function exportFull() {
    const header = [
      "Number", "First", "Last", "Pledge Name", "Class", "Status",
      "Grad Year", "Major", "Instagram", "Big", "Littles",
    ];
    const rows = brothers.map((b) => [
      b.number ?? "",
      b.firstName,
      b.lastName ?? "",
      b.pledgeName,
      b.className,
      b.status,
      b.gradYear ?? "",
      b.major ?? "",
      b.instagram ?? "",
      b.bigId ? byId.get(b.bigId)?.name ?? "" : b.bigLabel ?? "",
      (littlesOf.get(b.id) ?? []).map((l) => l.name).join("; "),
    ]);
    downloadCsv("pdpsi-roster.csv", header, rows);
  }

  function exportLineage() {
    if (!selected) return;
    const header = ["Relation", "Number", "Name", "Class", "Status"];
    const rows = lineageMembers(selected).map((m) => [
      m.relation,
      m.bro.number ?? "",
      m.bro.name,
      m.bro.className,
      m.bro.status,
    ]);
    const slug = selected.pledgeName.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
    downloadCsv(`lineage-${slug}.csv`, header, rows);
  }

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
      {/* Left: search + list */}
      <div>
        <div className="mb-3 flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, pledge name, #, class…"
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600"
          />
        </div>
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs text-gray-500">
            {filtered.length} of {brothers.length} brothers
          </span>
          <button
            onClick={exportFull}
            className="rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-gray-300"
          >
            ↓ Download roster CSV
          </button>
        </div>
        <ul className="max-h-[60vh] divide-y divide-gray-100 overflow-y-auto rounded-2xl border border-gray-200 bg-white">
          {filtered.map((b) => (
            <li key={b.id}>
              <button
                onClick={() => setSelectedId(b.id)}
                className={`flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-red-50 ${
                  selectedId === b.id ? "bg-red-50" : ""
                }`}
              >
                <span>
                  <span className="font-medium text-black">{b.name}</span>
                  <span className="ml-2 text-xs text-gray-500">{b.className}</span>
                </span>
                <span className="shrink-0 text-xs text-gray-400">
                  {b.number ? `#${b.number}` : ""}
                </span>
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-4 py-6 text-center text-sm text-gray-400">No matches.</li>
          )}
        </ul>
      </div>

      {/* Right: lineage */}
      <div>
        {!selected ? (
          <div className="flex h-full min-h-[200px] items-center justify-center rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-6 text-center text-sm text-gray-400">
            Select a brother to see their lineage of bigs and littles.
          </div>
        ) : (
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-black">{selected.name}</h2>
                <p className="text-xs text-gray-500">
                  {selected.number ? `#${selected.number} · ` : ""}
                  {selected.className} · {selected.status}
                  {selected.gradYear ? ` · ’${String(selected.gradYear).slice(2)}` : ""}
                </p>
                {selected.instagram && (
                  <a
                    href={`https://instagram.com/${selected.instagram}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-red-600 hover:underline"
                  >
                    @{selected.instagram}
                  </a>
                )}
              </div>
              <button
                onClick={exportLineage}
                className="shrink-0 rounded-full bg-gray-200 px-3 py-1.5 text-xs font-semibold text-black transition hover:bg-gray-300"
              >
                ↓ Lineage CSV
              </button>
            </div>

            {/* Ancestry */}
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Ancestry
            </h3>
            <div className="mb-5 space-y-1">
              {ancestry.rootLabel && (
                <p className="text-sm text-gray-400">{ancestry.rootLabel} (not in roster)</p>
              )}
              {ancestry.chain.map((b, i) => (
                <div key={b.id} className="flex items-center gap-2 text-sm">
                  <span className="text-gray-300">{"→".repeat(1)}</span>
                  <button
                    onClick={() => setSelectedId(b.id)}
                    style={{ marginLeft: i * 12 }}
                    className={`text-left hover:text-red-600 ${
                      b.id === selected.id ? "font-bold text-red-600" : "text-black"
                    }`}
                  >
                    {b.name}
                    {b.number ? <span className="ml-1 text-xs text-gray-400">#{b.number}</span> : null}
                  </button>
                </div>
              ))}
            </div>

            {/* Descendants */}
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Littles
            </h3>
            {(littlesOf.get(selected.id) ?? []).length === 0 ? (
              <p className="text-sm text-gray-400">No littles.</p>
            ) : (
              <LittleTree bro={selected} littlesOf={littlesOf} onSelect={setSelectedId} depth={0} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function LittleTree({
  bro,
  littlesOf,
  onSelect,
  depth,
}: {
  bro: Bro;
  littlesOf: Map<string, Bro[]>;
  onSelect: (id: string) => void;
  depth: number;
}) {
  const kids = littlesOf.get(bro.id) ?? [];
  if (kids.length === 0) return null;
  return (
    <ul className={depth === 0 ? "" : "ml-4 border-l border-gray-200 pl-3"}>
      {kids.map((k) => (
        <li key={k.id} className="py-0.5">
          <button
            onClick={() => onSelect(k.id)}
            className="text-left text-sm text-black hover:text-red-600"
          >
            {k.name}
            {k.number ? <span className="ml-1 text-xs text-gray-400">#{k.number}</span> : null}
            <span className="ml-2 text-xs text-gray-400">{k.className}</span>
          </button>
          <LittleTree bro={k} littlesOf={littlesOf} onSelect={onSelect} depth={depth + 1} />
        </li>
      ))}
    </ul>
  );
}
