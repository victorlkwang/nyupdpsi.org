import type { Metadata } from "next";
import SignupForm from "@/components/SignupForm";
import { cardClass } from "@/components/formStyles";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <section className="px-4 py-16">
      <div className={cardClass}>
        <h1 className="mb-6 text-center text-2xl font-extrabold text-black">Create Account</h1>
        <SignupForm />
      </div>
    </section>
  );
}
