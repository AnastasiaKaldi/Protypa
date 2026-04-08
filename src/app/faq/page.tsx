import { el } from "@/lib/i18n/el";
import { FaqClient } from "./FaqClient";

export default function FaqPage() {
  return (
    <div className="overflow-hidden">
      <Hero />
      <FaqClient />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative pt-20 pb-12 md:pt-28 md:pb-16">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-paper" />
        <div className="absolute -top-40 -left-40 w-[42rem] h-[42rem] rounded-full bg-amber-200/40 blur-3xl" />
        <div className="absolute top-20 -right-40 w-[36rem] h-[36rem] rounded-full bg-rose-200/30 blur-3xl" />
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
        <div className="text-xs font-bold tracking-[0.22em] uppercase text-slate-500">
          {el.faq.eyebrow}
        </div>

        {/* Big editorial headline */}
        <h1 className="mt-6 leading-[0.9] tracking-tight text-ink text-[clamp(2.25rem,6vw,5.5rem)] font-extrabold">
          <span className="block">{el.faq.titleA}</span>
          <span className="block pl-[6vw] relative">
            <span className="font-display italic font-light">
              {el.faq.titleB}
            </span>
            {/* Decorative question mark glyph */}
            <span
              className="absolute -top-8 right-0 md:right-12 font-display text-[6rem] md:text-[9rem] leading-none italic font-light text-amber-400/80 select-none pointer-events-none"
              aria-hidden
            >
              ?
            </span>
          </span>
        </h1>

        <p className="mt-10 max-w-xl text-lg md:text-xl text-slate-600 leading-relaxed">
          {el.faq.subtitle}
        </p>
      </div>
    </section>
  );
}
