import { socialLinks } from "@/data/social";

export default function Footer() {
  return (
    <footer className="w-full bg-black px-6 py-8 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-center md:flex-row md:text-left">
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} Pi Delta Psi – Zeta Chapter @ NYU. All rights reserved.
        </div>
        <div className="flex gap-6 text-lg">
          {socialLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold transition duration-200 hover:text-brand"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
