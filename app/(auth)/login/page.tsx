import { LoginLink, RegisterLink } from "@kinde-oss/kinde-auth-nextjs";
import Link from "next/link";
import { Wordmark } from "@/components/logo";

export default function LoginPage() {
  return (
    <main className="grid min-h-dvh lg:grid-cols-[0.9fr_1.1fr]">
      <div className="hidden flex-col justify-between bg-ink p-10 text-white lg:flex">
        <Link href="/">
          <Wordmark dark />
        </Link>
        <div>
          <p className="max-w-sm font-[family-name:var(--font-heading)] text-4xl font-extrabold leading-tight tracking-tight">
            Every client handoff, checked off.
          </p>
          <div className="track mt-8 max-w-xs" aria-hidden="true">
            <i data-done />
            <i data-done />
            <i data-done />
            <i data-current />
            <i />
          </div>
        </div>
        <p className="text-sm text-white/50">Client onboarding for agencies</p>
      </div>

      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Link href="/" className="mb-10 inline-block lg:hidden">
            <Wordmark />
          </Link>
          <h1 className="text-3xl font-extrabold">Sign in to ClientFlow</h1>
          <p className="mt-2 text-gray-600">
            New here? Creating an account also creates your agency.
          </p>

          <div className="mt-8 grid gap-3">
            <LoginLink className="btn btn-primary h-12 text-base">
              Sign in
            </LoginLink>
            <RegisterLink className="btn btn-quiet h-12 text-base">
              Create account
            </RegisterLink>
          </div>
        </div>
      </div>
    </main>
  );
}
