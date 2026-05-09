"use client";

import { useEffect, useState } from "react";

/**
 * Returns the window.scrollY value, throttled to requestAnimationFrame.
 * Safe on SSR (returns 0 until mounted).
 */
export function useScrollY() {
  const [y, setY] = useState(0);

  useEffect(() => {
    let frame = 0;
    const handler = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        setY(window.scrollY);
        frame = 0;
      });
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return y;
}

export type TimeOfDay = "morning" | "afternoon" | "evening" | "night";

export type Greeting = {
  time: TimeOfDay;
  text: string;
  kana: string;
  icon: string;
};

/**
 * Time-aware greeting for the visitor based on their local hour.
 */
export function useTimeGreeting(): Greeting {
  const [g, setG] = useState<Greeting>(() => computeGreeting(new Date()));

  useEffect(() => {
    setG(computeGreeting(new Date()));
    const id = setInterval(() => setG(computeGreeting(new Date())), 60_000);
    return () => clearInterval(id);
  }, []);

  return g;
}

function computeGreeting(d: Date): Greeting {
  const h = d.getHours();
  if (h >= 5 && h < 12)
    return {
      time: "morning",
      text: "Good morning, traveler",
      kana: "おはよう",
      icon: "☀",
    };
  if (h >= 12 && h < 17)
    return {
      time: "afternoon",
      text: "Good afternoon, adventurer",
      kana: "こんにちは",
      icon: "✿",
    };
  if (h >= 17 && h < 22)
    return {
      time: "evening",
      text: "Good evening, wanderer",
      kana: "こんばんは",
      icon: "✦",
    };
  return {
    time: "night",
    text: "Still awake, night owl?",
    kana: "夜更かし",
    icon: "☾",
  };
}

export type Season = "winter" | "spring" | "summer" | "autumn";

export type SeasonMeta = {
  season: Season;
  kanji: string;
  label: string;
  accent: string;
};

/**
 * Detect northern-hemisphere season from the current month.
 */
export function useSeason(): SeasonMeta {
  const [s, setS] = useState<SeasonMeta>(() => computeSeason(new Date()));

  useEffect(() => {
    setS(computeSeason(new Date()));
    const id = setInterval(
      () => setS(computeSeason(new Date())),
      1000 * 60 * 60,
    );
    return () => clearInterval(id);
  }, []);

  return s;
}

function computeSeason(d: Date): SeasonMeta {
  const m = d.getMonth(); // 0-11
  if (m >= 2 && m <= 4)
    return {
      season: "spring",
      kanji: "春",
      label: "Spring",
      accent: "#f8a1c7",
    };
  if (m >= 5 && m <= 7)
    return {
      season: "summer",
      kanji: "夏",
      label: "Summer",
      accent: "#ffc38a",
    };
  if (m >= 8 && m <= 10)
    return {
      season: "autumn",
      kanji: "秋",
      label: "Autumn",
      accent: "#e78a5a",
    };
  return { season: "winter", kanji: "冬", label: "Winter", accent: "#a4c6ff" };
}

/**
 * Returns the id of the section currently in view. Uses a scroll-based
 * "last section whose top has crossed the 35% viewport line" rule which
 * is far more reliable than narrow IntersectionObserver rootMargins at
 * document extremes (top of Hero, bottom of Contact).
 */
export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? "");
  const key = ids.join("|");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      const triggerLine = window.scrollY + window.innerHeight * 0.35;
      let current = ids[0] ?? "";
      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const top = el.getBoundingClientRect().top + window.scrollY;
        if (top <= triggerLine) current = id;
      }
      setActive(current);
      frame = 0;
    };
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return active;
}

/**
 * Compute 0-1 scroll progress across the entire document.
 */
export function useScrollProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let frame = 0;
    const handler = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        setP(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
        frame = 0;
      });
    };
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    window.addEventListener("resize", handler, { passive: true });
    return () => {
      window.removeEventListener("scroll", handler);
      window.removeEventListener("resize", handler);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return p;
}
