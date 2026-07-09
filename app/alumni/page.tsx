import type { Metadata } from "next";
import Image from "next/image";
import RosterGallery from "@/components/RosterGallery";
import { getRosterByStatus } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Meet the alumni of the Zeta Chapter of Pi Delta Psi at NYU.",
};

export const dynamic = "force-dynamic";

export default async function AlumniPage() {
  const alumni = await getRosterByStatus("ALUMNI");
  const classNames = Object.keys(alumni);
  // Default to the most recent alumni class (most relevant to visitors).
  const defaultClass = classNames[classNames.length - 1] ?? "";
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/alum_cover.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            LEGACY LIVES ON
          </h1>
        </div>
      </section>

      <RosterGallery data={alumni} defaultClass={defaultClass} emptyMessage="No alumni listed yet." />
    </>
  );
}
