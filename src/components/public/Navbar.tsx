"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const navLinks = [
  { href: "#services", label: "Services" },
  { href: "#process", label: "Process" },
  { href: "#gallery", label: "Gallery" },
  { href: "#quote-form", label: "Free Quote" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on resize to desktop
  useEffect(() => {
    function onResize() {
      if (window.innerWidth >= 768) setMenuOpen(false);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-carbon/95 backdrop-blur-md shadow-lg shadow-black/20"
          : "bg-transparent",
      ].join(" ")}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex flex-col leading-none group" onClick={handleNavClick}>
          <span className="font-serif text-2xl sm:text-3xl text-warm-white group-hover:text-gold transition-colors">
            SurfaceArt
          </span>
          <span className="text-[10px] tracking-[0.25em] text-gold/80 uppercase mt-0.5">
            Palm Beach · Est. 2025
          </span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map(({ href, label }) => (
            <li key={href}>
              <a
                href={href}
                className="px-3 py-2 text-sm text-warm-white/80 hover:text-warm-white transition-colors rounded-lg hover:bg-white/5"
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="#quote-form"
            className="inline-flex items-center px-5 py-2.5 bg-gold hover:bg-gold-light text-carbon text-sm font-semibold rounded-xl transition-colors"
          >
            Get Free Quote
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 text-warm-white"
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>
          <div className="w-6 h-5 flex flex-col justify-between">
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "rotate-45 translate-y-2.5" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden bg-carbon/98 backdrop-blur-md border-t border-white/10"
        >
          <ul className="px-4 py-6 flex flex-col gap-1">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  onClick={handleNavClick}
                  className="block px-4 py-3 text-warm-white/80 hover:text-warm-white hover:bg-white/5 rounded-xl transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
            <li className="mt-4">
              <a
                href="#quote-form"
                onClick={handleNavClick}
                className="block text-center px-4 py-3 bg-gold hover:bg-gold-light text-carbon font-semibold rounded-xl transition-colors"
              >
                Get Free Quote
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
