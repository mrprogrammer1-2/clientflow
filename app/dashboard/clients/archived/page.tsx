import { and, desc, eq } from "drizzle-orm";
import Link from "next/link";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireCurrentUser } from "@/lib/services/current-user";
import { restoreClientAction } from "../actions";

export default async function ArchivedClientsPage() {
  const user = await requireCurrentUser();
  const canRestore = user.role === "admin" || user.role === "owner";

  const archived = await db
    .select()
    .from(clients)
    .where(
      and(eq(clients.agencyId, user.agencyId), eq(clients.status, "archived")),
    )
    .orderBy(desc(clients.updatedAt));

  return (
    <main className="app-shell space-y-6 py-8 sm:py-12">
      <Link href="/dashboard/clients" className="text-sm font-semibold text-primary hover:underline">
        All clients
      </Link>
      <h1 className="text-3xl font-extrabold">Archived clients</h1>

      {archived.length === 0 ? (
        <p className="text-gray-600">No archived clients. Clients you archive show up here.</p>
      ) : (
        <div className="divide-y divide-border border-y border-border">
          {archived.map((client) => (
            <article key={client.id} className="flex items-center justify-between gap-4 py-4">
              <div>
                <Link href={`/dashboard/clients/${client.id}`} className="font-semibold hover:underline">
                  {client.companyName}
                </Link>
                <p>{client.name}</p>
                <p className="text-sm text-gray-600">{client.email}</p>
              </div>
              {canRestore ? (
                <form action={restoreClientAction}>
                  <input type="hidden" name="clientId" value={client.id} />
                  <button type="submit" className="btn btn-quiet">
                    Restore
                  </button>
                </form>
              ) : null}
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
