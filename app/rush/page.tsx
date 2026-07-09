import type { Metadata } from "next";
import Image from "next/image";
import RushInterestForm from "@/components/RushInterestForm";
import AttendanceForm from "@/components/AttendanceForm";
import { prisma } from "@/lib/prisma";
import { EVENT_LABEL } from "@/lib/events";
import { currentRush, rushArchive } from "@/data/rush";

export const metadata: Metadata = {
  title: "Rush",
  description: "Rush the Zeta Chapter of Pi Delta Psi at NYU. Earn your letters.",
};

export const dynamic = "force-dynamic";

export default async function RushPage() {
  const setting = await prisma.formSetting.findUnique({ where: { id: 1 } });
  const activeEvent = setting?.activeEvent ?? null;

  // When an event is active, the interest form is replaced by that event's
  // attendance sign-in (term graphics/archive hidden to keep check-in focused).
  if (activeEvent) {
    return (
      <>
        <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
          <Image
            src="/images/desktop/beta-etas.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
            <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">SIGN IN</h1>
          </div>
        </section>
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-6xl">
            <AttendanceForm eventLabel={EVENT_LABEL[activeEvent]} />
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/beta-etas.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">
            EARN YOUR LETTERS
          </h1>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl space-y-16">
          {currentRush && (
            <h2 className="text-center text-3xl font-extrabold tracking-tight text-black md:text-4xl">
              {currentRush.term}
            </h2>
          )}

          <RushInterestForm />

          {currentRush && (
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
          )}
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
                <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                  <Image
                    src={term.cover}
                    alt={`${term.term} Cover`}
                    width={800}
                    height={800}
                    className="h-auto w-full object-contain"
                  />
                </div>
                <div className="overflow-hidden rounded-3xl bg-white shadow-xl">
                  <Image
                    src={term.date}
                    alt={`${term.term} Date`}
                    width={800}
                    height={800}
                    className="h-auto w-full object-contain"
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
