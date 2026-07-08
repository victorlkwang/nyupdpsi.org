import Link from "next/link";

// Small "← Back to account" link shown at the top of the bro/admin pages.
export default function BackToAccount() {
  return (
    <Link
      href="/account"
      className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-red-600"
    >
      <span aria-hidden="true">&larr;</span> Back to account
    </Link>
  );
}
