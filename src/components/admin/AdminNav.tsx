"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { logoutAction } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin/commandes", label: "Commandes" },
  { href: "/admin/stock", label: "Disponibilité" },
  { href: "/admin/codes-promo", label: "Codes promo" },
  { href: "/admin/messages", label: "Messages" },
];

export function AdminNav() {
  const pathname = usePathname();
  if (pathname === "/admin") return null;
  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-foreground/10 pb-4">
      <div className="flex flex-wrap items-center gap-1">
        <span className="kicker mr-3">Admin CBDoux</span>
        {links.map((l) => (
          <Link key={l.href} href={l.href} className={cn("rounded-full px-4 py-2 text-sm transition-colors", pathname.startsWith(l.href) ? "bg-gold/15 text-gold" : "text-foreground/70 hover:text-gold")}>
            {l.label}
          </Link>
        ))}
      </div>
      <form action={logoutAction}>
        <button type="submit" className="btn-outline rounded-full px-4 py-2 text-xs">Déconnexion</button>
      </form>
    </div>
  );
}
