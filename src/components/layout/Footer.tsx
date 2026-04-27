import Link from "next/link";
import { el } from "@/lib/i18n/el";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink border-t border-white/10">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="inline-block group">
              <span className="font-display text-xl text-paper tracking-wider group-hover:text-brand transition-colors">
                PROTUPA.GR
              </span>
            </Link>
            <p className="mt-4 text-sm text-paper/40 max-w-sm leading-relaxed">
              {el.brand.tagline}. Πραγματικά θέματα, έξυπνη διόρθωση και
              αναλυτικά στατιστικά για κάθε μαθητή.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-paper/30 mb-4">
              Χρήσιμοι σύνδεσμοι
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><FooterLink href="/faq">{el.nav.faq}</FooterLink></li>
              <li><FooterLink href="/aporrito">{el.footer.privacy}</FooterLink></li>
              <li><FooterLink href="/oroi">{el.footer.terms}</FooterLink></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-paper/30">
          <div>
            © {year} {el.brand.name}. {el.footer.rights}
          </div>
          <div className="flex items-center gap-2">
            <span>Φτιάχτηκε με</span>
            <span className="text-brand">♥</span>
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
      className="text-paper/40 hover:text-paper hover:translate-x-0.5 inline-block transition-all"
    >
      {children}
    </Link>
  );
}
