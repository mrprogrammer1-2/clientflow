"use client";

import { createProjectAction } from "./actions";
import type { CreateProjectState } from "./actions";
import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const initialState: CreateProjectState = {
  projectId: null,
  onboardingId: null,
  portalUrl: null,
};

type CreateProjectFormProps = {
  clients: {
    id: string;
    name: string;
  }[];
  templates: {
    id: string;
    name: string;
  }[];
};

export default function CreateProjectForm({
  clients,
  templates,
}: CreateProjectFormProps) {
  const [state, formAction] = useActionState(createProjectAction, initialState);
  const [copied, setCopied] = useState(false);

  const fieldClass =
    "w-full rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20";

  return (
    <section className="card p-5 sm:p-6">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          Get started
        </p>
        <h2 className="mt-1 text-xl font-bold">Create a project</h2>
        <p className="mt-1 text-sm text-gray-600">
          Set up a new client onboarding flow.
        </p>
      </div>

      <form action={formAction} className="mt-5 flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-name" className="text-sm font-semibold">
            Project name
          </label>
          <input
            id="project-name"
            name="name"
            placeholder="e.g. Website Redesign"
            required
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-description" className="text-sm font-semibold">
            Description <span className="font-normal text-gray-500">optional</span>
          </label>
          <textarea
            id="project-description"
            name="description"
            placeholder="Brief project overview..."
            rows={3}
            className={fieldClass}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-client" className="text-sm font-semibold">
            Client
          </label>
          <select
            id="project-client"
            name="clientId"
            required
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select a client
            </option>
            {clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="project-template" className="text-sm font-semibold">
            Template
          </label>
          <select
            id="project-template"
            name="templateId"
            required
            className={fieldClass}
            defaultValue=""
          >
            <option value="" disabled>
              Select a template
            </option>
            {templates.map((template) => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="mt-1 w-full cursor-pointer">
          Create project
        </Button>
      </form>

      {state.portalUrl && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4">
          <p className="mb-2 text-sm font-semibold text-green-800">
            Project created successfully
          </p>
          <div className="flex gap-2">
            <input
              value={state.portalUrl}
              readOnly
              aria-label="Client portal link"
              className="min-w-0 flex-1 truncate rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-600"
            />
            <button
              type="button"
              onClick={async () => {
                await navigator.clipboard.writeText(state.portalUrl!);
                setCopied(true);
              }}
              className="shrink-0 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              {copied ? "Copied" : "Copy link"}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
