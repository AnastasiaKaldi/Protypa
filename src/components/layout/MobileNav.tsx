"use client";
import { useState } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-ink cursor-pointer"
        aria-label="Menu"
      >
        {open ? (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-paper border-b border-slate-200 shadow-xl z-40 px-4 py-6">
          <nav className="flex flex-col gap-1">
            <MobileLink href="/" onClick={() => setOpen(false)}>{el.nav.home}</MobileLink>
            <MobileLink href="/paketa" onClick={() => setOpen(false)}>{el.nav.packages}</MobileLink>
            <MobileLink href="/sxetika" onClick={() => setOpen(false)}>{el.nav.about}</MobileLink>
            <MobileLink href="/faq" onClick={() => setOpen(false)}>{el.nav.faq}</MobileLink>
            <MobileLink href="/epikoinonia" onClick={() => setOpen(false)}>{el.nav.contact}</MobileLink>
            <div className="mt-3 pt-3 border-t border-slate-200 flex flex-col gap-1">
              <MobileLink href="/signin" onClick={() => setOpen(false)}>{el.nav.signin}</MobileLink>
              <Link
                href="/signup"
                onClick={() => setOpen(false)}
                className="mt-2 flex items-center justify-center gap-1.5 px-4 py-3 rounded-full bg-amber-300 text-ink font-semibold"
              >
                {el.nav.signup}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </div>
  );
}

function MobileLink({
  href,
  onClick,
  children,
}: {
  href: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className="px-3 py-3 rounded-xl text-ink font-medium hover:bg-slate-100 transition-colors"
    >
      {children}
    </Link>
  );
}
