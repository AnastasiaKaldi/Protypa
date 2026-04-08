import Link from "next/link";
import { el } from "@/lib/i18n/el";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-slate-200/70 bg-paper overflow-hidden">
      <div className="pointer-events-none absolute -bottom-24 left-1/2 -translate-x-1/2 w-[40rem] h-[20rem] rounded-full bg-amber-200/30 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2.5 group">
              <span className="relative inline-block w-9 h-9 rounded-xl bg-ink text-white grid place-items-center font-display italic text-base shadow-md group-hover:scale-105 transition-transform">
                π
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-paper" />
              </span>
              <span className="font-display text-xl text-ink leading-none">
                {el.brand.name}
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted max-w-sm leading-relaxed">
              {el.brand.tagline}. Πραγματικά θέματα, έξυπνη διόρθωση και
              αναλυτικά στατιστικά για κάθε μαθητή.
            </p>
          </div>

          {/* Useful links */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.15em] uppercase text-slate-500 mb-4">
              Χρήσιμοι σύνδεσμοι
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <FooterLink href="/faq">{el.nav.faq}</FooterLink>
              </li>
              <li>
                <FooterLink href="/aporrito">{el.footer.privacy}</FooterLink>
              </li>
              <li>
                <FooterLink href="/oroi">{el.footer.terms}</FooterLink>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-200/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted">
          <div>
            © {year} {el.brand.name}. {el.footer.rights}
          </div>
          <div className="flex items-center gap-2">
            <span>Φτιάχτηκε με</span>
            <span className="text-rose-500">♥</span>
            <span>στην Ελλάδα</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="text-slate-600 hover:text-slate-900 hover:translate-x-0.5 inline-block transition-all"
    >
      {children}
    </Link>
  );
}
