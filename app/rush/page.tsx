import type { Metadata } from "next";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { currentRush, rushArchive } from "@/data/rush";

export const metadata: Metadata = {
  title: "Rush",
  description: "Rush the Zeta Chapter of Pi Delta Psi at NYU. Earn your letters.",
};

export default function RushPage() {
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/beta-etas.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-16 text-center md:pb-24">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">JOIN THE LEGACY</p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white text-glow md:text-7xl">
            Earn Your Letters
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-10">
          <FadeIn className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-between md:text-left">
            <div>
              <p className="mb-2 text-sm font-bold tracking-[0.3em] text-brand">RUSH NOW OPEN</p>
              <h2 className="text-3xl font-black uppercase tracking-tight text-black md:text-5xl">
                {currentRush.term}
              </h2>
            </div>
            <a
              href={currentRush.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-brand px-8 py-4 text-sm font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition duration-200 hover:scale-105 hover:bg-brand-dark md:text-base"
            >
              Rush Interest Form
            </a>
          </FadeIn>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <FadeIn className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
              <Image
                src={currentRush.cover}
                alt={`${currentRush.term} Cover`}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </FadeIn>
            <FadeIn
              delayMs={100}
              className="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-black/5"
            >
              <Image
                src={currentRush.date}
                alt={`${currentRush.term} Date`}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="bg-grid-pattern w-full bg-black px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          <FadeIn className="text-center">
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">THE ARCHIVE</p>
            <h2 className="text-4xl font-black uppercase tracking-tight text-white text-glow md:text-6xl">
              Rush Archive
            </h2>
          </FadeIn>

          {rushArchive.map((term, i) => (
            <FadeIn key={term.term} delayMs={i * 60} className="space-y-6">
              <h3 className="border-b border-white/10 pb-2 text-2xl font-bold uppercase tracking-tight text-white md:text-3xl">
                {term.term}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/10 transition duration-300 hover:ring-brand/60 hover:shadow-lg hover:shadow-brand/20">
                  <Image
                    src={term.cover}
                    alt={`${term.term} Cover`}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="group relative aspect-square overflow-hidden rounded-3xl ring-1 ring-white/10 transition duration-300 hover:ring-brand/60 hover:shadow-lg hover:shadow-brand/20">
                  <Image
                    src={term.date}
                    alt={`${term.term} Date`}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>
    </>
  );
}
