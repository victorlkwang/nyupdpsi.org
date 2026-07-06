import type { Metadata } from "next";
import Image from "next/image";
import { currentRush, rushArchive } from "@/data/rush";

export const metadata: Metadata = {
  title: "Rush",
  description: "Rush the Zeta Chapter of Pi Delta Psi at NYU. Earn your letters.",
};

export default function RushPage() {
  return (
    <>
      <section className="relative h-[55vh] w-full overflow-hidden md:h-[70vh]">
        <Image
          src="/images/desktop/beta-etas.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
            Earn Your Letters
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-start md:gap-6 md:text-left">
            <h2 className="text-2xl font-semibold tracking-tight text-black md:text-3xl">
              {currentRush.term}
            </h2>
            <a
              href={currentRush.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-brand px-6 py-2.5 text-sm font-medium text-white transition hover:bg-black"
            >
              Rush Interest Form
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-lg bg-white">
              <Image
                src={currentRush.cover}
                alt={`${currentRush.term} Cover`}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="overflow-hidden rounded-lg bg-white">
              <Image
                src={currentRush.date}
                alt={`${currentRush.term} Date`}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-gray-100 bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-14">
          <h2 className="text-center text-2xl font-semibold tracking-tight text-black md:text-3xl">
            Rush Archive
          </h2>

          {rushArchive.map((term) => (
            <div key={term.term} className="space-y-5">
              <h3 className="border-b border-gray-100 pb-2 text-lg font-medium text-black">
                {term.term}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={term.cover}
                    alt={`${term.term} Cover`}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
                <div className="relative aspect-square overflow-hidden rounded-lg">
                  <Image
                    src={term.date}
                    alt={`${term.term} Date`}
                    fill
                    sizes="50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
