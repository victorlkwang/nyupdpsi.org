import type { Metadata } from "next";
import LoginForm from "@/components/LoginForm";
import { cardClass } from "@/components/formStyles";

export const metadata: Metadata = { title: "Log In" };

const ERROR_MESSAGES: Record<string, string> = {
  "invalid-link": "That verification link was invalid. Try signing up again.",
  "expired-link": "That verification link has expired. Try signing up again to get a new one.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified?: string; reset?: string; error?: string }>;
}) {
  const params = await searchParams;
  let notice = "";
  if (params.verified) notice = "Email verified! You can now log in.";
  else if (params.reset) notice = "Password updated! Log in with your new password.";
  const errorMessage = params.error ? ERROR_MESSAGES[params.error] : "";

  return (
    <section className="px-4 py-16">
      <div className={cardClass}>
        <h1 className="mb-6 text-center text-2xl font-extrabold text-black">Log In</h1>
        {errorMessage && (
          <p className="mb-5 rounded-lg bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            {errorMessage}
          </p>
        )}
        <LoginForm notice={notice} />
      </div>
    </section>
  );
}
