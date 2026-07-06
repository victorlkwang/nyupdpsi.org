import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import { socialLinks } from "@/data/social";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Zeta Chapter of Pi Delta Psi at NYU.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
        <Image
          src="/images/desktop/cross.png"
          alt=""
          fill
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10" />
        <div className="bg-grid-pattern absolute inset-0 opacity-30" />
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-end px-4 pb-16 text-center md:pb-24">
          <p className="mb-3 text-sm font-bold tracking-[0.3em] text-brand">GET IN TOUCH</p>
          <h1 className="text-4xl font-black uppercase leading-[0.95] tracking-tight text-white text-glow md:text-7xl">
            Contact Us
          </h1>
        </div>
      </section>

      <section className="w-full bg-black py-24 text-center">
        <FadeIn className="mx-auto w-[85%] md:w-[60%]">
          <p className="mb-4 text-sm font-bold tracking-[0.3em] text-brand">FOLLOW ALONG</p>
          <p className="mx-auto max-w-2xl text-lg text-gray-400 md:text-xl">
            The fastest way to reach the Zeta Chapter is through our socials — that&rsquo;s where
            we post events, rush updates, and everything else happening with the chapter.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-8 py-4 text-sm font-bold uppercase tracking-wide text-white transition duration-200 hover:border-brand hover:text-brand"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="mt-16">
            <p className="mb-4 text-sm font-bold tracking-[0.3em] text-brand">
              INTERESTED IN JOINING?
            </p>
            <Link
              href="/rush"
              className="inline-block rounded-full bg-brand px-10 py-4 text-lg font-bold uppercase tracking-wide text-white shadow-lg shadow-brand/30 transition duration-200 hover:scale-105 hover:bg-brand-dark"
            >
              Rush Now
            </Link>
          </div>
        </FadeIn>
      </section>
    </>
  );
}
