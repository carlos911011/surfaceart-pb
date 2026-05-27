const cities = [
  { name: "West Palm Beach", x: 148, y: 108 },
  { name: "Palm Beach Gardens", x: 152, y: 72 },
  { name: "Jupiter", x: 158, y: 38 },
  { name: "Wellington", x: 88, y: 128 },
  { name: "Boca Raton", x: 158, y: 232 },
  { name: "Delray Beach", x: 155, y: 200 },
  { name: "Boynton Beach", x: 152, y: 168 },
  { name: "Lake Worth", x: 148, y: 138 },
  { name: "Royal Palm Beach", x: 90, y: 104 },
];

const stats = [
  { value: "9", label: "Cities served" },
  { value: "60mi", label: "Coverage radius" },
  { value: "Free", label: "In-home consults" },
];

export default function ServiceAreasSection() {
  return (
    <section id="service-areas" className="py-24 sm:py-32 bg-carbon overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Service Area
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-warm-white mb-4">
            We come to you
          </h2>
          <p className="text-warm-white/40 text-lg max-w-xl mx-auto">
            Free in-home consultations throughout Palm Beach County —
            every city, no extra charge.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Map */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-xs">
              {/* Glow effect behind map */}
              <div className="absolute inset-0 rounded-3xl bg-gold/5 blur-3xl scale-110" />

              <div className="relative bg-white/5 border border-white/10 rounded-3xl p-6">
                <svg
                  viewBox="0 0 220 290"
                  className="w-full"
                  aria-label="Palm Beach County map"
                >
                  {/* Ocean fill */}
                  <rect x="0" y="0" width="220" height="290" fill="#0f172a" rx="16" />

                  {/* County fill */}
                  <path
                    d="M 52 18 L 168 18 L 172 40 L 174 65 L 172 90 L 170 115 L 168 140 L 165 165 L 162 190 L 158 215 L 155 240 L 152 260 L 148 272 L 100 272 L 78 268 L 72 255 L 68 240 L 65 215 L 60 190 L 56 165 L 52 140 L 48 115 L 46 90 L 46 65 L 48 40 Z"
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="1.5"
                  />

                  {/* Atlantic Ocean strip (east side) */}
                  <path
                    d="M 168 18 L 190 18 L 190 272 L 148 272 L 152 260 L 155 240 L 158 215 L 162 190 L 165 165 L 168 140 L 170 115 L 172 90 L 174 65 L 172 40 Z"
                    fill="#1e3a5f"
                    opacity="0.6"
                  />

                  {/* Atlantic label */}
                  <text x="180" y="145" fontSize="6" fill="#93c5fd" opacity="0.5" textAnchor="middle" transform="rotate(90, 180, 145)">
                    ATLANTIC OCEAN
                  </text>

                  {/* I-95 / main road hint */}
                  <path
                    d="M 158 22 L 158 268"
                    stroke="#B8965A"
                    strokeWidth="0.8"
                    strokeDasharray="5 3"
                    opacity="0.3"
                  />

                  {/* Lake Okeechobee hint (west side) */}
                  <ellipse cx="42" cy="90" rx="18" ry="22" fill="#1e3a5f" opacity="0.3" />
                  <text x="42" y="94" fontSize="5" fill="#93c5fd" opacity="0.3" textAnchor="middle">Lake</text>

                  {/* City pins */}
                  {cities.map((city) => (
                    <g key={city.name}>
                      {/* Pulse ring */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="7"
                        fill="#B8965A"
                        opacity="0.15"
                      />
                      {/* Pin dot */}
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="3.5"
                        fill="#B8965A"
                      />
                      <circle
                        cx={city.x}
                        cy={city.y}
                        r="1.5"
                        fill="#1C1C1A"
                      />
                    </g>
                  ))}

                  {/* City labels for selected cities */}
                  {[
                    { name: "Jupiter", x: 158, y: 38 },
                    { name: "West Palm Beach", x: 148, y: 108 },
                    { name: "Wellington", x: 88, y: 128 },
                    { name: "Boca Raton", x: 158, y: 232 },
                  ].map((city) => (
                    <text
                      key={city.name}
                      x={city.x - 8}
                      y={city.y - 7}
                      fontSize="6.5"
                      fill="#e2e8f0"
                      opacity="0.7"
                      textAnchor="end"
                    >
                      {city.name}
                    </text>
                  ))}

                  {/* Coverage area label */}
                  <text x="100" y="155" fontSize="8" fill="#B8965A" opacity="0.25" textAnchor="middle" fontStyle="italic">
                    Palm Beach County
                  </text>
                </svg>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-gold text-carbon text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                  All 9 cities ✓
                </div>
              </div>
            </div>
          </div>

          {/* Right — Cities + Stats + CTA */}
          <div>
            {/* City grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-6 gap-y-3 mb-10">
              {cities.map((city) => (
                <div key={city.name} className="flex items-center gap-2.5">
                  <svg className="w-3.5 h-3.5 text-gold flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-warm-white/70 text-sm">{city.name}</span>
                </div>
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-white/10 mb-8" />

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-10">
              {stats.map(({ value, label }) => (
                <div key={label} className="text-center">
                  <p className="font-serif text-3xl text-gold mb-1">{value}</p>
                  <p className="text-warm-white/40 text-xs uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>

            {/* Not sure box */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-8 flex items-start gap-3">
              <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <p className="text-warm-white/50 text-sm leading-relaxed">
                Not sure if we cover your area?{" "}
                <a href="#quote-form" className="text-gold hover:underline">
                  Send us a message
                </a>{" "}
                — we serve additional areas beyond the list above.
              </p>
            </div>

            {/* CTA */}
            <a
              href="#quote-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-xl transition-all duration-200 group"
            >
              Get a Free In-Home Consultation
              <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
