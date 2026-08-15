import { redirect } from "next/navigation";

import { Customizer } from "@/components/admin/Customizer";
import { getSession } from "@/lib/auth/session";
import { findUserById, toPublicUser } from "@/lib/auth/users";
import { readDraftRecord, readPublishedRecord } from "@/lib/theme/store";

// The customizer always edits the current draft on disk, never a cached copy.
export const dynamic = "force-dynamic";

export default async function AdminCustomizerPage() {
  const session = await getSession();
  if (!session) redirect("/admin/login");

  const user = await findUserById(session.sub);
  if (!user) redirect("/admin/login");

  const [draft, published] = await Promise.all([
    readDraftRecord(),
    readPublishedRecord(),
  ]);

  return (
    <Customizer
      user={toPublicUser(user)}
      initialDraft={draft.settings}
      initialPublished={published.settings}
    />
  );
}
