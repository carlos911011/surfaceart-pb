const steps = [
  {
    number: "01",
    title: "Upload your photos & describe your vision",
    description:
      "Use our free quote form to upload photos of the space you want to transform. Tell us what finish, texture, or style you're going for.",
  },
  {
    number: "02",
    title: "Receive your personalized estimate in 24hrs",
    description:
      "We review your photos, measure the scope, and send you a detailed quote with material options and pricing — within one business day.",
  },
  {
    number: "03",
    title: "Free in-home consultation with physical samples",
    description:
      "We bring actual material samples to your home so you can see and feel the difference. No commitment required.",
  },
  {
    number: "04",
    title: "Professional installation · Your space transformed",
    description:
      "Our certified installers arrive, protect your surfaces, and apply the vinyl with precision. Most projects complete in 1-3 days.",
  },
];

export default function HowItWorksSection() {
  return (
    <section id="process" className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            The Process
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
            Simple. Fast. Stunning.
          </h2>
          <p className="text-carbon/60 text-lg max-w-2xl mx-auto">
            From first contact to completed transformation in as little as one week.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20" aria-hidden />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, i) => (
              <div key={step.number} className="relative flex flex-col items-center text-center lg:items-center reveal">
                {/* Number circle */}
                <div className="relative z-10 w-20 h-20 rounded-full bg-carbon border-2 border-gold/50 flex items-center justify-center mb-6 shadow-lg shadow-carbon/20">
                  <span className="font-serif text-2xl font-bold text-gold">{step.number}</span>
                </div>

                {/* Connector line (mobile) */}
                {i < steps.length - 1 && (
                  <div className="sm:hidden absolute top-10 left-1/2 w-0.5 h-8 bg-gold/30 translate-x-8" aria-hidden />
                )}

                <h3 className="font-semibold text-carbon text-lg mb-3 max-w-xs">
                  {step.title}
                </h3>
                <p className="text-carbon/60 text-sm leading-relaxed max-w-xs">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <a
            href="#quote-form"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
          >
            Start with Step 1 — It&apos;s Free
          </a>
        </div>
      </div>
    </section>
  );
}
