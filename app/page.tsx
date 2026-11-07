import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Wordmark } from "@/components/logo";

const sheet = [
  { title: "Company details", kind: "Form", done: true },
  { title: "Brand guidelines", kind: "PDF upload", done: true },
  { title: "Logo files", kind: "File upload", done: true },
  { title: "Competitor websites", kind: "Links", done: true },
  { title: "Kickoff questions", kind: "Questionnaire", done: false },
];

const flow = [
  {
    title: "Build a template once",
    body: "List what you always need from a new client: details, files, links, a few questions. Reuse it for every project.",
  },
  {
    title: "Send one link",
    body: "Your client opens their portal, confirms their email with a code, and sees exactly what is left to do.",
  },
  {
    title: "Watch it fill in",
    body: "Each answer and upload lands on the project. Required steps done means onboarding done.",
  },
];

export default function Home() {
  return (
    <main>
      <header className="app-shell flex items-center justify-between py-5">
        <Wordmark />
        <nav className="flex items-center gap-2">
          <Link href="/login" className="btn btn-quiet hidden border-transparent sm:inline-flex">
            Sign in
          </Link>
          <Link href="/login" className="btn btn-ink">
            Get started
          </Link>
        </nav>
      </header>

      <section className="app-shell grid gap-12 pb-20 pt-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:pt-16">
        <div>
          <h1 className="max-w-xl text-5xl font-extrabold leading-[0.98] sm:text-6xl lg:text-7xl">
            Onboard clients without the email chase.
          </h1>
          <p className="mt-6 max-w-md text-lg text-gray-600">
            Send one link. Your client answers your questions and uploads their
            files, and you see every step checked off as it comes in.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/login" className="btn btn-primary h-12 px-6 text-base">
              Start your first onboarding
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* The intake sheet: each step gets stamped once, on load. */}
        <div
          className="card relative p-6 sm:p-7"
          aria-label="Example onboarding checklist"
        >
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Northwind Studio</p>
              <h2 className="text-2xl font-bold">Website redesign intake</h2>
            </div>
            <p className="whitespace-nowrap text-sm font-medium text-gray-600">4 of 5</p>
          </div>

          <div className="track mt-5" aria-hidden="true">
            {sheet.map((s, i) => (
              <i
                key={s.title}
                className={s.done ? "hero-seg" : undefined}
                style={{ ["--d" as string]: `${0.5 + i * 0.55}s` }}
                data-current={!s.done ? "" : undefined}
              />
            ))}
          </div>

          <ul className="mt-6 divide-y divide-border">
            {sheet.map((s, i) => (
              <li
                key={s.title}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <div>
                  <p className="font-semibold">{s.title}</p>
                  <p className="text-sm text-gray-500">{s.kind}</p>
                </div>
                {s.done ? (
                  <span
                    className="stamp hero-stamp"
                    style={{ ["--d" as string]: `${0.5 + i * 0.55}s` }}
                  >
                    Received
                  </span>
                ) : (
                  <span className="rounded-md bg-highlighter px-2.5 py-1 text-sm font-semibold">
                    Waiting on client
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="border-t border-border bg-card">
        <div className="app-shell py-20">
          <h2 className="max-w-lg text-3xl font-extrabold sm:text-4xl">
            Three steps from signed contract to kickoff.
          </h2>
          <ol className="mt-12 grid gap-10 md:grid-cols-3">
            {flow.map((f, i) => (
              <li key={f.title} className="border-t-2 border-ink pt-5">
                <p className="font-[family-name:var(--font-heading)] text-sm font-bold text-primary">
                  Step {i + 1}
                </p>
                <h3 className="mt-2 text-xl font-bold">{f.title}</h3>
                <p className="mt-2 max-w-xs text-gray-600">{f.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <footer className="app-shell flex flex-wrap items-center justify-between gap-4 py-10 text-sm text-gray-500">
        <Wordmark />
        <Link href="/login" className="font-semibold text-ink hover:underline">
          Sign in
        </Link>
      </footer>
    </main>
  );
}
