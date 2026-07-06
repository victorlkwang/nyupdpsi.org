"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/active-house", label: "ACTIVE HOUSE" },
  { href: "/alumni", label: "ALUMNI" },
  { href: "/rush", label: "RUSH" },
];

const navLinkClass = "font-medium text-white transition-colors hover:text-brand";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-black text-white shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-2">
        <Link href="/" className="block h-[80px] w-[140px] md:w-[180px]">
          <Image
            src="/images/desktop/pdpsi.png"
            alt="NYU Pi Delta Psi Logo"
            width={180}
            height={80}
            className="h-auto w-full"
            priority
          />
        </Link>

        <button
          className="text-2xl text-white md:hidden"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          ☰
        </button>

        <nav className="hidden space-x-6 md:flex">
          {NAV_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className={navLinkClass}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      {menuOpen && (
        <nav className="flex w-full flex-col items-end space-y-2 px-4 pb-4 text-right md:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={navLinkClass}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
