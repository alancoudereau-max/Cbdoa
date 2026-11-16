"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";
import { Menu, X, ArrowUpRight, MessageCircle } from "lucide-react";
import { mainNav, site } from "@/data/site";
import { CartButton } from "@/components/cart/CartButton";
import { Logo } from "@/components/brand/Logo";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // masque le bouton WhatsApp flottant tant que le menu est ouvert (il a son propre bouton WhatsApp)
    document.documentElement.toggleAttribute("data-menu-open", open);
    return () => {
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      {/* Bandeau promotionnel */}
      <div className="band-green text-center font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.1em] sm:tracking-[0.2em] px-3 sm:px-4 py-2">
        <div className="ticker">
          <ul>
            <li><Link href="/livraison" className="hover:underline underline-offset-2">Port offert dès 60 € · Expédition 24/48 h</Link></li>
            <li><Link href="/distributeurs" className="hover:underline underline-offset-2">Distributeurs 24/7 : Charquemont et Le Russey</Link></li>
            <li><Link href="/boutique" className="hover:underline underline-offset-2">Code BIENVENUE10 : 10 € offerts dès 100 €</Link></li>
            <li aria-hidden><Link href="/livraison" tabIndex={-1} className="hover:underline underline-offset-2">Port offert dès 60 € · Expédition 24/48 h</Link></li>
          </ul>
        </div>
      </div>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300 border-b",
          scrolled || open ? "border-foreground/10 bg-background/85 backdrop-blur-xl" : "border-transparent bg-background/40 backdrop-blur-sm",
        )}
      >
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-12">
          <div className="flex h-16 sm:h-20 items-center justify-between gap-3">
            <Link href="/" className="flex items-center group shrink-0" aria-label="CBDoux — accueil">
              <Logo className="h-8 sm:h-10 xl:h-9 2xl:h-10 drop-shadow-[0_0_18px_rgba(201,168,76,0.35)]" />
            </Link>

            <nav aria-label="Navigation principale" className="hidden xl:flex items-center gap-0.5">
              {mainNav.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={cn(
                    "px-2.5 2xl:px-3 py-2 font-mono text-[11px] uppercase tracking-[0.13em] 2xl:tracking-[0.18em] whitespace-nowrap transition-colors",
                    isActive(l.href) ? "text-gold" : "text-foreground/70 hover:text-gold",
                  )}
                >
                  {l.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <a
                href={site.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group hidden md:inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.14em] 2xl:tracking-[0.18em] text-background hover:bg-gold transition-colors"
              >
                <MessageCircle size={13} /> {site.phoneDisplay}
                <ArrowUpRight size={12} className="group-hover:rotate-45 transition-transform" />
              </a>
              <CartButton />
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-full border border-foreground/20 text-foreground hover:border-gold hover:text-gold transition-colors"
                aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
                aria-expanded={open}
                aria-controls="menu-mobile"
              >
                {open ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        <div
          id="menu-mobile"
          className={cn(
            "xl:hidden overflow-hidden transition-[max-height] duration-500 ease-out border-t border-foreground/10",
            open ? "menu-open max-h-[85vh] overflow-y-auto" : "max-h-0 border-t-0",
          )}
        >
          <nav aria-label="Navigation mobile" className="mx-auto max-w-[1400px] px-4 sm:px-8 py-4 flex flex-col gap-0.5">
            {[{ href: "/", label: "Accueil" }, ...mainNav, { href: "/a-propos", label: "À propos" }, { href: "/contact", label: "Contact" }].map((l, idx) => (
              <Link
                key={l.href}
                href={l.href}
                style={{ "--i": idx } as CSSProperties}
                className={cn(
                  "menu-item px-4 py-3 rounded-xl font-serif text-2xl transition-colors",
                  isActive(l.href) && l.href !== "/" ? "text-gold bg-card" : pathname === l.href ? "text-gold bg-card" : "text-foreground/80 hover:bg-card",
                )}
              >
                {l.label}
              </Link>
            ))}
            <a
              href={site.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center justify-between gap-2 rounded-full bg-foreground px-5 py-3.5 font-mono text-xs uppercase tracking-[0.18em] text-background"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle size={14} /> WhatsApp · {site.phoneDisplay}
              </span>
              <ArrowUpRight size={14} />
            </a>
          </nav>
        </div>
      </header>
    </>
  );
}
