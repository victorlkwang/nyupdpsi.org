import type { Metadata } from "next";
import Link from "next/link";
import { requireRole } from "@/lib/auth";
import { getTemplate } from "@/lib/messaging";
import MessageTemplateEditor from "@/components/admin/MessageTemplateEditor";

export const metadata: Metadata = { title: "Rush Messages" };
export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  await requireRole("ADMIN");
  const [thankYou, goodKid] = await Promise.all([getTemplate("THANK_YOU"), getTemplate("GOOD_KID")]);

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <Link
        href="/admin"
        className="mb-6 inline-flex items-center gap-1.5 text-sm font-semibold text-gray-500 transition-colors hover:text-red-600"
      >
        <span aria-hidden="true">&larr;</span> Back to admin
      </Link>
      <h1 className="text-2xl font-extrabold text-black">Rush Messages</h1>
      <p className="mt-1 mb-6 text-sm text-gray-600">
        Customize the messages sent to rushees over email and text. Use{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">{"{{firstName}}"}</code> or{" "}
        <code className="rounded bg-gray-100 px-1 py-0.5 text-xs">{"{{name}}"}</code> to insert the
        rushee&rsquo;s name.
      </p>

      <div className="space-y-8">
        <MessageTemplateEditor
          kind="THANK_YOU"
          title="Automatic thank-you"
          description="Sent automatically the moment a rushee submits the interest form."
          template={thankYou}
        />
        <MessageTemplateEditor
          kind="GOOD_KID"
          title="Follow-up message"
          description="Sent to the rushees you select on the Applications page when you hit “Send message”."
          template={goodKid}
        />
      </div>
    </section>
  );
}
