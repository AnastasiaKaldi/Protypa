export default function Loading() {
  return (
    <div>
      {/* Hero skeleton */}
      <div className="relative pt-12 pb-14 md:pt-18 md:pb-20 bg-[#056ef5]/80 animate-pulse">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="h-3 w-24 bg-white/30 rounded mb-4" />
          <div className="h-16 w-2/3 bg-white/20 rounded-lg mb-4" />
          <div className="h-5 w-1/2 bg-white/15 rounded" />
        </div>
      </div>

      {/* Plans skeleton */}
      <section className="py-10 md:py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-3xl border border-ink/10 p-8 animate-pulse">
                <div className="h-4 w-20 bg-ink/10 rounded mb-6" />
                <div className="h-10 w-32 bg-ink/10 rounded mb-3" />
                <div className="h-4 w-full bg-ink/10 rounded mb-2" />
                <div className="h-4 w-3/4 bg-ink/10 rounded mb-8" />
                <div className="space-y-3">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 w-full bg-ink/10 rounded" />
                  ))}
                </div>
                <div className="mt-8 h-12 w-full bg-ink/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
