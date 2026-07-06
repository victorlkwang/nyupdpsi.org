import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with the Zeta Chapter of Pi Delta Psi at NYU.",
};

// Not linked from the nav yet (matches the old site, where this link was
// commented out). Kept as a route since it's already indexed / bookmarked
// by some, but it's still just a placeholder banner with no way to actually
// reach out — worth building out for real before linking it back in.
export default function ContactPage() {
  return (
    <section className="relative h-[65vh] w-full overflow-hidden md:h-screen">
      <Image src="/images/desktop/cross.png" alt="" fill className="object-cover object-center" />
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 text-center">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg md:text-6xl">CONTACT US</h1>
      </div>
    </section>
  );
}
