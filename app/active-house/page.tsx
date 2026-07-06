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
      <section className="relative h-[55vh] w-full overflow-hidden md:h-[70vh]">
        <Image
          src="/images/desktop/banquet.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Brotherhood in Action
          </h1>
        </div>
      </section>

      <RosterGallery data={activeHouse} defaultClass="Beta Zeta" emptyMessage="No photos yet." />
    </>
  );
}
