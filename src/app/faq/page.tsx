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
    <section
      className="relative pt-16 pb-20 md:pt-24 md:pb-28 clip-x overflow-hidden"
      style={{ backgroundImage: "url(/faq.jpg)", backgroundSize: "cover", backgroundPosition: "center" }}
    >
      <div className="absolute inset-0 bg-brand/80" />
      {/* Sprite decorations */}
      <img src="/TransparentAssets/Asset 20.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-4 right-8 w-32 md:w-52 opacity-85 rotate-6 hidden sm:block" />
      <img src="/TransparentAssets/Asset 18.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute bottom-0 right-[30%] w-24 md:w-36 opacity-75 -rotate-12 hidden md:block" />
      <img src="/TransparentAssets/Asset 22.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute top-8 right-[45%] w-16 md:w-24 opacity-70 rotate-12 hidden lg:block" />
      <img src="/TransparentAssets/Asset 9.png" alt="" aria-hidden="true" className="pointer-events-none select-none absolute -bottom-4 right-4 w-28 md:w-44 opacity-80 hidden sm:block" />
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-paper/70 mb-4">
          {el.faq.eyebrow}
        </div>
        <h1 className="font-display text-[clamp(2.5rem,7vw,6rem)] leading-none text-paper">
          {el.faq.titleA}
          <br />
          <span className="text-[#c8ff00]">{el.faq.titleB}</span>
        </h1>
        <p className="mt-8 max-w-xl text-base md:text-lg text-paper/80 leading-relaxed">
          {el.faq.subtitle}
        </p>
      </div>
    </section>
  );
}
