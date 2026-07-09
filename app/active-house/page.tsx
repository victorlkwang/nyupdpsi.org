import type { Metadata } from "next";
import Image from "next/image";
import RosterGallery from "@/components/RosterGallery";
import { getRosterByStatus } from "@/lib/roster";

export const metadata: Metadata = {
  title: "Active House",
  description: "Meet the active brothers of the Zeta Chapter of Pi Delta Psi at NYU.",
};

export const dynamic = "force-dynamic";

export default async function ActiveHousePage() {
  const activeHouse = await getRosterByStatus("ACTIVE");
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/banquet.webp"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            BROTHERHOOD IN ACTION
          </h1>
        </div>
      </section>

      <RosterGallery data={activeHouse} defaultClass="Beta Zeta" emptyMessage="No photos yet." />
    </>
  );
}
