"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface Testimonial {
  id: string;
  clientName: string;
  city: string;
  service: string;
  rating: number;
  text: string;
  imageUrl?: string | null;
}

const FALLBACK: Testimonial[] = [
  {
    id: "1",
    clientName: "Maria G.",
    city: "Palm Beach Gardens",
    service: "Kitchen Wraps",
    rating: 5,
    text: "Absolutely transformed our dated oak kitchen into a stunning modern space. The team was professional, clean, and finished in just 2 days. We saved over $18,000 compared to a full renovation.",
  },
  {
    id: "2",
    clientName: "David & Sarah T.",
    city: "Jupiter",
    service: "Custom TV Wall",
    rating: 5,
    text: "We had a plain white wall behind our TV that always bothered us. SurfaceArt installed a beautiful concrete-look panel and it completely elevated our living room. The quality is incredible.",
  },
  {
    id: "3",
    clientName: "Jennifer M.",
    city: "Boca Raton",
    service: "Bathroom Vanities",
    rating: 5,
    text: "Both our master and guest bathrooms got marble-look wraps on the vanities. They look like real stone. My guests always ask if we renovated and are shocked when I tell them it's vinyl.",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < count ? "text-gold" : "text-carbon/20"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
          aria-hidden
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  );
}

function ClientAvatar({ testimonial }: { testimonial: Testimonial }) {
  const initials = testimonial.clientName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (testimonial.imageUrl) {
    return (
      <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border border-carbon/10">
        <Image
          src={testimonial.imageUrl}
          alt={testimonial.clientName}
          fill
          className="object-cover"
          sizes="40px"
        />
      </div>
    );
  }

  return (
    <div className="w-10 h-10 rounded-full bg-carbon flex items-center justify-center flex-shrink-0">
      <span className="text-gold text-sm font-semibold font-serif">{initials}</span>
    </div>
  );
}

export default function TestimonialsSection() {
  const [items, setItems] = useState<Testimonial[]>([]);

  useEffect(() => {
    fetch("/api/testimonials")
      .then((r) => r.json())
      .then((data) => { if (data?.length) setItems(data); })
      .catch(() => {});
  }, []);

  const display = items.length > 0 ? items : FALLBACK;

  return (
    <section className="py-24 sm:py-32 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 reveal">
          <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
            Reviews
          </p>
          <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
            What our clients say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <Stars count={5} />
            <span className="text-carbon/60 text-sm">5.0 · Rated on Google</span>
          </div>
        </div>

        {/* Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {display.map((t) => (
            <div
              key={t.id}
              className="bg-white rounded-2xl p-6 shadow-sm border border-carbon/8 flex flex-col"
            >
              {/* Top row */}
              <div className="flex items-start gap-3 mb-4">
                <ClientAvatar testimonial={t} />
                <div>
                  <p className="font-semibold text-carbon text-sm">{t.clientName}</p>
                  <p className="text-carbon/50 text-xs">{t.city} · {t.service}</p>
                </div>
              </div>

              {/* Stars */}
              <Stars count={t.rating} />

              {/* Text */}
              <p className="text-carbon/70 text-sm leading-relaxed mt-4 flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
