import { db } from "@/db";
import { clients, onboardingTemplates, projects } from "@/db/schema";
import { requireCurrentUser } from "@/lib/services/current-user";
import { and, eq, desc } from "drizzle-orm";
import Link from "next/link";
import CreateProjectForm from "./create-project-form";
import DeleteProjectButton from "./delete-project-button";

export default async function ProjectsPage() {
  const user = await requireCurrentUser();

  const agencyProjects = await db
    .select({
      id: projects.id,
      name: projects.name,
      description: projects.description,
      status: projects.status,
      clientName: clients.name,
    })
    .from(projects)
    .innerJoin(clients, eq(projects.clientId, clients.id))
    .where(
      and(eq(clients.agencyId, user.agencyId), eq(projects.status, "active")),
    )
    .orderBy(desc(projects.createdAt));

  const agencyClients = await db
    .select({
      id: clients.id,
      name: clients.name,
    })
    .from(clients)
    .where(
      and(eq(clients.agencyId, user.agencyId), eq(clients.status, "active")),
    )
    .orderBy(desc(clients.createdAt));

  const agencyTemplates = await db
    .select({
      id: onboardingTemplates.id,
      name: onboardingTemplates.name,
    })
    .from(onboardingTemplates)
    .where(
      and(
        eq(onboardingTemplates.agencyId, user.agencyId),
        eq(onboardingTemplates.status, "active"),
      ),
    );

  return (
    <main className="app-shell py-8 sm:py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Workspace
          </p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">Projects</h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Keep client work moving and see every active project at a glance.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Active projects
          </p>
          <p className="mt-1 text-2xl font-bold">{agencyProjects.length}</p>
        </div>
      </header>

      <div className="mt-8 grid items-start gap-8 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.8fr)]">
        <section aria-labelledby="projects-heading">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 id="projects-heading" className="text-xl font-bold">
                Your projects
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                {agencyProjects.length === 1
                  ? "1 project in progress"
                  : `${agencyProjects.length} projects in progress`}
              </p>
            </div>
          </div>

          {agencyProjects.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
              <h3 className="text-lg font-semibold">No active projects yet</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm text-gray-600">
                Create a project to start an onboarding flow for one of your
                clients.
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {agencyProjects.map((project) => (
                <article
                  key={project.id}
                  className="group flex min-h-48 flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                >
                  <div className="flex items-start justify-between gap-3">
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="min-w-0 flex-1"
                    >
                      <h3 className="text-lg font-bold group-hover:text-primary">
                        {project.name}
                      </h3>
                    </Link>
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold capitalize text-green-700">
                        {project.status}
                      </span>
                      <DeleteProjectButton projectId={project.id} />
                    </div>
                  </div>

                  {project.description ? (
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {project.description}
                    </p>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">
                      No project description
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Client
                      </p>
                      <p className="truncate text-sm font-semibold">
                        {project.clientName}
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      className="shrink-0 text-sm font-semibold text-primary hover:underline"
                    >
                      View project
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <CreateProjectForm clients={agencyClients} templates={agencyTemplates} />
      </div>
    </main>
  );
}
