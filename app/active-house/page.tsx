import type { Metadata } from "next";
import Image from "next/image";
import RosterGallery from "@/components/RosterGallery";
import { activeHouse } from "@/data/activeHouse";

export const metadata: Metadata = {
  title: "Active House",
  description: "Meet the active brothers of the Zeta Chapter of Pi Delta Psi at NYU.",
};

export default function ActiveHousePage() {
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/banquet.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-16 text-center md:pb-24">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">
            20+ ACTIVE BROTHERS
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white text-glow md:text-7xl">
            Brotherhood in Action
          </h1>
        </div>
      </section>

      <RosterGallery data={activeHouse} defaultClass="Beta Zeta" emptyMessage="No photos yet." />
    </>
  );
}
