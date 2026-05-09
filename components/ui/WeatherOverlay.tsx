"use client";

import { useMemo } from "react";
import styles from "./WeatherOverlay.module.scss";

type Kind =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

/**
 * Renders a fullscreen particle overlay based on the current weather kind.
 * - rain/storm: animated slanted raindrops
 * - snow:       gentle snowflakes
 * - fog:        horizontal haze layer (no particles)
 * - everything else: nothing
 */
export function WeatherOverlay({ kind }: { kind: Kind | null }) {
  const drops = useMemo(() => {
    if (kind !== "rain" && kind !== "storm") return [];
    const n = kind === "storm" ? 80 : 50;
    return Array.from({ length: n }, (_, i) => ({
      id: i,
      left: (i * 131 + 7) % 100,
      delay: (i * 0.073) % 2,
      duration: 0.7 + ((i * 11) % 9) * 0.08,
      opacity: 0.3 + ((i * 7) % 5) * 0.12,
    }));
  }, [kind]);

  const flakes = useMemo(() => {
    if (kind !== "snow") return [];
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      left: (i * 97 + 3) % 100,
      delay: (i * 0.4) % 10,
      duration: 7 + ((i * 5) % 8),
      size: 3 + ((i * 3) % 5),
      drift: ((i % 7) - 3) * 30,
    }));
  }, [kind]);

  if (!kind) return null;

  return (
    <div className={styles.overlay} data-kind={kind} aria-hidden>
      {(kind === "rain" || kind === "storm") && (
        <div className={styles.rain}>
          {drops.map((d) => (
            <span
              key={d.id}
              className={styles.drop}
              style={{
                left: `${d.left}%`,
                animationDelay: `${d.delay}s`,
                animationDuration: `${d.duration}s`,
                opacity: d.opacity,
              }}
            />
          ))}
          {kind === "storm" && <div className={styles.flash} />}
        </div>
      )}

      {kind === "snow" && (
        <div className={styles.snow}>
          {flakes.map((f) => (
            <span
              key={f.id}
              className={styles.flake}
              style={
                {
                  left: `${f.left}%`,
                  animationDelay: `${f.delay}s`,
                  animationDuration: `${f.duration}s`,
                  width: `${f.size}px`,
                  height: `${f.size}px`,
                  "--drift": `${f.drift}px`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {kind === "fog" && <div className={styles.fog} />}
    </div>
  );
}
