"use client";

import Image from "next/image";
import { useState } from "react";
import type { RosterByClass, RosterMember } from "@/data/types";

function Overlay({ member, visibilityClass }: { member: RosterMember; visibilityClass: string }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center bg-black/80 px-4 transition-opacity duration-300 ${visibilityClass}`}
    >
      <div className="space-y-1 text-center text-sm text-white">
        <p className="text-lg font-semibold text-brand">{member.number}</p>
        <p className="text-lg font-semibold">{member.name}</p>
        {member.major && <p>Major: {member.major}</p>}
        {member.year && <p>Year: {member.year}</p>}
        <p>Big: {member.big}</p>
        <p>Little: {member.little}</p>
      </div>
    </div>
  );
}

function DesktopCard({ member }: { member: RosterMember }) {
  return (
    <div className="group relative h-80 overflow-hidden rounded-lg ring-1 ring-white/10 transition duration-300 hover:ring-brand/60 hover:shadow-lg hover:shadow-brand/20">
      <Image
        src={member.src}
        alt={member.name}
        fill
        sizes="25vw"
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <Overlay member={member} visibilityClass="opacity-0 group-hover:opacity-100" />
    </div>
  );
}

function MobileCard({ member }: { member: RosterMember }) {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative h-80 overflow-hidden rounded-lg ring-1 ring-white/10"
      onClick={() => setShow((v) => !v)}
    >
      <Image src={member.src} alt={member.name} fill sizes="100vw" className="object-cover" />
      <Overlay member={member} visibilityClass={show ? "opacity-100" : "opacity-0"} />
    </div>
  );
}

export default function RosterGallery({
  data,
  defaultClass,
  emptyMessage = "No photos yet.",
}: {
  data: RosterByClass;
  defaultClass: string;
  emptyMessage?: string;
}) {
  const classes = Object.keys(data);
  const [activeClass, setActiveClass] = useState(defaultClass);
  const members = data[activeClass] ?? [];

  const columns: RosterMember[][] = [[], [], [], []];
  members.forEach((member, index) => columns[index % 4].push(member));

  return (
    <section className="bg-grid-pattern w-full bg-black py-16">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {classes.map((className) => (
            <button
              key={className}
              onClick={() => setActiveClass(className)}
              className={`rounded-full px-4 py-2 text-sm font-bold uppercase tracking-wide shadow transition-all duration-200 ${
                activeClass === className
                  ? "bg-brand text-white shadow-brand/40"
                  : "bg-white/10 text-gray-300 hover:bg-white/20"
              }`}
            >
              {className}
            </button>
          ))}
        </div>

        {members.length === 0 && <div className="text-center text-gray-400">{emptyMessage}</div>}

        <div className="hidden justify-between gap-6 md:flex">
          {columns.map((column, i) => (
            <div key={i} className="flex w-1/4 flex-col gap-5">
              {column.map((member) => (
                <DesktopCard key={member.src + member.number} member={member} />
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-4 md:hidden">
          {members.map((member) => (
            <MobileCard key={member.src + member.number} member={member} />
          ))}
        </div>
      </div>
    </section>
  );
}
