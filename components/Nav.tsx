"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs";
import {
  ClipboardList,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  MailPlus,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Wordmark } from "@/components/logo";

const links = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/clients", label: "Clients", icon: Users },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/templates", label: "Templates", icon: ClipboardList },
  { href: "/dashboard/users", label: "Team", icon: ShieldCheck, admin: true },
  { href: "/dashboard/invitations", label: "Invitations", icon: MailPlus, admin: true },
];

export default function Nav({
  email,
  role,
}: {
  email: string;
  role: "owner" | "admin" | "member";
}) {
  const pathname = usePathname();
  const isAdmin = role === "owner" || role === "admin";
  const visible = links.filter((l) => !l.admin || isAdmin);

  const isActive = (l: (typeof links)[number]) =>
    l.exact ? pathname === l.href : pathname.startsWith(l.href);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-60 flex-col bg-sidebar px-4 py-6 text-sidebar-foreground lg:flex">
        <Link href="/dashboard" className="px-2">
          <Wordmark dark />
        </Link>

        <nav className="mt-10 flex flex-1 flex-col gap-1" aria-label="Main">
          {visible.map((l) => {
            const Icon = l.icon;
            const active = isActive(l);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium ${
                  active
                    ? "bg-sidebar-accent text-white shadow-[inset_3px_0_0_var(--sidebar-primary)]"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white"
                }`}
              >
                <Icon className="size-4" aria-hidden="true" />
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border pt-4">
          <p className="truncate px-2 text-sm text-white">{email}</p>
          <p className="px-2 text-xs capitalize text-sidebar-foreground/60">{role}</p>
          <LogoutLink className="mt-3 flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-white">
            <LogOut className="size-4" aria-hidden="true" />
            Sign out
          </LogoutLink>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 bg-sidebar text-sidebar-foreground lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/dashboard">
            <Wordmark dark />
          </Link>
          <LogoutLink className="text-sm font-medium text-sidebar-foreground/80 hover:text-white">
            Sign out
          </LogoutLink>
        </div>
        <nav
          className="flex gap-1 overflow-x-auto px-3 pb-3"
          aria-label="Main"
        >
          {visible.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              aria-current={isActive(l) ? "page" : undefined}
              className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium ${
                isActive(l)
                  ? "bg-sidebar-accent text-white"
                  : "text-sidebar-foreground/70"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
    </>
  );
}
