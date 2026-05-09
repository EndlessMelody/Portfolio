"use client";

import { useMemo } from "react";
import { useSeason } from "@/lib/hooks";
import styles from "./SeasonalOverlay.module.scss";

/**
 * Subtle season indicator pinned to the footer-ish area:
 * - small chip top-left of viewport with current season kanji
 * - optional particle layer handled by existing SakuraPetals (spring default)
 *   For other seasons we swap colors/shapes via CSS data-attr on <body>.
 */
export function SeasonalOverlay() {
  const { season, kanji, label } = useSeason();

  const shapes = useMemo(() => {
    // deterministic seed per season so SSR matches CSR
    const n = 14;
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: (i * 97 + 11) % 100,
      delay: (i * 0.7) % 10,
      duration: 12 + ((i * 3) % 8),
      drift: ((i % 5) - 2) * 60,
      size: 10 + ((i * 7) % 10),
    }));
  }, []);

  return (
    <>
      <div
        className={styles.chip}
        data-season={season}
        aria-label={`Current season: ${label}`}
      >
        <span className={styles.kanji}>{kanji}</span>
        <span className={styles.label}>{label}</span>
      </div>

      {/* Seasonal particle layer (skips spring — SakuraPetals already covers it). */}
      {season !== "spring" && (
        <div className={styles.particles} data-season={season} aria-hidden>
          {shapes.map((s) => (
            <span
              key={s.id}
              className={styles.particle}
              style={
                {
                  left: `${s.left}%`,
                  animationDelay: `${s.delay}s`,
                  animationDuration: `${s.duration}s`,
                  width: `${s.size}px`,
                  height: `${s.size}px`,
                  "--drift": `${s.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}
    </>
  );
}
