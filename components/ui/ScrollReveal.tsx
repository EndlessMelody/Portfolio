"use client";

import { useEffect } from "react";

/**
 * Global scroll-reveal hook.
 * Automatically observes any element with the `reveal` class and adds
 * `is-visible` when it enters the viewport. Uses IntersectionObserver so
 * it is cheap and only runs once per element (unobserves after reveal).
 */
export function ScrollReveal() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced-motion: instantly reveal everything.
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".reveal")
    );

    if (reduce || !("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -6% 0px",
      }
    );

    elements.forEach((el) => observer.observe(el));

    // Re-scan periodically for dynamically-added .reveal nodes (lightweight).
    const rescan = () => {
      document
        .querySelectorAll<HTMLElement>(".reveal:not(.is-visible)")
        .forEach((el) => observer.observe(el));
    };
    const mo = new MutationObserver(rescan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
