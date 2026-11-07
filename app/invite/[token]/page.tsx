import getInvitationByToken from "@/lib/services/get-invitation-by-token";
import validateInvitation from "@/lib/services/validate-invitation";
import { notFound } from "next/navigation";
import { acceptInvitationAction } from "./accept-invitation";
import { Button } from "@/components/ui/button";
import { Wordmark } from "@/components/logo";

type Props = {
  params: Promise<{
    token: string;
  }>;
};

export default async function InviteTokenPage({ params }: Props) {
  const { token } = await params;
  const invitation = await getInvitationByToken(token);

  if (!invitation) {
    notFound();
  }

  const validatedInvitation = await validateInvitation(invitation);

  const isValid = validatedInvitation.valid;
  const reason = validatedInvitation.reason;

  const messages: Record<string, string> = {
    "already accepted": "This invitation has already been accepted.",
    expired: "This invitation has expired. Ask your team admin for a new one.",
    revoked: "This invitation was cancelled. Ask your team admin for a new one.",
  };

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="card w-full max-w-md p-8">
        <Wordmark />
        {isValid && reason === "valid" ? (
          <>
            <h1 className="mt-8 text-3xl font-extrabold">
              You are invited to join a team
            </h1>
            <p className="mt-2 text-gray-600">
              Accept to start working on your agency&apos;s clients and
              projects.
            </p>
            <form action={acceptInvitationAction} className="mt-6">
              <input type="hidden" name="token" value={token} />
              <Button type="submit" size="lg" className="w-full">
                Accept invitation
              </Button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-8 text-3xl font-extrabold">
              Invitation unavailable
            </h1>
            <p className="mt-2 text-gray-600">
              {messages[reason ?? ""] ?? "This invitation is not valid."}
            </p>
          </>
        )}
      </section>
    </main>
  );
}
