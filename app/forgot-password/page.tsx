import type { Metadata } from "next";
import ForgotPasswordForm from "@/components/ForgotPasswordForm";
import { cardClass } from "@/components/formStyles";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <section className="px-4 py-16">
      <div className={cardClass}>
        <h1 className="mb-6 text-center text-2xl font-extrabold text-black">Forgot Password</h1>
        <ForgotPasswordForm />
      </div>
    </section>
  );
}
