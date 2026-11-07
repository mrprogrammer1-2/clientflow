"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { requireCurrentUser } from "@/lib/services/current-user";
import { requireAgencyAdmin } from "@/lib/services/check-agency-admin";
import { redirect } from "next/navigation";
import archiveClient from "@/lib/services/archive-client";
import restoreClient from "@/lib/services/restore-client";
import { and, eq } from "drizzle-orm";

export async function createClientAction(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!name || !companyName || !email) {
    throw new Error("Name, company name, and email are required.");
  }

  const user = await requireCurrentUser();

  await db.insert(clients).values({
    agencyId: user.agencyId,
    name,
    companyName,
    email,
    phone: phone || null,
  });

  revalidatePath("/dashboard/clients");
}

export async function archiveClientAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");

  if (!clientId) {
    throw new Error("Client ID is required.");
  }

  const user = await requireAgencyAdmin();

  const result = await archiveClient({
    clientId,
    agencyId: user.agencyId,
  });

  if (!result) {
    throw new Error("Failed to archive client.");
  }

  redirect(`/dashboard/clients/archived`);
}

export async function updateClientAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  if (!clientId || !name || !companyName || !email) {
    throw new Error("Name, company name, and email are required.");
  }

  const user = await requireCurrentUser();

  const result = await db
    .update(clients)
    .set({ name, companyName, email, phone: phone || null })
    .where(and(eq(clients.id, clientId), eq(clients.agencyId, user.agencyId)));

  if (result.rowCount === 0) {
    throw new Error("Client not found.");
  }

  revalidatePath("/dashboard/clients");
  redirect(`/dashboard/clients/${clientId}`);
}

export async function restoreClientAction(formData: FormData) {
  const clientId = String(formData.get("clientId") ?? "");
  if (!clientId) throw new Error("Client ID is required.");

  const user = await requireAgencyAdmin();
  const result = await restoreClient({ clientId, agencyId: user.agencyId });
  if (!result) throw new Error("Failed to restore client.");

  revalidatePath("/dashboard/clients");
  revalidatePath("/dashboard/clients/archived");
}
