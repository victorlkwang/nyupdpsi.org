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
