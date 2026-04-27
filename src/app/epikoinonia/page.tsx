"use client";
import { useState } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div>
      <Hero />

      <section className="relative bg-ink pt-16 pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">

            {/* Left — contact info */}
            <aside className="lg:col-span-5">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-6">
                Πού να μας βρείτε
              </div>

              <ul className="divide-y divide-white/10 border-y border-white/10">
                <InfoRow numeral="01" label="Email" value={el.contact.infoEmailValue} note={el.contact.infoEmailNote} href={`mailto:${el.contact.infoEmailValue}`} />
                <InfoRow numeral="02" label="Ώρες" value={el.contact.infoHoursValue} note={el.contact.infoHoursNote} />
                <InfoRow numeral="03" label="Τοποθεσία" value={el.contact.infoLocationValue} note={el.contact.infoLocationNote} />
              </ul>

              <p className="mt-10 text-sm text-muted leading-relaxed max-w-sm">
                Πριν επικοινωνήσετε, ίσως βρείτε την απάντηση στις{" "}
                <Link href="/faq" className="text-brand hover:text-accent font-bold transition-colors">
                  συχνές ερωτήσεις
                </Link>
                .
              </p>
            </aside>

            {/* Right — form */}
            <div className="lg:col-span-7">
              <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-muted mb-8">
                ↓ Στείλτε μήνυμα
              </div>

              {sent ? (
                <SuccessState onReset={() => setSent(false)} />
              ) : (
                <form
                  className="space-y-8"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    setSubmitting(true);
                    await new Promise((r) => setTimeout(r, 600));
                    setSubmitting(false);
                    setSent(true);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-8">
                    <Field label={el.contact.name} name="name" placeholder={el.contact.namePlaceholder} required />
                    <Field label={el.contact.email} name="email" type="email" placeholder={el.contact.emailPlaceholder} required />
                  </div>
                  <Field label={el.contact.school} name="school" placeholder={el.contact.schoolPlaceholder} />
                  <SelectField label={el.contact.subject} name="subject" placeholder={el.contact.subjectPlaceholder} options={el.contact.subjectOptions} />
                  <TextareaField label={el.contact.message} name="message" placeholder={el.contact.messagePlaceholder} />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-accent-purple text-white font-black uppercase tracking-wider text-sm shadow-xl shadow-accent-purple/20 hover:bg-[#6500b0] hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <SpinnerIcon className="w-4 h-4 animate-spin" />
                        {el.contact.sending}
                      </>
                    ) : (
                      <>
                        <span className="w-6 h-6 rounded-full bg-white/15 grid place-items-center group-hover:scale-110 transition-transform">
                          <svg className="w-2.5 h-2.5 ml-0.5" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="6 4 20 12 6 20 6 4" />
                          </svg>
                        </span>
                        {el.contact.send}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ─── HERO ─────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section className="relative bg-brand pt-16 pb-20 md:pt-24 md:pb-28 clip-x">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50 mb-4">
          {el.contact.eyebrow}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-ink">
          {el.contact.title}
        </h1>
        <p className="mt-6 text-base md:text-lg text-paper max-w-md leading-relaxed">
          {el.contact.subtitle}
        </p>
      </div>
    </section>
  );
}

/* ─── INFO ROW ─────────────────────────────────────────────────────────── */

function InfoRow({ numeral, label, value, note, href }: {
  numeral: string; label: string; value: string; note: string; href?: string;
}) {
  const inner = (
    <div className="group flex items-baseline gap-5 py-6">
      <span className="font-display text-2xl tabular-nums text-muted group-hover:text-brand transition-colors flex-shrink-0">
        {numeral}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">
          {label}
        </div>
        <div className="mt-2 font-display text-lg sm:text-2xl leading-tight text-paper">
          {value}
        </div>
        <div className="mt-1 text-xs text-muted">{note}</div>
      </div>
      {href && (
        <span className="font-display text-2xl text-muted group-hover:text-brand group-hover:translate-x-1 transition-all flex-shrink-0">
          →
        </span>
      )}
    </div>
  );
  return (
    <li>
      {href ? <a href={href} className="block">{inner}</a> : inner}
    </li>
  );
}

/* ─── FORM FIELDS ──────────────────────────────────────────────────────── */

function Field({ label, name, placeholder, type = "text", required = false }: {
  label: string; name: string; placeholder?: string; type?: string; required?: boolean;
}) {
  return (
    <label className="block group">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
      <input
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-white/15 px-0 py-3 text-lg font-display text-paper placeholder:text-muted focus:outline-none focus:border-brand transition-colors"
      />
    </label>
  );
}

function SelectField({ label, name, placeholder, options }: {
  label: string; name: string; placeholder: string; options: readonly string[];
}) {
  return (
    <label className="block group">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
      <select
        required
        name={name}
        defaultValue=""
        className="mt-2 w-full bg-ink border-0 border-b-2 border-white/15 px-0 py-3 text-lg font-display text-paper focus:outline-none focus:border-brand transition-colors cursor-pointer"
      >
        <option value="" disabled className="text-muted">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt} className="bg-ink text-paper">{opt}</option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({ label, name, placeholder }: {
  label: string; name: string; placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted">
        {label}
      </span>
      <textarea
        required
        name={name}
        rows={5}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-white/15 px-0 py-3 text-lg font-display text-paper placeholder:text-muted focus:outline-none focus:border-brand transition-colors resize-none"
      />
    </label>
  );
}

/* ─── SUCCESS STATE ────────────────────────────────────────────────────── */

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div>
      <div className="font-display text-6xl text-accent">Ευχαριστούμε.</div>
      <h2 className="mt-6 font-display text-3xl text-paper">{el.contact.sentTitle}</h2>
      <p className="mt-3 text-muted max-w-md leading-relaxed text-sm">{el.contact.sentBody}</p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-accent-purple text-accent-purple font-bold uppercase tracking-wider text-sm hover:bg-accent-purple hover:text-white transition-all cursor-pointer"
      >
        {el.contact.sentAction}
      </button>
    </div>
  );
}

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
