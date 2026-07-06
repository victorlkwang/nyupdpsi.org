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
      <section className="relative h-[55vh] w-full overflow-hidden md:h-[70vh]">
        <Image
          src="/images/desktop/cross.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Excellence Through Brotherhood
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-2xl font-semibold tracking-tight text-black md:text-4xl">
            Executive Board 2026
          </h2>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
            {execBoard.map((member) => (
              <div key={member.role} className="text-center">
                <div className="relative aspect-square w-full overflow-hidden rounded-lg grayscale transition duration-300 hover:grayscale-0">
                  <Image
                    src={member.image}
                    alt={member.role}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 text-base font-medium text-black">{member.role}</h3>
                <p className="text-sm text-gray-500">{member.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
