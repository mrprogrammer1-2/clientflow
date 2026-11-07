import { and, desc, eq, sql } from "drizzle-orm";
import Link from "next/link";
import { StepTrack } from "@/components/step-track";
import { db } from "@/db";
import {
  clients,
  projectOnboardings,
  projectOnboardingSteps,
  projects,
} from "@/db/schema";
import { requireCurrentUser } from "@/lib/services/current-user";

export default async function DashboardPage() {
  const appUser = await requireCurrentUser();
  const name = appUser.kindeUser?.given_name ?? "there";

  const [{ activeClients }] = await db
    .select({ activeClients: sql<number>`count(*)::int` })
    .from(clients)
    .where(
      and(eq(clients.agencyId, appUser.agencyId), eq(clients.status, "active")),
    );

  // One row per active project with its onboarding status.
  const projectRows = await db
    .select({
      id: projects.id,
      name: projects.name,
      clientName: clients.companyName,
      onboardingId: projectOnboardings.id,
      onboardingStatus: projectOnboardings.status,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .leftJoin(projectOnboardings, eq(projectOnboardings.projectId, projects.id))
    .where(
      and(
        eq(clients.agencyId, appUser.agencyId),
        eq(projects.status, "active"),
      ),
    )
    .orderBy(desc(projects.createdAt));

  // Step counts per onboarding for progress bars.
  const stepCounts = await db
    .select({
      onboardingId: projectOnboardingSteps.projectOnboardingId,
      total: sql<number>`count(*)::int`,
      done: sql<number>`count(*) filter (where ${projectOnboardingSteps.status} = 'completed')::int`,
    })
    .from(projectOnboardingSteps)
    .innerJoin(
      projectOnboardings,
      eq(projectOnboardings.id, projectOnboardingSteps.projectOnboardingId),
    )
    .innerJoin(projects, eq(projects.id, projectOnboardings.projectId))
    .innerJoin(clients, eq(clients.id, projects.clientId))
    .where(eq(clients.agencyId, appUser.agencyId))
    .groupBy(projectOnboardingSteps.projectOnboardingId);

  const stepsByOnboarding = new Map(
    stepCounts.map((s) => [s.onboardingId, { total: s.total, done: s.done }]),
  );

  const pending = projectRows.filter(
    (p) => p.onboardingStatus && p.onboardingStatus !== "completed",
  );
  const completed = projectRows.filter(
    (p) => p.onboardingStatus === "completed",
  );

  const stats = [
    { label: "Active clients", value: activeClients },
    { label: "Active projects", value: projectRows.length },
    { label: "Onboarding in progress", value: pending.length },
    { label: "Onboarding complete", value: completed.length },
  ];

  return (
    <main className="app-shell py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Hello, {name}</h1>
      <p className="mt-1 text-gray-600">
        Here is where your client onboardings stand.
      </p>

      <dl className="mt-10 grid grid-cols-2 border-y border-border lg:grid-cols-4">
        {stats.map(({ label, value }) => (
          <div
            key={label}
            className="border-border px-5 py-5 first:pl-0 max-lg:nth-[n+3]:border-t max-lg:even:border-l lg:not-first:border-l"
          >
            <dd className="font-[family-name:var(--font-heading)] text-4xl font-extrabold tracking-tight">
              {value}
            </dd>
            <dt className="mt-1 text-sm text-gray-600">{label}</dt>
          </div>
        ))}
      </dl>

      <section className="mt-12">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-2xl font-bold">Active projects</h2>
          <Link
            href="/dashboard/projects"
            className="text-sm font-semibold text-primary hover:underline"
          >
            All projects
          </Link>
        </div>

        {projectRows.length === 0 ? (
          <div className="card mt-5 p-8">
            <p className="font-semibold">No active projects yet.</p>
            <p className="mt-1 text-gray-600">
              Add a client, then create a project from a template to send them
              their onboarding link.
            </p>
            <Link
              href="/dashboard/clients"
              className="btn btn-primary mt-5 inline-flex"
            >
              Add a client
            </Link>
          </div>
        ) : (
          <ul className="mt-5 divide-y divide-border border-y border-border">
            {projectRows.map((p) => {
              const counts = p.onboardingId
                ? stepsByOnboarding.get(p.onboardingId)
                : undefined;
              const total = counts?.total ?? 0;
              const done = counts?.done ?? 0;
              return (
                <li key={p.id}>
                  <Link
                    href={`/dashboard/projects/${p.id}`}
                    className="grid gap-3 py-4 hover:bg-muted/60 sm:grid-cols-[1fr_16rem] sm:items-center sm:gap-8 sm:px-3"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-semibold">{p.name}</p>
                      <p className="truncate text-sm text-gray-600">
                        {p.clientName}
                      </p>
                    </div>
                    <div>
                      <StepTrack total={total} done={done} />
                      <p className="mt-1.5 text-xs text-gray-600">
                        {p.onboardingStatus === "completed"
                          ? "Onboarding complete"
                          : total === 0
                            ? "No onboarding steps"
                            : `${done} of ${total} steps done`}
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </main>
  );
}
