const services = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    name: "Kitchen Wraps",
    description: "Cabinet doors, drawer fronts, islands — transformed with premium wood, stone, or matte finishes.",
    price: "From $1,200",
    time: "2-3 days",
    popular: true,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
    name: "Custom TV Walls",
    description: "Create a dramatic focal point behind your TV with concrete, wood slat, or stone textures.",
    price: "From $800",
    time: "1-2 days",
    popular: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
      </svg>
    ),
    name: "Accent Walls",
    description: "Feature walls in living rooms, bedrooms, or hallways that define the space.",
    price: "From $600",
    time: "1 day",
    popular: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    name: "Bathroom Vanities",
    description: "Dated vanity cabinets wrapped in marble, wood, or solid color finishes.",
    price: "From $400",
    time: "1 day",
    popular: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    name: "Countertop Wraps",
    description: "Laminate countertops wrapped to look like natural stone or quartz at a fraction of the cost.",
    price: "From $600",
    time: "1 day",
    popular: false,
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
    name: "Furniture & Doors",
    description: "Interior doors, dressers, shelving units and more — any flat surface transformed.",
    price: "From $200/piece",
    time: "Varies",
    popular: false,
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 sm:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            What We Do
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
            Surfaces that define your space
          </h2>
          <p className="text-carbon/60 text-lg max-w-2xl mx-auto">
            Every service uses only architectural-grade vinyl films — the same
            materials found in luxury hotels and high-end commercial spaces.
          </p>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.name}
              className="group relative bg-white rounded-2xl p-6 border border-carbon/8 hover:border-gold/40 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5 reveal"
            >
              {service.popular && (
                <div className="absolute -top-3 left-6">
                  <span className="bg-gold text-carbon text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}

              {/* Icon */}
              <div className="text-gold mb-5">{service.icon}</div>

              {/* Content */}
              <h3 className="font-semibold text-carbon text-xl mb-2">{service.name}</h3>
              <p className="text-carbon/60 text-sm leading-relaxed mb-6">
                {service.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-carbon/8">
                <span className="text-gold font-semibold">{service.price}</span>
                <span className="text-carbon/40 text-sm flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {service.time}
                </span>
              </div>

              {/* Hover gold border accent */}
              <div className="absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <a
            href="#quote-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-carbon hover:bg-carbon/90 text-warm-white font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
          >
            Get a Free Quote for Your Project
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
