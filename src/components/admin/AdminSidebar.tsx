"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Image as ImageIcon,
  MessageSquare,
  Calendar,
  BarChart2,
  Settings,
  BookOpen,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/gallery", label: "Galeria", icon: ImageIcon },
  { href: "/admin/messages", label: "Mensagens", icon: MessageSquare },
  { href: "/admin/appointments", label: "Agendamentos", icon: Calendar },
  { href: "/admin/analytics", label: "Analytics", icon: BarChart2 },
  { href: "/admin/about", label: "Sobre Nós", icon: BookOpen },
  { href: "/admin/settings", label: "Configurações", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-[var(--border)]">
        <Link href="/" className="block" target="_blank">
          <span className="text-[var(--gold)] text-xl font-bold tracking-widest uppercase block">
            Seven
          </span>
          <span className="text-[var(--text-muted)] text-xs tracking-[0.3em] uppercase">
            Tattoo — Admin
          </span>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href, item.exact);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded text-sm transition-all duration-150",
                active
                  ? "bg-[var(--gold)] text-[#0d0d0d] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-2)]"
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="p-4 border-t border-[var(--border)]">
        <button
          onClick={() => void signOut({ callbackUrl: "/admin/login" })}
          className="flex items-center gap-3 px-4 py-3 w-full rounded text-sm text-[var(--text-muted)] hover:text-red-400 hover:bg-[var(--surface-2)] transition-all"
        >
          <LogOut size={18} />
          Sair
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-[var(--surface)] border-r border-[var(--border)] h-screen sticky top-0">
        <SidebarContent />
      </aside>

      {/* Mobile toggle */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[var(--surface)] border border-[var(--border)] rounded text-[var(--foreground)]"
        onClick={() => setIsMobileOpen((p) => !p)}
        aria-label="Menu"
      >
        {isMobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Mobile drawer */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.7)" }}
          onClick={() => setIsMobileOpen(false)}
        >
          <aside
            className="w-60 h-full bg-[var(--surface)] border-r border-[var(--border)]"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarContent />
          </aside>
        </div>
      )}
    </>
  );
}
