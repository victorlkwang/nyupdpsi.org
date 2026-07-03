import type { Metadata } from "next";
import Image from "next/image";
import { execBoard } from "@/data/execBoard";

export const metadata: Metadata = {
  title: "About",
  description: "Meet the Executive Board of the Zeta Chapter of Pi Delta Psi at NYU.",
};

export default function AboutPage() {
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/cross.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            EXCELLENCE THROUGH BROTHERHOOD
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-3xl font-extrabold md:text-5xl">
            Executive Board 2026
          </h2>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
            {execBoard.map((member) => (
              <div key={member.role} className="space-y-3 text-center">
                <Image
                  src={member.image}
                  alt={member.role}
                  width={400}
                  height={400}
                  className="aspect-square w-full rounded-xl object-cover shadow-md"
                />
                <h3 className="text-lg font-bold">{member.role}</h3>
                <p className="text-sm text-gray-800">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
