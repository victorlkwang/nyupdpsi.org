import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <>
      <section className="relative h-[85vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/mobile/bg.png"
          alt="NYU Pi Delta Psi"
          fill
          priority
          className="object-cover object-center md:hidden"
        />
        <Image
          src="/images/desktop/bg.png"
          alt="NYU Pi Delta Psi"
          fill
          priority
          className="hidden object-cover object-center md:block"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 md:pb-24">
          <p className="text-center text-sm font-bold tracking-[0.3em] text-brand md:text-base">
            EST. 1997 · ZETA CHAPTER
          </p>
          <h1 className="mt-3 text-center text-6xl font-black uppercase leading-[0.95] tracking-tight text-white md:text-9xl">
            Pi Delta Psi
          </h1>
          <p className="mt-4 text-center text-lg font-medium uppercase tracking-[0.2em] text-gray-300 md:text-2xl">
            New York University
          </p>
        </div>

        <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center">
          <span className="text-2xl text-white/70 animate-bounce">↓</span>
        </div>
      </section>

      <section className="w-full bg-black py-20">
        <FadeIn className="mx-auto w-[85%] text-center md:w-[60%]">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-brand">OUR CREED</p>
          <p className="text-2xl font-semibold leading-snug text-white md:text-4xl">
            The fastest growing Asian-American interest fraternity in the United States.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base text-gray-400 md:text-lg">
            Founded in the spring of 1997, the Zeta Chapter of Pi Delta Psi at New York University
            is home to 20+ active brothers from all backgrounds, joined by one brotherhood.
          </p>
        </FadeIn>
      </section>

      <section className="w-full bg-black pb-24">
        <FadeIn className="mx-auto flex max-w-3xl items-center justify-center">
          <div className="relative w-full max-w-md">
            <div className="absolute inset-0 -z-10 rounded-full bg-brand/20 blur-3xl" />
            <Image
              src="/images/desktop/pdpsi_logo.png"
              alt="Pi Delta Psi Logo"
              width={800}
              height={280}
              className="mx-auto h-auto w-full object-contain"
            />
          </div>
        </FadeIn>
      </section>

      <section className="w-full bg-white px-4 py-24 text-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-16">
          <FadeIn className="w-full md:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden rounded-2xl shadow-xl ring-1 ring-black/5">
              <Image
                src="/images/desktop/prez.jpg"
                alt="Chapter President"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn className="w-full md:w-1/2" delayMs={150}>
            <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">
              FROM THE CHAPTER PRESIDENT
            </p>
            <h2 className="mb-6 text-3xl font-black uppercase leading-tight tracking-tight md:text-5xl">
              A letter to you
            </h2>
            <p className="mb-4 text-lg font-semibold leading-snug text-gray-900">
              &ldquo;Being part of Pi Delta Psi has given me the opportunity to form lifelong
              bonds with incredible brothers — united through shared values and a commitment to
              growth.&rdquo;
            </p>
            <p className="mb-4 text-gray-600">
              Welcome to the official website of NYU&rsquo;s Pi Delta Psi Fraternity, Inc., Zeta
              Chapter. Pi Delta Psi was founded in 1994, and the Zeta Chapter at NYU was
              established in 1997 based on the pillars of academic achievement, cultural
              awareness, righteousness, and brotherhood.
            </p>
            <p className="mb-6 text-gray-600">
              If you&rsquo;d like to learn more, feel free to reach out or explore the rest of our
              site. Our brotherhood welcomes all who share in our vision.
            </p>
            <p className="font-bold uppercase tracking-wide text-black">
              — Brandon Tang
              <span className="ml-2 font-normal normal-case text-gray-500">Chapter President</span>
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="relative w-full overflow-hidden bg-ink px-6 py-24 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black via-ink to-brand-dark/30" />
        <FadeIn>
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-brand">JOIN THE LEGACY</p>
          <h2 className="mb-8 text-4xl font-black uppercase leading-tight tracking-tight text-white md:text-6xl">
            Interested in
            <br />
            Joining?
          </h2>
          <Link
            href="/rush"
            className="inline-block rounded-full bg-brand px-12 py-5 text-lg font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition duration-200 hover:scale-105 hover:bg-brand-dark md:text-xl"
          >
            Rush Now
          </Link>
        </FadeIn>
      </section>
    </>
  );
}
