import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Zeta Chapter of Pi Delta Psi at NYU.",
};

// Not linked from the nav (matches the old site, where this link was
// commented out) - kept as a route but intentionally left as-is.
export default function ContactPage() {
  return (
    <section className="relative h-[55vh] w-full overflow-hidden md:h-[70vh]">
      <Image src="/images/desktop/cross.png" alt="" fill className="object-cover object-center" />
      <div className="absolute inset-0 bg-black/35" />
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
        <h1 className="text-3xl font-semibold tracking-tight text-white md:text-5xl">
          Contact Us
        </h1>
      </div>
    </section>
  );
}
