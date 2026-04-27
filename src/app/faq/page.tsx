import { el } from "@/lib/i18n/el";
import { FaqClient } from "./FaqClient";

export default function FaqPage() {
  return (
    <div>
      <Hero />
      <FaqClient />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative bg-brand pt-16 pb-20 md:pt-24 md:pb-28 clip-x">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-ink/50 mb-4">
          {el.faq.eyebrow}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-ink">
          {el.faq.titleA}
          <br />
          <span className="text-paper">{el.faq.titleB}</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-ink/60 leading-relaxed">
          {el.faq.subtitle}
        </p>
      </div>
    </section>
  );
}
