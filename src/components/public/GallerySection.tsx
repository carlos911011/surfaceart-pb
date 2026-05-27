"use client";

import { useEffect, useState } from "react";

interface GalleryItem {
  id: string;
  title: string;
  service: string;
  city?: string | null;
  beforeImage: string;
  afterImage: string;
}

const PLACEHOLDER_GRADIENTS = [
  { before: "from-[#8B6914] to-[#6B4F1C]", after: "from-[#1C1C1A] to-[#2A2A28]" },
  { before: "from-[#6B7280] to-[#4B5563]", after: "from-[#1E293B] to-[#0F172A]" },
  { before: "from-[#92400E] to-[#78350F]", after: "from-[#F5F0E8] to-[#E8E0D0]" },
  { before: "from-[#9CA3AF] to-[#6B7280]", after: "from-[#1C1C1A] to-[#3A3A38]" },
  { before: "from-[#7C3AED] to-[#5B21B6]", after: "from-[#111827] to-[#1F2937]" },
  { before: "from-[#B45309] to-[#92400E]", after: "from-[#FAFAF7] to-[#F5F0E8]" },
];

function GalleryCard({ item, index }: { item: GalleryItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const grad = PLACEHOLDER_GRADIENTS[index % PLACEHOLDER_GRADIENTS.length];
  const isPlaceholder = item.beforeImage.includes("placeholder");

  return (
    <div
      className="group relative rounded-2xl overflow-hidden aspect-[4/3] cursor-pointer shadow-lg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      role="img"
      aria-label={`${item.title} — before and after`}
    >
      {/* Before */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-0" : "opacity-100"}`}
      >
        {isPlaceholder ? (
          <div className={`w-full h-full bg-gradient-to-br ${grad.before} flex flex-col items-center justify-center`}>
            <span className="text-white/40 text-xs uppercase tracking-widest mb-2">Before</span>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.beforeImage} alt={`Before: ${item.title}`} className="w-full h-full object-cover" />
        )}
      </div>

      {/* After */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ${hovered ? "opacity-100" : "opacity-0"}`}
      >
        {isPlaceholder ? (
          <div className={`w-full h-full bg-gradient-to-br ${grad.after} flex flex-col items-center justify-center`}>
            <span className="text-gold/60 text-xs uppercase tracking-widest mb-2">After</span>
            <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
              <svg className="w-8 h-8 text-gold/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.afterImage} alt={`After: ${item.title}`} className="w-full h-full object-cover" />
        )}
      </div>

      {/* Label overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent pt-10 pb-4 px-4">
        <p className="text-white font-medium text-sm drop-shadow">{item.title}</p>
        <div className="flex items-center gap-2 mt-1">
          <span className="text-gold text-xs drop-shadow">{item.service}</span>
          {item.city && <span className="text-white/60 text-xs">· {item.city}</span>}
        </div>
      </div>

      {/* Hover indicator */}
      <div className="absolute top-3 right-3 bg-black/50 rounded-lg px-2 py-1">
        <span className="text-xs text-white/70">{hovered ? "After ✓" : "Hover →"}</span>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);

  useEffect(() => {
    fetch("/api/gallery")
      .then((r) => r.json())
      .then(setItems)
      .catch(() => {});
  }, []);

  const displayItems = items.length > 0 ? items.slice(0, 6) : [];

  return (
    <section id="gallery" className="py-24 sm:py-32 bg-warm-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Our Work
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
            Real transformations, real results
          </h2>
          <p className="text-carbon/60 text-lg max-w-2xl mx-auto">
            Hover over any photo to see the before/after transformation.
          </p>
        </div>

        {displayItems.length > 0 ? (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayItems.map((item, i) => (
                <GalleryCard key={item.id} item={item} index={i} />
              ))}
            </div>
            <div className="text-center mt-12">
              <a
                href="#quote-form"
                className="inline-flex items-center gap-2 px-6 py-3 border border-carbon/20 hover:border-gold text-carbon hover:text-gold rounded-xl transition-all duration-200"
              >
                Want a transformation like this? Get a free quote
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </a>
            </div>
          </>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PLACEHOLDER_GRADIENTS.map((_, i) => (
              <div
                key={i}
                className="aspect-[4/3] rounded-2xl bg-carbon/5 animate-pulse"
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
