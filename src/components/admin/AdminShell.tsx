"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
  Shield,
  ExternalLink,
} from "lucide-react";
import type { AdminSession } from "@/lib/auth";
import { logoutAdmin } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const roleLabel: Record<string, string> = {
  GENERAL: "General admin",
  PAYMENT: "Payment admin",
  DELIVERY: "Delivery admin",
};

export function AdminShell({
  session,
  children,
}: {
  session: AdminSession;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = [
    { href: "/admin", label: "Dashboard", Icon: LayoutDashboard, show: true, exact: true },
    { href: "/admin/orders", label: "Orders", Icon: ShoppingBag, show: true },
    { href: "/admin/products", label: "Products", Icon: Package, show: session.role === "GENERAL" },
    { href: "/admin/admins", label: "Admins", Icon: Users, show: session.role === "GENERAL" },
  ].filter((n) => n.show);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  const SidebarInner = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 px-5 py-5">
        <span className="grid h-9 w-9 place-items-center rounded-xl brand-gradient text-white">
          <Shield size={18} />
        </span>
        <div>
          <p className="text-sm font-extrabold leading-none text-white">
            NexTech<span className="text-gradient">Pro</span>
          </p>
          <p className="mt-0.5 text-[11px] text-slate-500">Admin panel</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-2">
        {nav.map(({ href, label, Icon, exact }) => (
          <Link
            key={href}
            href={href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              isActive(href, exact)
                ? "bg-brand-500/15 text-brand-300"
                : "text-slate-300 hover:bg-white/5 hover:text-white",
            )}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 px-3 py-3">
        <Link
          href="/"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 hover:bg-white/5 hover:text-white"
        >
          <ExternalLink size={18} /> View store
        </Link>
        <div className="mt-2 flex items-center gap-3 rounded-xl bg-white/5 px-3 py-2.5">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg brand-gradient text-sm font-bold text-white">
            {session.name.charAt(0).toUpperCase()}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold text-white">{session.name}</p>
            <p className="truncate text-[11px] text-slate-400">{roleLabel[session.role]}</p>
          </div>
          <form action={logoutAdmin}>
            <button
              type="submit"
              className="grid h-8 w-8 place-items-center rounded-lg text-slate-400 hover:bg-rose-500/10 hover:text-rose-400"
              aria-label="Sign out"
              title="Sign out"
            >
              <LogOut size={17} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-ink-950 text-slate-200">
      {/* desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-white/10 bg-ink-900 lg:block">
        {SidebarInner}
      </aside>

      {/* mobile top bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-ink-900/90 px-4 py-3 backdrop-blur lg:hidden">
        <span className="flex items-center gap-2 font-extrabold text-white">
          <Shield size={18} className="text-brand-400" /> Admin
        </span>
        <button
          onClick={() => setOpen(true)}
          className="grid h-9 w-9 place-items-center rounded-lg text-slate-200 hover:bg-white/10"
          aria-label="Menu"
        >
          <Menu size={20} />
        </button>
      </div>

      {/* mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-ink-900 shadow-2xl">
            <button
              onClick={() => setOpen(false)}
              className="absolute right-3 top-4 grid h-9 w-9 place-items-center rounded-lg text-slate-300 hover:bg-white/10"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            {SidebarInner}
          </div>
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">{children}</div>
      </div>
    </div>
  );
}
