import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { execBoard } from "@/data/execBoard";
import { pillars } from "@/data/pillars";

export const metadata: Metadata = {
  title: "About",
  description:
    "Our history, our four pillars, and the Executive Board of the Zeta Chapter of Pi Delta Psi at NYU.",
};

const stats = [
  { value: "1994", label: "Founded Nationally" },
  { value: "1997", label: "Zeta Chapter Established" },
  { value: "20+", label: "Active Brothers" },
  { value: "4", label: "Pillars" },
];

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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="bg-grid-pattern absolute inset-0 opacity-40" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-16 text-center md:pb-24">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">
            ZETA CHAPTER · EST. 1997
          </p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white text-glow md:text-7xl">
            Excellence Through
            <br />
            Brotherhood
          </h1>
        </div>
      </section>

      <section className="bg-grid-pattern w-full bg-black py-16">
        <FadeIn className="mx-auto grid max-w-5xl grid-cols-2 gap-8 px-6 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-4xl font-black text-brand text-glow md:text-6xl">{stat.value}</p>
              <p className="mt-2 text-xs font-bold uppercase tracking-[0.2em] text-gray-400 md:text-sm">
                {stat.label}
              </p>
            </div>
          ))}
        </FadeIn>
      </section>

      <section className="w-full bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-16 text-center">
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">WHAT WE STAND FOR</p>
            <h2 className="text-4xl font-black uppercase tracking-tight text-black md:text-6xl">
              Our Four Pillars
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {pillars.map((pillar, i) => (
              <FadeIn
                key={pillar.number}
                delayMs={i * 100}
                className="rounded-2xl border border-black/5 bg-white p-8 shadow-lg ring-1 ring-transparent transition-shadow duration-300 hover:shadow-brand/20 hover:ring-brand/30"
              >
                <span className="text-3xl font-black text-brand/30">{pillar.number}</span>
                <h3 className="mb-3 mt-2 text-xl font-black uppercase tracking-tight text-black">
                  {pillar.title}
                </h3>
                <p className="leading-relaxed text-gray-600">{pillar.description}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full bg-black py-20">
        <FadeIn className="mx-auto w-[85%] text-center md:w-[60%]">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-brand">OUR HISTORY</p>
          <p className="text-2xl font-semibold leading-snug text-white md:text-4xl">
            Pi Delta Psi Fraternity, Inc. was founded nationally in 1994.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 md:text-lg">
            The Zeta Chapter was chartered at New York University in 1997, built on the same four
            pillars that guide every chapter of Pi Delta Psi: academic achievement, cultural
            awareness, righteousness, and friendship &amp; loyalty. Nearly three decades later,
            that foundation still shapes every brother who joins the Zeta Chapter today.
          </p>
        </FadeIn>
      </section>

      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <FadeIn className="mb-16 text-center">
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">LEADERSHIP</p>
            <h2 className="text-4xl font-black uppercase tracking-tight text-black md:text-6xl">
              Executive Board 2026
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3">
            {execBoard.map((member, i) => (
              <FadeIn key={member.role} delayMs={i * 80} className="space-y-3 text-center">
                <div className="group relative aspect-square w-full overflow-hidden rounded-xl shadow-md ring-2 ring-transparent transition duration-300 hover:ring-brand">
                  <Image
                    src={member.image}
                    alt={member.role}
                    fill
                    sizes="(min-width: 768px) 33vw, 50vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                </div>
                <h3 className="text-lg font-bold uppercase tracking-tight">{member.role}</h3>
                <p className="text-sm text-gray-600">{member.name}</p>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
