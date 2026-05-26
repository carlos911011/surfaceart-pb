"use client";

import { useEffect } from "react";

export default function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    function observeAll() {
      document.querySelectorAll(".reveal:not(.visible)").forEach((el) => {
        observer.observe(el);
      });
    }

    observeAll();

    // Re-scan after a tick in case of hydration delay
    const t = setTimeout(observeAll, 100);
    return () => {
      clearTimeout(t);
      observer.disconnect();
    };
  }, []);

  return null;
}
