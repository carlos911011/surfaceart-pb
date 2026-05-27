import type { Metadata } from "next";
import Navbar from "@/components/public/Navbar";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "SurfaceArt Palm Beach | Interior Vinyl Wraps — No Demolition, No Dust",
  description:
    "Transform your kitchen, bathroom, TV wall or furniture with premium architectural vinyl wraps. Serving West Palm Beach, Boca Raton, Jupiter & all of Palm Beach County. Free quote in 24 hours.",
  keywords: [
    "vinyl wraps Palm Beach",
    "kitchen cabinet wraps West Palm Beach",
    "interior vinyl wrap Florida",
    "3M DI-NOC installer Palm Beach County",
    "kitchen renovation alternative Boca Raton",
    "TV accent wall Palm Beach Gardens",
  ],
  alternates: { canonical: "https://surfaceartpb.com" },
  openGraph: {
    title: "SurfaceArt Palm Beach | Interior Vinyl Wraps",
    description:
      "Premium interior vinyl wraps for Palm Beach County homes. 3M DI-NOC certified installer. Kitchen wraps, TV walls, accent walls — no demolition required.",
    type: "website",
    locale: "en_US",
    siteName: "SurfaceArt Palm Beach",
  },
};
import HeroSection from "@/components/public/HeroSection";
import ServicesSection from "@/components/public/ServicesSection";
import WhyUsSection from "@/components/public/WhyUsSection";
import HowItWorksSection from "@/components/public/HowItWorksSection";
import GallerySection from "@/components/public/GallerySection";
import MaterialsSection from "@/components/public/MaterialsSection";
import TestimonialsSection from "@/components/public/TestimonialsSection";
import ServiceAreasSection from "@/components/public/ServiceAreasSection";
import QuoteForm from "@/components/public/QuoteForm";
import Footer from "@/components/public/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <ServicesSection />
        <WhyUsSection />
        <HowItWorksSection />
        <GallerySection />
        <MaterialsSection />
        <TestimonialsSection />
        <ServiceAreasSection />

        {/* Quote Form Section */}
        <section id="quote-form" className="py-24 sm:py-32 bg-cream">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-12">
              <p className="text-gold text-sm font-medium tracking-widest uppercase mb-3">
                Free Quote
              </p>
              <h2 className="font-serif text-4xl sm:text-5xl text-carbon mb-4">
                Get Your Personalized Free Quote
              </h2>
              <p className="text-carbon/60 text-lg max-w-xl mx-auto">
                Upload photos of your space — we&apos;ll send you a detailed estimate within 24 hours.
              </p>
              {/* Trust badges */}
              <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
                {["100% Free", "No Obligation", "Response in 24hrs"].map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-1.5 text-sm text-carbon/60"
                  >
                    <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {badge}
                  </span>
                ))}
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-3xl shadow-xl shadow-carbon/5 border border-carbon/8 p-6 sm:p-10">
              <QuoteForm />
            </div>
          </div>
        </section>

        <Footer />
      </main>
    </>
  );
}
