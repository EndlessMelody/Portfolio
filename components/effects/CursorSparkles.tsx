"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./CursorSparkles.module.scss";

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: "pink" | "blue" | "lavender";
};

export function CursorSparkles() {
  const [sparkles, setSparkles] = useState<Sparkle[]>([]);
  const idRef = useRef(0);
  const lastEmit = useRef(0);
  const enabled = useRef(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fineCursor = window.matchMedia("(pointer: fine)").matches;
    enabled.current = !reduced && fineCursor;
    if (!enabled.current) return;

    const onMove = (e: MouseEvent) => {
      const now = performance.now();
      if (now - lastEmit.current < 40) return;
      lastEmit.current = now;

      const id = ++idRef.current;
      const hues: Sparkle["hue"][] = ["pink", "blue", "lavender"];
      const sparkle: Sparkle = {
        id,
        x: e.clientX,
        y: e.clientY,
        size: 8 + Math.random() * 10,
        hue: hues[Math.floor(Math.random() * hues.length)],
      };
      setSparkles((curr) => [...curr.slice(-14), sparkle]);

      window.setTimeout(() => {
        setSparkles((curr) => curr.filter((s) => s.id !== id));
      }, 750);
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className={styles.field} aria-hidden>
      {sparkles.map((s) => (
        <span
          key={s.id}
          className={`${styles.sparkle} ${styles[s.hue]}`}
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
          }}
        >
          <svg viewBox="0 0 24 24" width="100%" height="100%">
            <path
              d="M12 2 L13.8 9.2 L21 11 L13.8 12.8 L12 20 L10.2 12.8 L3 11 L10.2 9.2 Z"
              fill="currentColor"
            />
          </svg>
        </span>
      ))}
    </div>
  );
}
