import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { getDirectory } from "@/lib/roster";
import DirectoryExplorer from "@/components/DirectoryExplorer";
import BackToAccount from "@/components/BackToAccount";

export const metadata: Metadata = { title: "Brother Directory" };
export const dynamic = "force-dynamic";

// Any signed-in user (RANDO, BRO, ADMIN) can browse the full roster, search
// brothers, trace lineages, and export a CSV.
export default async function DirectoryPage() {
  await requireUser();
  const brothers = await getDirectory();

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <BackToAccount />
      <h1 className="text-2xl font-extrabold text-black">Brother Directory</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Search every brother in the Zeta chapter, trace a lineage of bigs and littles, and download
        the full roster as a CSV.
      </p>
      <DirectoryExplorer brothers={brothers} />
    </section>
  );
}
