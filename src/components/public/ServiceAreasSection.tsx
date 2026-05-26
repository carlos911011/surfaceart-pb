const cities = [
  "West Palm Beach",
  "Palm Beach Gardens",
  "Jupiter",
  "Wellington",
  "Boca Raton",
  "Delray Beach",
  "Boynton Beach",
  "Lake Worth",
  "Royal Palm Beach",
];

export default function ServiceAreasSection() {
  return (
    <section className="py-24 sm:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left */}
          <div>
            <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
              Service Area
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
              Serving all of Palm Beach County
            </h2>
            <p className="text-carbon/60 text-lg mb-8">
              We offer free in-home consultations throughout Palm Beach County.
              Not sure if we serve your area? Contact us — we&apos;ll let you know.
            </p>

            {/* City tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {cities.map((city) => (
                <span
                  key={city}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-cream border border-gold/20 rounded-full text-sm text-carbon/70 hover:border-gold/50 hover:text-carbon transition-colors"
                >
                  <svg className="w-3 h-3 text-gold" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {city}
                </span>
              ))}
            </div>

            <a
              href="#quote-form"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-xl transition-all duration-200"
            >
              Get a Free Quote
            </a>
          </div>

          {/* Right — simplified Palm Beach County SVG map */}
          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-sm">
              {/* Map background */}
              <div className="bg-cream border-2 border-gold/20 rounded-3xl p-8 shadow-lg">
                <svg viewBox="0 0 200 300" className="w-full" aria-label="Palm Beach County, Florida map">
                  {/* Florida outline simplified */}
                  <path
                    d="M 60 20 L 160 20 L 170 40 L 175 80 L 170 120 L 165 160 L 160 200 L 155 240 L 150 270 L 100 280 L 80 270 L 75 240 L 70 200 L 65 160 L 55 120 L 50 80 L 55 40 Z"
                    fill="#F5F0E8"
                    stroke="#B8965A"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* County highlight */}
                  <path
                    d="M 55 100 L 170 100 L 170 160 L 55 160 Z"
                    fill="#B8965A"
                    fillOpacity="0.15"
                    stroke="#B8965A"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                  {/* Pin marker */}
                  <circle cx="112" cy="130" r="8" fill="#B8965A" />
                  <circle cx="112" cy="130" r="4" fill="#1C1C1A" />
                  {/* Label */}
                  <text x="112" y="155" textAnchor="middle" className="text-[10px]" fill="#1C1C1A" fontSize="9" fontFamily="serif">
                    Palm Beach County
                  </text>
                  {/* Atlantic coast accent */}
                  <path d="M 165 60 L 175 80 L 175 140 L 170 160" stroke="#93C5FD" strokeWidth="3" fill="none" opacity="0.5" strokeLinecap="round" />
                  <text x="178" y="115" fontSize="7" fill="#93C5FD" opacity="0.7">Atlantic</text>
                </svg>
              </div>

              {/* Floating city badges */}
              <div className="absolute -top-3 -right-3 bg-gold text-carbon text-xs font-semibold px-3 py-1.5 rounded-full shadow-md">
                9 Cities
              </div>
              <div className="absolute -bottom-3 -left-3 bg-white border border-gold/20 text-carbon/60 text-xs px-3 py-1.5 rounded-full shadow-md">
                Free in-home consults
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
