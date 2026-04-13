"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  BarChart3,
  Grid3x3,
  Users,
  TicketPercent,
  LogOut,
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const nav = [
  { href: "/admin/orders", label: "Orders", icon: LayoutDashboard },
  { href: "/admin/inventory", label: "Inventory", icon: Package },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/admin/tables", label: "Table Map", icon: Grid3x3 },
  { href: "/admin/staff", label: "Staff", icon: Users },
  { href: "/admin/coupons", label: "Coupons", icon: TicketPercent },
];

export default function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { status } = useSession();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready || pathname === "/admin") return;
    if (status === "unauthenticated") {
      router.replace("/admin");
    }
  }, [ready, pathname, router, status]);

  if (!ready) {
    return (
      <div className="min-h-screen bg-[#060403] flex items-center justify-center text-white/40 text-sm font-['Hind_Siliguri']">
        লোড হচ্ছে…
      </div>
    );
  }

  if (pathname === "/admin") {
    return (
      <div className="min-h-screen bg-[#060403] text-[#f5ebd9]">{children}</div>
    );
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#060403] flex items-center justify-center text-white/40 text-sm font-['Hind_Siliguri']">
        সেশন চেক…
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#060403] flex items-center justify-center text-white/50 text-sm">
        Redirecting…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#060403] text-[#f5ebd9]">
      <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#0a0705] md:flex flex-col">
        <div className="border-b border-white/10 p-6">
          <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#c48c5a]">
            Blackstone
          </p>
          <h1 className="mt-1 font-black text-lg tracking-tight text-white">
            Admin
          </h1>
        </div>
        <nav className="flex flex-col gap-1 p-3">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <motion.span
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                    active
                      ? "bg-[#c48c5a]/15 text-[#c48c5a]"
                      : "text-white/60 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
        <div className="mt-auto border-t border-white/10 p-4">
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin" })}
            className="flex w-full items-center gap-2 rounded-xl px-4 py-3 text-sm text-white/50 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Log out
          </button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex flex-col gap-3 border-b border-white/10 bg-[#080604]/90 px-3 py-3 backdrop-blur md:hidden">
          <span className="font-black text-sm text-white">Blackstone Admin</span>
          <div className="flex gap-2 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-wider">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full px-3 py-1.5 ${
                  pathname === item.href
                    ? "bg-[#c48c5a] text-black"
                    : "bg-white/10 text-white/70"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-10">{children}</main>
      </div>
    </div>
  );
}
