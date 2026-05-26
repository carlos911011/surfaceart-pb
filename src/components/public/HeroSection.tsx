"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 500, suffix: "+", label: "Surfaces Transformed" },
  { value: 5, suffix: "★", label: "Google Rating" },
  { value: 80, suffix: "%", label: "Savings vs Renovation" },
  { value: 10, suffix: "-yr", label: "Warranty" },
];

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!active) return;
    let start = 0;
    const step = Math.ceil(target / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [active, target, duration]);
  return count;
}

function StatItem({ value, suffix, label }: { value: number; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const count = useCountUp(value, active);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center">
      <span className="font-serif text-3xl sm:text-4xl font-bold text-gold">
        {count}{suffix}
      </span>
      <span className="text-xs sm:text-sm text-warm-white/60 mt-1 text-center">{label}</span>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-carbon">
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(184,150,90,1) 1px, transparent 1px), linear-gradient(90deg, rgba(184,150,90,1) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
        aria-hidden
      />

      {/* Gold radial glow */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.07] blur-3xl pointer-events-none"
        style={{ background: "radial-gradient(circle, #B8965A 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 sm:py-40 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        {/* Left — text content */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-8">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse" aria-hidden />
            <span className="text-gold text-sm font-medium tracking-wide">
              3M DI-NOC Certified Installer · Palm Beach County
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl text-warm-white leading-[1.05] mb-6">
            Transform your interiors in{" "}
            <span className="text-gold">3 to 5 days</span>
          </h1>

          {/* Subtitle */}
          <p className="text-warm-white/70 text-lg sm:text-xl leading-relaxed mb-10 max-w-xl">
            Premium architectural vinyl wraps for your kitchen, TV wall, bathroom
            and furniture — no demolition, no dust, and{" "}
            <span className="text-warm-white font-medium">80% less than traditional renovation</span>.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a
              href="#quote-form"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gold hover:bg-gold-light text-carbon font-semibold text-lg rounded-xl transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-gold/20"
            >
              Get Your Free Quote
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="#gallery"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-warm-white/30 hover:border-warm-white/60 text-warm-white/80 hover:text-warm-white font-medium text-lg rounded-xl transition-all duration-200 hover:bg-white/5"
            >
              View Our Work
            </a>
          </div>
        </div>

        {/* Right — decorative transformation visual */}
        <div className="hidden lg:flex items-center justify-center">
          <div className="relative w-full max-w-md">
            {/* Before panel */}
            <div className="w-full h-72 rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <div className="w-full h-full relative">
                {/* Simulated "before" oak kitchen */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B6914] via-[#A0783A] to-[#6B4F1C]">
                  <div className="absolute inset-4 grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }).map((_, i) => (
                      <div
                        key={i}
                        className="rounded bg-[#7A5C25]/60 border border-[#9B7535]/40"
                        style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 8px, rgba(0,0,0,0.05) 8px, rgba(0,0,0,0.05) 9px)" }}
                      />
                    ))}
                  </div>
                </div>
                <div className="absolute bottom-3 left-3 bg-black/50 rounded-lg px-3 py-1.5 text-xs text-warm-white/80 font-medium">
                  Before
                </div>
              </div>
            </div>

            {/* Arrow */}
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg shadow-gold/30 animate-[fade-up_1s_ease_forwards]">
              <svg className="w-5 h-5 text-carbon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>

            {/* After panel */}
            <div className="absolute -right-4 -bottom-4 w-4/5 h-56 rounded-2xl overflow-hidden shadow-2xl border border-gold/20">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1C1C1A] via-[#2A2A28] to-[#111110]">
                <div className="absolute inset-4 grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div
                      key={i}
                      className="rounded bg-[#2C2C2A]/80 border border-gold/10"
                      style={{ backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 12px, rgba(184,150,90,0.04) 12px, rgba(184,150,90,0.04) 13px)" }}
                    />
                  ))}
                </div>
              </div>
              <div className="absolute bottom-3 left-3 bg-gold/20 rounded-lg px-3 py-1.5 text-xs text-gold font-medium border border-gold/30">
                After
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
            {stats.map((s) => (
              <StatItem key={s.label} {...s} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
