"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { mainNav, site } from "@/data/site";
import { CartButton } from "@/components/cart/CartButton";
import { Logo } from "@/components/brand/Logo";

/** Liens secondaires du menu plein écran (les rayons de la boutique sont au-dessus, en grand). */
const secondaryNav = [
  { href: "/livraison", label: "Livraison et retrait" },
  { href: "/guides", label: "Guides" },
  { href: "/analyses-laboratoires", label: "Analyses de laboratoire" },
  { href: "/faq", label: "Questions fréquentes" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];
const primaryNav = [{ href: "/boutique", label: "Toute la boutique" }, ...mainNav.filter((l) => !["/boutique", "/livraison", "/guides"].includes(l.href))];

/** `counts` : nombre de références par rayon (calculé côté serveur), affiché en exposant dans le menu plein écran. */
export function SiteHeader({ counts = {} }: { counts?: Record<string, number> }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const openButton = useRef<HTMLButtonElement | null>(null);
  const closeButton = useRef<HTMLButtonElement | null>(null);
  const panel = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    // masque le bouton WhatsApp flottant tant que le menu est ouvert (le menu a le sien)
    document.documentElement.toggleAttribute("data-menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        openButton.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    const t = window.setTimeout(() => closeButton.current?.focus(), 80);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(t);
      document.body.style.overflow = "";
      document.documentElement.removeAttribute("data-menu-open");
    };
  }, [open]);

  const openMenu = () => {
    // le menu s'ouvre en cercle depuis le bouton : on lui donne le centre exact du bouton
    const r = openButton.current?.getBoundingClientRect();
    if (r && panel.current) {
      panel.current.style.setProperty("--mx", `${r.left + r.width / 2}px`);
      panel.current.style.setProperty("--my", `${r.top + r.height / 2}px`);
    }
    setOpen(true);
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <>
      {/* Bandeau d'information */}
      <div className="band text-[0.8125rem] leading-none">
        <div className="wrap flex h-9 items-center justify-between gap-6">
          <Link href="/livraison" className="truncate text-foreground/80 hover:text-foreground transition-colors">
            Port offert dès 60 €, expédition en 24/48 h
          </Link>
          <Link href="/distributeurs" className="hidden md:inline-flex shrink-0 items-center gap-2.5 text-foreground/80 hover:text-foreground transition-colors">
            <span className="live-dot" aria-hidden /> Distributeurs ouverts 24 h/24 à Charquemont et au Russey
          </Link>
        </div>
      </div>

      <header className="site-header" data-scrolled={scrolled}>
        <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-4">
          <Link href="/" className="group shrink-0" aria-label="CBDoux, retour à l'accueil">
            <Logo className="h-[1.9rem] sm:h-9" />
          </Link>

          <nav aria-label="Navigation principale" className="hidden xl:flex items-center gap-6 2xl:gap-8">
            {mainNav.map((l) => (
              <Link key={l.href} href={l.href} className="nav-link" aria-current={isActive(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2.5">
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="nav-link t-num hidden md:inline-block mr-2 lg:mr-4" aria-label={`Écrire à CBDoux sur WhatsApp au ${site.phoneDisplay}`}>
              WhatsApp {site.phoneDisplay}
            </a>
            <CartButton />
            <button ref={openButton} type="button" onClick={openMenu} className="btn-round xl:hidden" aria-label="Ouvrir le menu" aria-expanded={open} aria-controls="menu">
              <svg aria-hidden width="18" height="12" viewBox="0 0 18 12" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M1 1.5h16M1 10.5h16" />
              </svg>
            </button>
          </div>
        </div>
        {/* le double filet doré de l'enseigne */}
        <div className="rule-double" aria-hidden />
      </header>

      {/* Menu plein écran */}
      <div
        ref={panel}
        id="menu"
        role="dialog"
        aria-modal="true"
        aria-label="Menu"
        className="menu-panel nuit xl:hidden"
        data-open={open}
        style={{ "--mx": "calc(100% - 2.6rem)", "--my": "2.6rem" } as CSSProperties}
      >
        <div aria-hidden className="guilloche guilloche-rosace opacity-[0.13] w-[150vw] max-w-[820px] -right-[55vw] sm:-right-56 -bottom-[38vw] sm:-bottom-60" />
        <div className="relative wrap flex min-h-full flex-col pb-10">
          <div className="flex h-[var(--header-h)] shrink-0 items-center justify-between gap-4">
            <Link href="/" aria-label="CBDoux, retour à l'accueil" tabIndex={open ? 0 : -1}>
              <Logo className="h-[1.9rem] sm:h-9" />
            </Link>
            <button ref={closeButton} type="button" onClick={() => setOpen(false)} className="btn-round" aria-label="Fermer le menu">
              <svg aria-hidden width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
                <path d="M1 1l12 12M13 1L1 13" />
              </svg>
            </button>
          </div>

          <nav aria-label="Menu principal" className="mt-6 sm:mt-10 flex-1">
            <ul>
              {primaryNav.map((l, idx) => (
                <li key={l.href} className="menu-item border-b border-foreground/15 first:border-t" style={{ "--i": idx } as CSSProperties}>
                  <Link
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    className="group flex items-baseline gap-2.5 py-3.5 font-serif font-light text-[clamp(1.85rem,8.4vw,3rem)] leading-[1.08] tracking-[-0.025em] aria-[current=page]:text-or"
                  >
                    <span className="softens">{l.label}</span>
                    {counts[l.href] != null && (
                      <>
                        <span aria-hidden className="menu-count t-num">
                          {counts[l.href]}
                        </span>
                        <span className="sr-only">
                          , {counts[l.href]} {l.href === "/distributeurs" ? "distributeurs" : "références"}
                        </span>
                      </>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
            <ul className="menu-item mt-8 grid grid-cols-2 gap-x-6 gap-y-3 text-[0.9688rem]" style={{ "--i": primaryNav.length + 1 } as CSSProperties}>
              {secondaryNav.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-foreground/80 hover:text-foreground aria-[current=page]:text-or" aria-current={isActive(l.href) ? "page" : undefined}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="menu-item mt-10" style={{ "--i": primaryNav.length + 3 } as CSSProperties}>
            <a href={site.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-primary w-full sm:w-auto">
              Écrire sur WhatsApp, {site.phoneDisplay}
            </a>
            <p className="t-fine mt-4">Une vraie personne vous répond, 7 jours sur 7.</p>
          </div>
        </div>
      </div>
    </>
  );
}
