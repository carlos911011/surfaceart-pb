const brands = [
  {
    name: "3M DI-NOC",
    tagline: "The original architectural vinyl",
    description:
      "The world's most trusted architectural film, used in luxury hotels, corporate offices, and premium residences globally. Class A fire rated.",
  },
  {
    name: "LG Benif",
    tagline: "Korean innovation, premium quality",
    description:
      "LG's architectural film line features exceptional color fidelity and durability. Superior adhesion and heat resistance for high-use surfaces.",
  },
  {
    name: "Belbien",
    tagline: "Japanese precision engineering",
    description:
      "Belbien films are engineered for perfection — ultra-thin for seamless application, with an unmatched catalog of wood, stone, and abstract designs.",
  },
  {
    name: "Koroseal Reatec",
    tagline: "Commercial-grade performance",
    description:
      "Reatec by Koroseal is specified by leading architects and designers for commercial interiors. Exceptionally durable with a 10-15 year lifespan.",
  },
];

const qualityBadges = [
  "Class A Fire Rated",
  "10-15 Year Lifespan",
  "Heat & Scratch Resistant",
  "UV Stable",
  "Easy to Clean",
];

export default function MaterialsSection() {
  return (
    <section className="py-24 sm:py-32 bg-carbon">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Materials
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-warm-white mb-4">
            Only the best materials
          </h2>
          <p className="text-warm-white/50 text-lg max-w-3xl mx-auto">
            We source only architectural-grade vinyl films — the same materials
            used in luxury hotels and corporate spaces worldwide.
          </p>
        </div>

        {/* Brand grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {brands.map((brand) => (
            <div
              key={brand.name}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:border-gold/20 transition-colors"
            >
              <h3 className="font-serif text-2xl text-gold mb-1">{brand.name}</h3>
              <p className="text-warm-white/40 text-xs uppercase tracking-wider mb-3">
                {brand.tagline}
              </p>
              <p className="text-warm-white/60 text-sm leading-relaxed">
                {brand.description}
              </p>
            </div>
          ))}
        </div>

        {/* Quality badges */}
        <div className="flex flex-wrap justify-center gap-3">
          {qualityBadges.map((badge) => (
            <span
              key={badge}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-gold text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
