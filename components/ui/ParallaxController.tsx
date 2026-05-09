"use client";

import { useEffect } from "react";

/**
 * Global parallax driver — zero config per element.
 * Mark any element with `data-parallax="<speed>"` (e.g. 0.12, 0.3, -0.2).
 * The controller updates its `translate` transform every scroll frame
 * relative to its distance from viewport center.
 *
 * Positive speed = element moves slower than scroll (classic parallax).
 * Negative speed = element moves opposite direction.
 */
export function ParallaxController() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduce) return;

    let frame = 0;
    let elements: { el: HTMLElement; speed: number }[] = [];

    const collect = () => {
      elements = Array.from(
        document.querySelectorAll<HTMLElement>("[data-parallax]")
      ).map((el) => ({
        el,
        speed: parseFloat(el.dataset.parallax || "0") || 0,
      }));
    };

    const update = () => {
      const vh = window.innerHeight;
      const scrollY = window.scrollY;
      for (const { el, speed } of elements) {
        // Distance of element's top from viewport top.
        const rect = el.getBoundingClientRect();
        const elTop = rect.top + scrollY;
        // Offset from viewport center — normalised baseline.
        const offset = scrollY + vh / 2 - (elTop + rect.height / 2);
        el.style.setProperty("--parallax-y", `${offset * speed}px`);
      }
      frame = 0;
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    collect();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Re-collect on DOM mutations (late-mounted sections, lazy components).
    const mo = new MutationObserver(() => {
      collect();
      onScroll();
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      mo.disconnect();
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
