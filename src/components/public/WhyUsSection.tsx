const differentiators = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "3M DI-NOC Certified",
    description: "We are certified preferred installers of 3M DI-NOC, the gold standard in architectural vinyl films. Only trained professionals can apply these materials properly.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
      </svg>
    ),
    title: "Zero Demolition",
    description: "No tearing out, no construction mess, no weeks of disruption. We work over your existing surfaces — your home stays livable throughout the entire process.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    title: "10-Year Warranty",
    description: "Our work is backed by a 10-year material warranty on all 3M DI-NOC and LG Benif products. We stand behind the quality of every installation we do.",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Premium Materials Only",
    description: "We exclusively use architectural-grade vinyl: 3M DI-NOC, LG Benif, Belbien, and Koroseal Reatec — the same films used in luxury hotels and premium commercial spaces.",
  },
];

export default function WhyUsSection() {
  return (
    <section className="py-24 sm:py-32 bg-carbon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Why SurfaceArt
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-warm-white mb-4">
            The difference is in the details
          </h2>
          <p className="text-warm-white/50 text-lg max-w-2xl mx-auto">
            We don&apos;t just apply vinyl — we transform spaces with the precision
            and care of a true craftsman.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {differentiators.map((item) => (
            <div
              key={item.title}
              className="group relative bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/30 transition-all duration-300 overflow-hidden reveal"
            >
              {/* Animated top border */}
              <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />

              <div className="text-gold mb-4">{item.icon}</div>
              <h3 className="text-warm-white font-semibold text-lg mb-3">{item.title}</h3>
              <p className="text-warm-white/50 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
