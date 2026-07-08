import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="relative h-[70vh] w-full overflow-hidden md:h-screen">
        {/* Single responsive background: object-cover fluidly fills any screen
            size and keeps the crest centered, so no separate mobile crop needed. */}
        <Image
          src="/images/desktop/bg.webp"
          alt="NYU Pi Delta Psi"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />

        <div className="absolute left-1/2 top-12 z-10 w-[90%] -translate-x-1/2 md:top-36">
          <h1 className="px-4 text-center text-4xl font-bold text-white md:text-8xl">
            NYU Pi Delta Psi
          </h1>
        </div>

        <div className="absolute bottom-12 left-1/2 z-10 w-[90%] -translate-x-1/2 md:bottom-36">
          <h1 className="px-4 text-center text-4xl font-bold text-white md:text-8xl">
            Zeta Chapter
          </h1>
        </div>
      </section>

      <section className="w-full bg-black">
        <div className="mx-auto w-[80%] text-center md:w-[60%]">
          <h2 className="mb-3 text-2xl font-bold text-white md:text-4xl">
            Pi Delta Psi Fraternity, Incorporated
          </h2>
          <p className="text-xs text-gray-400 md:text-2xl">
            Pi Delta Psi is the fastest growing Asian-American interest fraternity in the United
            States. Founded in the spring of 1997, the Zeta Chapter of Pi Delta Psi at New York
            University is home to 20+ active brothers from all backgrounds, joined by one
            brotherhood.
          </p>
        </div>
      </section>

      <section className="w-full bg-black py-8">
        {/* Single responsive logo band: object-cover in a fluid-height box keeps
            the crest prominent on phones and shows more of the artwork on wide
            screens. The image's black background blends with the section. */}
        <div className="relative mx-auto h-56 w-full max-w-6xl sm:h-64 md:h-72 lg:h-80">
          <Image
            src="/images/desktop/pdpsi_logo.webp"
            alt="Pi Delta Psi Logo"
            fill
            sizes="(min-width: 1152px) 1152px, 100vw"
            className="object-cover object-center"
          />
        </div>
      </section>

      <section className="w-full bg-white px-4 py-10 text-black">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 md:flex-row">
          <div className="aspect-square w-full overflow-hidden rounded-lg shadow-md md:w-1/2">
            <Image
              src="/images/desktop/prez.webp"
              alt="Chapter President"
              width={600}
              height={600}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div className="w-full md:ml-6 md:w-1/2">
            <h2 className="mb-4 text-2xl font-bold md:text-3xl">
              A LETTER FROM OUR CHAPTER PRESIDENT
            </h2>
            <p className="mb-4 text-gray-800">
              Welcome to the official website of NYU&rsquo;s Pi Delta Psi Fraternity, Inc., Zeta
              Chapter. Pi Delta Psi was founded in 1994, and the Zeta Chapter at NYU was
              established in 1997 based on the pillars of academic achievement, cultural
              awareness, righteousness, and brotherhood.
            </p>
            <p className="mb-4 text-gray-800">
              Being part of Pi Delta Psi has given me the opportunity to form lifelong bonds with
              incredible brothers — united through shared values and a commitment to growth.
              I&rsquo;m proud to lead this chapter and continue building a community rooted in
              culture and character.
            </p>
            <p className="mb-4 text-gray-800">
              If you&rsquo;d like to learn more, feel free to reach out or explore the rest of our
              site. Our brotherhood welcomes all who share in our vision.
            </p>
            <p className="font-bold italic">— Brandon Tang, Chapter President</p>
          </div>
        </div>
      </section>

      <section className="w-full bg-white px-6 py-10 text-center text-black">
        <h2 className="mb-6 text-2xl font-bold md:text-4xl">Interested in Joining?</h2>
        <Link
          href="/rush"
          className="inline-block rounded-full bg-red-800 px-10 py-4 text-lg font-semibold text-white shadow-md transition duration-200 hover:bg-red-700"
        >
          Rush
        </Link>
      </section>
    </>
  );
}
