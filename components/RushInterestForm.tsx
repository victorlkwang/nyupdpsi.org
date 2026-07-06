"use client";

import { useState, type FormEvent } from "react";

const YEARS = ["Freshman", "Sophomore", "Junior", "Senior"] as const;
const YEAR_VALUES: Record<(typeof YEARS)[number], string> = {
  Freshman: "FRESHMAN",
  Sophomore: "SOPHOMORE",
  Junior: "JUNIOR",
  Senior: "SENIOR",
};

const SCHOOLS = ["Stern", "Steinhardt", "CAS", "Gallatin", "Tandon", "Tisch", "Other"] as const;
const SCHOOL_VALUES: Record<(typeof SCHOOLS)[number], string> = {
  Stern: "STERN",
  Steinhardt: "STEINHARDT",
  CAS: "CAS",
  Gallatin: "GALLATIN",
  Tandon: "TANDON",
  Tisch: "TISCH",
  Other: "OTHER",
};

const CONTACTS = [
  { name: "Joshua Lee", phone: "(408) 966-2782" },
  { name: "Cody Le", phone: "(214) 282-6906" },
  { name: "Caden Cewe", phone: "(954) 909-2741" },
  { name: "William Song", phone: "(323) 247-1004" },
  { name: "Kason Lin", phone: "(678) 749-9500" },
];

const inputClass =
  "w-full rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm text-black focus:border-red-600 focus:outline-none focus:ring-1 focus:ring-red-600";
const labelClass = "mb-1 block text-sm font-semibold text-black";

type Status = "idle" | "submitting" | "success" | "error";

export default function RushInterestForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const year = formData.get("year") as keyof typeof YEAR_VALUES;
    const school = formData.get("school") as keyof typeof SCHOOL_VALUES;

    const payload = {
      email: formData.get("email"),
      fullName: formData.get("fullName"),
      nyuEmail: formData.get("nyuEmail"),
      phoneNumber: formData.get("phoneNumber"),
      year: YEAR_VALUES[year],
      school: SCHOOL_VALUES[school],
      instagramHandle: formData.get("instagramHandle"),
      company: formData.get("company"),
    };

    try {
      const response = await fetch("/api/rush-applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = await response.json();

      if (!response.ok) {
        setStatus("error");
        setErrorMessage(body.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-gray-200 bg-white p-6 shadow-xl md:p-10">
      <h3 className="text-center text-2xl font-extrabold text-black md:text-3xl">
        NYU Pi Delta Psi Rush Interest Form
      </h3>

      <p className="mt-4 text-sm leading-relaxed text-gray-700">
        Thank you for showing an interest in NYU Pi Delta Psi. All of our brothers are excited to
        meet you in person this fall during our rush for the Beta Lambda class. Please fill out
        this form to stay updated with all of our ongoing rush events. If you want to talk to a
        brother one on one, please go ahead and fill out the coffee chat form as well and a
        brother will get in touch with you as soon as possible.
      </p>

      <p className="mt-4 text-center text-sm font-semibold italic text-red-700">
        All rush events along with this interest form are free and non-binding.
      </p>

      <div className="mt-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-red-600">About Us</h4>
        <p className="mt-2 text-sm leading-relaxed text-gray-700">
          Pi Delta Psi is an Asian American interest fraternity (but not an Asian exclusive
          cultural org). Our primary mission is to spread Asian American cultural awareness in an
          effort to empower the entire community. We are guided by four pillars: Academic
          Achievement, Cultural Awareness, Righteousness, and Friendship/Loyalty.
        </p>
      </div>

      <div className="mt-8">
        <h4 className="text-xs font-bold uppercase tracking-widest text-red-600">Contact Info</h4>
        <ul className="mt-2 grid grid-cols-1 gap-x-6 gap-y-1 text-sm text-gray-700 sm:grid-cols-2">
          {CONTACTS.map((contact) => (
            <li key={contact.name}>
              <span className="font-semibold text-black">{contact.name}:</span> {contact.phone}
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-8 text-sm text-gray-700">
        Thank you again for your interest and feel free to check out our other pages!{" "}
        <a
          href="https://www.instagram.com/nyupdpsi"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-red-600 hover:underline"
        >
          Instagram
        </a>{" "}
        &middot;{" "}
        <a
          href="https://nyupdpsi.org"
          className="font-semibold text-red-600 hover:underline"
        >
          Website
        </a>
      </p>

      <hr className="my-8 border-gray-200" />

      {status === "success" ? (
        <div className="rounded-lg bg-black px-6 py-8 text-center text-white">
          <p className="text-lg font-bold">You&rsquo;re on the list!</p>
          <p className="mt-2 text-sm text-gray-300">
            We&rsquo;ll be in touch with rush updates for the Beta Lambda class.
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Honeypot field, hidden from real users */}
          <div className="absolute -left-[9999px]" aria-hidden="true">
            <label htmlFor="company">Company</label>
            <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>
              Email *
            </label>
            <input id="email" name="email" type="email" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="fullName" className={labelClass}>
              Full Name *
            </label>
            <input id="fullName" name="fullName" type="text" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="nyuEmail" className={labelClass}>
              NYU Email *
            </label>
            <input
              id="nyuEmail"
              name="nyuEmail"
              type="email"
              required
              placeholder="netid@nyu.edu"
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="phoneNumber" className={labelClass}>
              Phone Number *
            </label>
            <input id="phoneNumber" name="phoneNumber" type="tel" required className={inputClass} />
          </div>

          <div>
            <label htmlFor="year" className={labelClass}>
              What year are you? *
            </label>
            <select id="year" name="year" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select one
              </option>
              {YEARS.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="school" className={labelClass}>
              What school are you in? *
            </label>
            <select id="school" name="school" required defaultValue="" className={inputClass}>
              <option value="" disabled>
                Select one
              </option>
              {SCHOOLS.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="instagramHandle" className={labelClass}>
              Instagram Handle (If Applicable)
            </label>
            <input
              id="instagramHandle"
              name="instagramHandle"
              type="text"
              placeholder="@yourhandle"
              className={inputClass}
            />
          </div>

          {status === "error" && <p className="text-sm font-semibold text-red-700">{errorMessage}</p>}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition duration-300 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {status === "submitting" ? "Submitting..." : "Submit"}
          </button>
        </form>
      )}
    </div>
  );
}
