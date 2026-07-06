import type { Metadata } from "next";
import Image from "next/image";
import RosterGallery from "@/components/RosterGallery";
import { alumni } from "@/data/alumni";

export const metadata: Metadata = {
  title: "Alumni",
  description: "Meet the alumni of the Zeta Chapter of Pi Delta Psi at NYU.",
};

export default function AlumniPage() {
  return (
    <>
      <section className="relative h-[55vh] w-full overflow-hidden md:h-[70vh]">
        <Image
          src="/images/desktop/alum_cover.jpg"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Legacy Lives On
          </h1>
        </div>
      </section>

      <RosterGallery data={alumni} defaultClass="Beta Eta" emptyMessage="No alumni listed yet." />
    </>
  );
}
