"use client";

import { ExternalLink, Inbox, LayoutDashboard, LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
};

const navItems = [
  { href: "/admin", label: "Заявки", icon: Inbox },
];

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -right-24 top-0 h-80 w-80 rounded-full bg-blue-100/70 blur-3xl" />
        <div className="absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-indigo-100/60 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <aside className="border-b border-slate-200/80 bg-white/80 backdrop-blur-md lg:w-64 lg:border-b-0 lg:border-r">
          <div className="flex h-16 items-center justify-between px-4 lg:h-auto lg:flex-col lg:items-stretch lg:px-0 lg:py-6">
            <div className="flex items-center gap-3 px-0 lg:px-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 text-sm font-bold text-white shadow-md shadow-blue-600/20">
                A
              </span>
              <div>
                <p className="text-sm font-bold text-slate-900">Agentum Pro</p>
                <p className="text-xs text-slate-500">Панель управления</p>
              </div>
            </div>

            <nav className="hidden items-center gap-1 lg:mt-8 lg:flex lg:flex-col lg:px-3">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                      isActive
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md shadow-blue-600/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                    )}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2 lg:mt-auto lg:flex-col lg:gap-2 lg:px-3 lg:pb-2 lg:pt-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">На сайт</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Выйти</span>
              </button>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto px-4 pb-3 lg:hidden">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "inline-flex shrink-0 items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all",
                    isActive
                      ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "bg-white text-slate-600 ring-1 ring-slate-200",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </div>
        </aside>

        <div className="flex flex-1 flex-col">
          <header className="flex items-center gap-3 border-b border-slate-200/80 bg-white/70 px-4 py-4 backdrop-blur-md sm:px-6 lg:px-8">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-slate-900 sm:text-xl">
                Заявки партнёров
              </h1>
              <p className="text-xs text-slate-500 sm:text-sm">
                Управление заявками с формы на сайте
              </p>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
