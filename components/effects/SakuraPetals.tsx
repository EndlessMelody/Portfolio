"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SakuraPetals.module.scss";

type Petal = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  drift: number;
  size: number;
  rotation: number;
  variant: number;
};

export function SakuraPetals({ count = 16 }: { count?: number }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setEnabled(!reduced);
  }, []);

  const petals = useMemo<Petal[]>(() => {
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 12,
      duration: 12 + Math.random() * 10,
      drift: (Math.random() - 0.5) * 320,
      size: 14 + Math.random() * 14,
      rotation: Math.random() * 360,
      variant: i % 3,
    }));
  }, [count]);

  if (!enabled) return null;

  return (
    <div className={styles.field} aria-hidden>
      {petals.map((p) => (
        <span
          key={p.id}
          className={`${styles.petal} ${styles[`v${p.variant}`]}`}
          style={
            {
              left: `${p.left}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDelay: `${p.delay}s`,
              animationDuration: `${p.duration}s`,
              "--drift": `${p.drift}px`,
              transform: `rotate(${p.rotation}deg)`,
            } as React.CSSProperties
          }
        >
          <svg viewBox="0 0 32 32" width="100%" height="100%">
            <path
              d="M16 2 C20 8, 28 10, 28 16 C28 22, 20 26, 16 30 C12 26, 4 22, 4 16 C4 10, 12 8, 16 2 Z"
              fill="currentColor"
              opacity="0.85"
            />
            <circle cx="16" cy="16" r="2.5" fill="rgba(255,255,255,0.6)" />
          </svg>
        </span>
      ))}
    </div>
  );
}
