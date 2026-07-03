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
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/beta-etas.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            EARN YOUR LETTERS
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-10">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-start md:gap-6 md:text-left">
            <h2 className="text-3xl font-extrabold tracking-tight text-black md:text-4xl">
              {currentRush.term}
            </h2>
            <a
              href={currentRush.formUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-red-600 md:text-base"
            >
              Rush Interest Form
            </a>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
              <Image
                src={currentRush.cover}
                alt={`${currentRush.term} Cover`}
                width={800}
                height={800}
                className="h-auto w-full object-contain"
              />
            </div>
            <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
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

      <section className="bg-white px-6 py-16">
        <div className="mx-auto max-w-6xl space-y-16">
          <h2 className="text-center text-4xl font-extrabold">Rush Archive</h2>

          {rushArchive.map((term) => (
            <div key={term.term} className="space-y-6">
              <h3 className="border-b border-gray-300 pb-2 text-2xl font-bold md:text-3xl">
                {term.term}
              </h3>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="group relative aspect-square overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={term.cover}
                    alt={`${term.term} Cover`}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="group relative aspect-square overflow-hidden rounded-3xl shadow-xl">
                  <Image
                    src={term.date}
                    alt={`${term.term} Date`}
                    fill
                    sizes="50vw"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
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
