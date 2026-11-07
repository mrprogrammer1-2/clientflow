import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireCurrentUser } from "@/lib/services/current-user";
import { updateClientAction } from "../../actions";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const user = await requireCurrentUser();

  const [client] = await db
    .select()
    .from(clients)
    .where(and(eq(clients.id, clientId), eq(clients.agencyId, user.agencyId)))
    .limit(1);

  if (!client) notFound();

  return (
    <main className="app-shell max-w-2xl space-y-6 py-8 sm:py-12">
      <Link
        href={`/dashboard/clients/${client.id}`}
        className="text-sm font-semibold text-primary hover:underline"
      >
        Back to client
      </Link>
      <h1 className="text-3xl font-extrabold">Edit client</h1>

      <form action={updateClientAction} className="space-y-4">
        <input type="hidden" name="clientId" value={client.id} />
        <input name="name" required defaultValue={client.name} placeholder="Contact name" className="w-full rounded-lg border border-border px-3 py-2.5" />
        <input name="companyName" required defaultValue={client.companyName} placeholder="Company name" className="w-full rounded-lg border border-border px-3 py-2.5" />
        <input name="email" type="email" required defaultValue={client.email} placeholder="Email address" className="w-full rounded-lg border border-border px-3 py-2.5" />
        <input name="phone" type="tel" defaultValue={client.phone ?? ""} placeholder="Phone number (optional)" className="w-full rounded-lg border border-border px-3 py-2.5" />
        <button type="submit" className="btn btn-primary">
          Save changes
        </button>
      </form>
    </main>
  );
}
