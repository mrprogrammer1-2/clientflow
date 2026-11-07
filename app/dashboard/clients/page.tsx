import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "@/db";
import { clients } from "@/db/schema";
import { createClientAction } from "@/app/dashboard/clients/actions";
import { requireCurrentUser } from "@/lib/services/current-user";
import Link from "next/link";

export default async function ClientsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const search = (q ?? "").trim();
  const user = await requireCurrentUser();

  const agencyClients = await db
    .select()
    .from(clients)
    .where(
      and(
        eq(clients.agencyId, user.agencyId),
        eq(clients.status, "active"),
        search
          ? or(
              ilike(clients.name, `%${search}%`),
              ilike(clients.companyName, `%${search}%`),
              ilike(clients.email, `%${search}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(clients.createdAt));

  const inputClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <main className="app-shell py-8 sm:py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Your relationships
          </p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Clients</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Keep your client contacts organized in one place.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            {search ? "Matching clients" : "Active clients"}
          </p>
          <p className="mt-1 text-2xl font-bold">{agencyClients.length}</p>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
        <section aria-labelledby="clients-heading">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 id="clients-heading" className="text-xl font-bold">
                Your clients
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Select a client to view their details and projects.
              </p>
            </div>
            <Link
              href="/dashboard/clients/archived"
              className="text-sm font-semibold text-primary hover:underline"
            >
              View archived
            </Link>
          </div>

          <form
            className="mt-5 flex flex-col gap-2 sm:flex-row"
            role="search"
          >
            <input
              name="q"
              defaultValue={search}
              aria-label="Search clients"
              placeholder="Search by name, company or email"
              className={inputClass}
            />
            <div className="flex gap-2">
              <button type="submit" className="btn btn-ink flex-1 sm:flex-none">
                Search
              </button>
              {search ? (
                <Link
                  href="/dashboard/clients"
                  className="btn btn-quiet flex-1 sm:flex-none"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </form>

          {agencyClients.length === 0 ? (
            <div className="mt-5 rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
              <h3 className="text-lg font-semibold">
                {search ? "No matching clients" : "No clients yet"}
              </h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
                {search
                  ? `No clients match "${search}". Try a different name, company, or email.`
                  : "Add your first client to keep their contact details and project work together."}
              </p>
            </div>
          ) : (
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {agencyClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <span
                      aria-hidden="true"
                      className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-accent text-lg font-bold text-accent-foreground"
                    >
                      {client.companyName.slice(0, 1).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-bold group-hover:text-primary">
                        {client.companyName}
                      </h3>
                      <p className="truncate text-sm text-gray-600">
                        {client.name}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm text-gray-600">
                    <p className="break-all">{client.email}</p>
                    {client.phone ? <p>{client.phone}</p> : null}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="card p-5 sm:p-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">
              New relationship
            </p>
            <h2 className="mt-1 text-xl font-bold">Add a client</h2>
            <p className="mt-1 text-sm text-gray-600">
              Save the main contact details to get started.
            </p>
          </div>

          <form action={createClientAction} className="mt-5 space-y-3">
            <input
              name="name"
              required
              aria-label="Contact name"
              placeholder="Contact name"
              className={inputClass}
            />
            <input
              name="companyName"
              required
              aria-label="Company name"
              placeholder="Company name"
              className={inputClass}
            />
            <input
              name="email"
              type="email"
              required
              aria-label="Email address"
              placeholder="Email address"
              className={inputClass}
            />
            <input
              name="phone"
              type="tel"
              aria-label="Phone number"
              placeholder="Phone number (optional)"
              className={inputClass}
            />
            <button type="submit" className="btn btn-primary w-full">
              Add client
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
