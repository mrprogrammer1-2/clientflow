import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { onboardingTemplates } from "@/db/schema";
import { createTemplateAction } from "./actions";
import Link from "next/link";
import { requireCurrentUser } from "@/lib/services/current-user";

export default async function TemplatesPage() {
  const user = await requireCurrentUser();

  const templates = await db
    .select()
    .from(onboardingTemplates)
    .where(eq(onboardingTemplates.agencyId, user.agencyId))
    .orderBy(desc(onboardingTemplates.createdAt));

  const statusStyles = {
    active: "bg-green-100 text-green-700",
    inactive: "bg-gray-100 text-gray-700",
    archived: "bg-gray-100 text-gray-500",
  };

  return (
    <main className="app-shell py-8 sm:py-12">
      <header className="flex flex-col gap-4 border-b border-border pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Reusable workflows
          </p>
          <h1 className="mt-1 text-3xl font-extrabold sm:text-4xl">
            Onboarding templates
          </h1>
          <p className="mt-2 max-w-2xl text-gray-600">
            Create repeatable checklists for new client projects.
          </p>
        </div>
        <div className="w-fit rounded-xl border border-border bg-card px-5 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
            Templates
          </p>
          <p className="mt-1 text-2xl font-bold">{templates.length}</p>
        </div>
      </header>

      <section className="mt-8" aria-labelledby="templates-heading">
        <div className="mb-4">
          <h2 id="templates-heading" className="text-xl font-bold">
            Your templates
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Choose a template when creating a project.
          </p>
        </div>

        {templates.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
            <h3 className="text-lg font-semibold">Your first template starts here</h3>
            <p className="mx-auto mt-2 max-w-lg text-sm text-gray-600">
              Add a template below to reuse the same onboarding steps across
              projects.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <article
                key={template.id}
                className="flex min-h-56 flex-col rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{template.name}</h3>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[template.status]}`}
                  >
                    {template.status}
                  </span>
                </div>

                <p className="mt-3 line-clamp-3 flex-1 text-sm text-gray-600">
                  {template.description || "No description added yet."}
                </p>

                <Link
                  href={`/dashboard/templates/${template.id}`}
                  className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-foreground px-4 py-2 text-sm font-semibold text-background transition hover:bg-gray-800"
                >
                  Manage template
                </Link>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="card mt-10 p-5 sm:p-6" aria-labelledby="create-template-heading">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-primary">
            Build a workflow
          </p>
          <h2 id="create-template-heading" className="mt-1 text-xl font-bold">
            Create a template
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Start with a name and description. You can add steps afterward.
          </p>
        </div>

        <form
          action={createTemplateAction}
          className="mt-5 grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)_auto] md:items-end"
        >
          <div className="flex flex-col gap-1.5">
            <label htmlFor="template-name" className="text-sm font-semibold">
              Template name
            </label>
            <input
              id="template-name"
              name="name"
              required
              placeholder="e.g. Website Client Onboarding"
              className="w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="template-description"
              className="text-sm font-semibold"
            >
              Description{" "}
              <span className="font-normal text-gray-500">optional</span>
            </label>
            <textarea
              id="template-description"
              name="description"
              placeholder="What information should this template collect?"
              className="min-h-11 w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm"
            />
          </div>

          <button type="submit" className="btn btn-primary w-full md:w-auto">
            Create template
          </button>
        </form>
      </section>
    </main>
  );
}
