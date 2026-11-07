import { db } from "@/db";
import { clients } from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function restoreClient(params: {
  clientId: string;
  agencyId: string;
}) {
  const result = await db
    .update(clients)
    .set({ status: "active", updatedAt: new Date() })
    .where(
      and(
        eq(clients.id, params.clientId),
        eq(clients.agencyId, params.agencyId),
      ),
    );

  return result.rowCount === 0 ? null : { success: true };
}
