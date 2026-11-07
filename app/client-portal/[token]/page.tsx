import { submitClientResponseAction } from "../action";
import { getClientPortal } from "@/lib/services/get-client-portal";
import { notFound } from "next/navigation";
import ClientPortalVerificationForm from "./verification-form";
import { Wordmark } from "@/components/logo";
import { StepTrack } from "@/components/step-track";
import { getClientPortalAccess } from "@/lib/services/get-client-portal-access";
import { hasValidClientPortalSession } from "@/lib/services/client-portal-session";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function ClientPortalPage({ params }: Props) {
  const { token } = await params;

  // First, check whether the portal link itself is valid.
  const access = await getClientPortalAccess(token);

  if (!access) notFound();

  // Then, check whether this browser has verified access.
  const isVerified = await hasValidClientPortalSession(access.id);

  if (!isVerified) {
    return <ClientPortalVerificationForm token={token} />;
  }

  // Only load project details after verification.
  const portal = await getClientPortal(token);

  if (!portal) notFound();

  const steps = portal.onboarding.steps;
  const doneCount = steps.filter((s) => s.status === "completed").length;
  const allDone = steps.length > 0 && doneCount === steps.length;
  const inputClass =
    "w-full rounded-lg border border-border px-4 py-3 text-sm";

  return (
    <main className="min-h-screen">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Wordmark />
          <p className="text-sm text-gray-600">
            For {portal.project.clientName}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-6 py-10 sm:py-14">
        <section>
          <h1 className="text-4xl font-extrabold sm:text-5xl">
            {portal.project.name}
          </h1>
          {portal.project.description ? (
            <p className="mt-3 max-w-xl text-lg text-gray-600">
              {portal.project.description}
            </p>
          ) : null}
        </section>

        <section className="mt-10" aria-label="Progress">
          <div className="mb-2 flex items-center justify-between gap-4">
            <p className="font-semibold">
              {allDone
                ? "Everything is in. Thank you."
                : `${doneCount} of ${steps.length} steps done`}
            </p>
            {allDone ? <span className="stamp">Complete</span> : null}
          </div>
          <StepTrack total={steps.length} done={doneCount} />
        </section>

        <ol className="mt-10 divide-y divide-border border-y border-border">
          {steps.map((step) => {
            const isCompleted = step.status === "completed";

            return (
              <li key={step.id} className="py-6">
                <div className="flex items-start gap-4">
                  <span
                    className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full font-[family-name:var(--font-heading)] text-sm font-bold ${
                      isCompleted
                        ? "bg-stamp text-white"
                        : "border-2 border-ink text-ink"
                    }`}
                  >
                    {isCompleted ? "\u2713" : step.position}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h2 className="text-xl font-bold">{step.title}</h2>
                      {isCompleted ? (
                        <span className="stamp">Received</span>
                      ) : (
                        <span className="rounded-md bg-highlighter px-2.5 py-1 text-sm font-semibold">
                          To do
                        </span>
                      )}
                    </div>

                    {step.description && (
                      <p className="mt-1 text-gray-600">{step.description}</p>
                    )}

                    {!isCompleted && (
                      <form
                        action={submitClientResponseAction}
                        className="mt-5 space-y-3"
                      >
                        {step.type === "textarea" && (
                          <textarea
                            name="value"
                            rows={5}
                            aria-label={step.title}
                            placeholder="Type your answer"
                            className={inputClass}
                          />
                        )}

                        {step.type === "file" && (
                          <input
                            type="file"
                            name="file"
                            aria-label={`Upload file for ${step.title}`}
                            className={`${inputClass} bg-card file:mr-3 file:rounded-md file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-sm file:font-semibold file:text-white`}
                          />
                        )}

                        {step.type === "url" && (
                          <input
                            type="url"
                            name="value"
                            aria-label={step.title}
                            placeholder="https://"
                            className={inputClass}
                          />
                        )}

                        {step.type === "text" && (
                          <input
                            type="text"
                            name="value"
                            aria-label={step.title}
                            placeholder="Type your answer"
                            className={inputClass}
                          />
                        )}

                        {step.type === "questionnaire" &&
                          step.questions.map((question) => (
                            <div key={question.id}>
                              <label
                                htmlFor={`question_${question.id}`}
                                className="mb-1 block text-sm font-semibold"
                              >
                                {question.question}
                              </label>
                              <input
                                id={`question_${question.id}`}
                                type="text"
                                name={`question_${question.id}`}
                                className={inputClass}
                              />
                            </div>
                          ))}

                        <input type="hidden" name="stepId" value={step.id} />
                        <input type="hidden" name="token" value={token} />

                        <button type="submit" className="btn btn-primary">
                          Send
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
