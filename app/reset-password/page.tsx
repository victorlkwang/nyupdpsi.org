import type { Metadata } from "next";
import ResetPasswordForm from "@/components/ResetPasswordForm";
import { cardClass } from "@/components/formStyles";

export const metadata: Metadata = { title: "Reset Password" };

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  return (
    <section className="px-4 py-16">
      <div className={cardClass}>
        <h1 className="mb-6 text-center text-2xl font-extrabold text-black">Reset Password</h1>
        <ResetPasswordForm token={token ?? ""} />
      </div>
    </section>
  );
}
