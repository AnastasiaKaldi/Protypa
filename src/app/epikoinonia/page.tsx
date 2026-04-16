"use client";
import { useState } from "react";
import Link from "next/link";
import { el } from "@/lib/i18n/el";

export default function ContactPage() {
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="overflow-hidden">
      <Hero />

      <section className="relative pt-12 md:pt-16 pb-28">
        <div className="mx-auto max-w-7xl px-4">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-16">
            {/* Left — info, magazine TOC style */}
            <aside className="lg:col-span-5">
              <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
                Πού να μας βρείτε
              </div>

              <ul className="mt-8 divide-y divide-slate-200 border-y border-slate-200">
                <InfoRow
                  numeral="01"
                  label="Email"
                  value={el.contact.infoEmailValue}
                  note={el.contact.infoEmailNote}
                  href={`mailto:${el.contact.infoEmailValue}`}
                />
                <InfoRow
                  numeral="02"
                  label="Ώρες"
                  value={el.contact.infoHoursValue}
                  note={el.contact.infoHoursNote}
                />
                <InfoRow
                  numeral="03"
                  label="Τοποθεσία"
                  value={el.contact.infoLocationValue}
                  note={el.contact.infoLocationNote}
                />
              </ul>

              <p className="mt-10 text-sm text-slate-500 leading-relaxed max-w-sm">
                Πριν επικοινωνήσετε, ίσως βρείτε την απάντηση στις{" "}
                <Link
                  href="/faq"
                  className="text-ink underline decoration-amber-400 decoration-4 underline-offset-4 hover:decoration-amber-500"
                >
                  συχνές ερωτήσεις
                </Link>
                .
              </p>
            </aside>

            {/* Right — form */}
            <div className="lg:col-span-7">
              <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
                ↓ Στείλτε μήνυμα
              </div>

              {sent ? (
                <SuccessState onReset={() => setSent(false)} />
              ) : (
                <form
                  className="mt-8 space-y-8"
                  onSubmit={async (e) => {
                    e.preventDefault();
                    // MVP: front-end only. Wire up to Resend / Formspree /
                    // a Supabase contact_messages table before launch.
                    setSubmitting(true);
                    await new Promise((r) => setTimeout(r, 600));
                    setSubmitting(false);
                    setSent(true);
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-8">
                    <Field
                      label={el.contact.name}
                      name="name"
                      placeholder={el.contact.namePlaceholder}
                      required
                    />
                    <Field
                      label={el.contact.email}
                      name="email"
                      type="email"
                      placeholder={el.contact.emailPlaceholder}
                      required
                    />
                  </div>

                  <Field
                    label={el.contact.school}
                    name="school"
                    placeholder={el.contact.schoolPlaceholder}
                  />

                  <SelectField
                    label={el.contact.subject}
                    name="subject"
                    placeholder={el.contact.subjectPlaceholder}
                    options={el.contact.subjectOptions}
                  />

                  <TextareaField
                    label={el.contact.message}
                    name="message"
                    placeholder={el.contact.messagePlaceholder}
                  />

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex items-center gap-2 px-7 py-4 rounded-full bg-ink text-white font-semibold shadow-xl shadow-slate-900/20 hover:-translate-y-0.5 hover:shadow-2xl active:translate-y-0 transition-all disabled:opacity-60 disabled:hover:translate-y-0 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <SpinnerIcon className="w-4 h-4 animate-spin" />
                        {el.contact.sending}
                      </>
                    ) : (
                      <>
                        <span className="w-7 h-7 rounded-full bg-amber-300 text-ink grid place-items-center">
                          <svg
                            className="w-3 h-3 ml-0.5"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
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
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-paper" />
        <div className="hidden sm:block absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-rose-200/40 blur-3xl" />
        <div className="hidden sm:block absolute top-20 -left-40 w-[36rem] h-[36rem] rounded-full bg-amber-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #0a0a0a 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4">
        <h1 className="leading-[0.9] tracking-tight text-ink text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold">
          <span className="block">Ας</span>
          <span className="block pl-[6vw] relative">
            <span className="font-display italic font-light">μιλήσουμε.</span>
            {/* Decorative speech bubble glyph */}
            <span
              className="absolute -top-8 right-0 md:right-12 font-display text-[6rem] md:text-[9rem] leading-none italic font-light text-amber-400/80 select-none pointer-events-none"
              aria-hidden
            >
              “
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
          {el.contact.subtitle}
        </p>
      </div>
    </section>
  );
}

/* ─── INFO ROW ─────────────────────────────────────────────────────────── */

function InfoRow({
  numeral,
  label,
  value,
  note,
  href,
}: {
  numeral: string;
  label: string;
  value: string;
  note: string;
  href?: string;
}) {
  const inner = (
    <div className="group flex items-baseline gap-5 py-6">
      <span className="font-display text-2xl tabular-nums font-light text-slate-400 group-hover:text-amber-500 transition-colors flex-shrink-0">
        {numeral}
      </span>
      <div className="flex-1 min-w-0">
        <div className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
          {label}
        </div>
        <div className="mt-2 font-display text-lg sm:text-2xl md:text-3xl font-light text-ink leading-tight break-words group-hover:italic transition-all">
          {value}
        </div>
        <div className="mt-1 text-sm text-slate-500">{note}</div>
      </div>
      {href && (
        <span className="font-display text-2xl text-slate-300 group-hover:text-amber-500 group-hover:translate-x-1 transition-all flex-shrink-0">
          →
        </span>
      )}
    </div>
  );
  return (
    <li>
      {href ? (
        <a href={href} className="block">
          {inner}
        </a>
      ) : (
        inner
      )}
    </li>
  );
}

/* ─── FORM FIELDS ──────────────────────────────────────────────────────── */

function Field({
  label,
  name,
  placeholder,
  type = "text",
  required = false,
}: {
  label: string;
  name: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <label className="block group">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
        {label}
      </span>
      <input
        required={required}
        name={name}
        type={type}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-lg md:text-xl font-display text-ink placeholder:text-slate-300 placeholder:italic focus:outline-none focus:border-ink transition-colors"
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  placeholder,
  options,
}: {
  label: string;
  name: string;
  placeholder: string;
  options: readonly string[];
}) {
  return (
    <label className="block group">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
        {label}
      </span>
      <select
        required
        name={name}
        defaultValue=""
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-lg md:text-xl font-display text-ink focus:outline-none focus:border-ink transition-colors cursor-pointer"
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </label>
  );
}

function TextareaField({
  label,
  name,
  placeholder,
}: {
  label: string;
  name: string;
  placeholder?: string;
}) {
  return (
    <label className="block">
      <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
        {label}
      </span>
      <textarea
        required
        name={name}
        rows={5}
        placeholder={placeholder}
        className="mt-2 w-full bg-transparent border-0 border-b-2 border-slate-200 px-0 py-3 text-lg md:text-xl font-display text-ink placeholder:text-slate-300 placeholder:italic focus:outline-none focus:border-ink transition-colors resize-none"
      />
    </label>
  );
}

/* ─── SUCCESS STATE ────────────────────────────────────────────────────── */

function SuccessState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-8">
      <div className="font-display text-7xl font-light italic text-amber-500">
        Ευχαριστούμε.
      </div>
      <h2 className="mt-6 font-display text-3xl text-ink">
        {el.contact.sentTitle}
      </h2>
      <p className="mt-3 text-slate-600 max-w-md leading-relaxed">
        {el.contact.sentBody}
      </p>
      <button
        onClick={onReset}
        className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-full border-2 border-ink text-ink font-semibold hover:bg-ink hover:text-paper transition-colors cursor-pointer"
      >
        {el.contact.sentAction}
      </button>
    </div>
  );
}

/* ─── ICONS ────────────────────────────────────────────────────────────── */

function SpinnerIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <circle
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="3"
        opacity="0.25"
      />
      <path
        d="M12 2a10 10 0 0 1 10 10"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}
