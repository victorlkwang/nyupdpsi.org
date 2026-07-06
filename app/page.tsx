import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";

export default function HomePage() {
  return (
    <>
      <section className="relative h-[70vh] w-full overflow-hidden md:h-screen">
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
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-16 md:pb-20">
          <h1 className="text-center text-5xl font-semibold tracking-tight text-white md:text-7xl">
            NYU Pi Delta Psi
          </h1>
          <p className="mt-3 text-center text-base text-gray-200 md:text-xl">Zeta Chapter</p>
        </div>
      </section>

      <section className="w-full bg-white py-20">
        <FadeIn className="mx-auto w-[85%] text-center md:w-[60%]">
          <p className="text-xl leading-snug text-gray-900 md:text-2xl">
            Pi Delta Psi is the fastest growing Asian-American interest fraternity in the United
            States.
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-base text-gray-500">
            Founded in the spring of 1997, the Zeta Chapter of Pi Delta Psi at New York University
            is home to 20+ active brothers from all backgrounds, joined by one brotherhood.
          </p>
        </FadeIn>
      </section>

      <section className="w-full bg-white pb-20">
        <FadeIn className="mx-auto flex max-w-md items-center justify-center">
          <Image
            src="/images/desktop/pdpsi_logo.png"
            alt="Pi Delta Psi Logo"
            width={800}
            height={280}
            className="mx-auto h-auto w-full object-contain"
          />
        </FadeIn>
      </section>

      <section className="w-full border-t border-gray-100 bg-white px-4 py-20 text-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 md:flex-row md:gap-16">
          <FadeIn className="w-full md:w-1/2">
            <div className="relative aspect-square w-full overflow-hidden rounded-lg">
              <Image
                src="/images/desktop/prez.jpg"
                alt="Chapter President"
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </FadeIn>

          <FadeIn className="w-full md:w-1/2" delayMs={100}>
            <h2 className="mb-5 text-2xl font-semibold tracking-tight md:text-3xl">
              A letter from our chapter president
            </h2>
            <p className="mb-4 text-gray-600">
              Welcome to the official website of NYU&rsquo;s Pi Delta Psi Fraternity, Inc., Zeta
              Chapter. Pi Delta Psi was founded in 1994, and the Zeta Chapter at NYU was
              established in 1997 based on the pillars of academic achievement, cultural
              awareness, righteousness, and brotherhood.
            </p>
            <p className="mb-4 text-gray-600">
              Being part of Pi Delta Psi has given me the opportunity to form lifelong bonds with
              incredible brothers — united through shared values and a commitment to growth.
              I&rsquo;m proud to lead this chapter and continue building a community rooted in
              culture and character.
            </p>
            <p className="mb-6 text-gray-600">
              If you&rsquo;d like to learn more, feel free to reach out or explore the rest of our
              site. Our brotherhood welcomes all who share in our vision.
            </p>
            <p className="font-medium text-black">
              — Brandon Tang
              <span className="ml-2 text-gray-400">Chapter President</span>
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="w-full border-t border-gray-100 bg-white px-6 py-20 text-center">
        <h2 className="mb-6 text-2xl font-semibold tracking-tight text-black md:text-4xl">
          Interested in Joining?
        </h2>
        <Link
          href="/rush"
          className="inline-block rounded-full bg-brand px-9 py-3 text-base font-medium text-white transition hover:bg-black"
        >
          Rush
        </Link>
      </section>
    </>
  );
}
