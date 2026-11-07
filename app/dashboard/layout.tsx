import type { ReactNode } from "react";
import Nav from "@/components/Nav";
import { requireCurrentUser } from "@/lib/services/current-user";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireCurrentUser();

  return (
    <div className="min-h-screen">
      <Nav email={user.email} role={user.role} />
      <div className="lg:pl-60">{children}</div>
    </div>
  );
}
