"use client";

import { useEffect, useState } from "react";
import styles from "./KonamiEasterEgg.module.scss";

const SEQUENCE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const stats = [
  { label: "LINES_OF_CODE", value: "~128,400", hue: "pink" },
  { label: "COFFEES_BREWED", value: "∞", hue: "blue" },
  { label: "BUGS_DEFEATED", value: "2,814", hue: "lavender" },
  { label: "COMMITS_PUSHED", value: "3,207", hue: "pink" },
  { label: "ANIME_WATCHED", value: "247", hue: "blue" },
  { label: "LATE_NIGHTS", value: "countless", hue: "lavender" },
];

export function KonamiEasterEgg() {
  const [buffer, setBuffer] = useState<string[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (open) {
        if (e.key === "Escape") setOpen(false);
        return;
      }
      // Accept both cases for b/a
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      setBuffer((prev) => {
        const next = [...prev, key].slice(-SEQUENCE.length);
        if (next.length === SEQUENCE.length && next.every((k, i) => k === SEQUENCE[i])) {
          setOpen(true);
          return [];
        }
        return next;
      });
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label="Developer mode"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
    >
      <div className={styles.crt}>
        <div className={styles.scanlines} aria-hidden />

        <header className={styles.head}>
          <div className={styles.prompt}>
            <span className={styles.green}>melody@portfolio</span>
            <span className={styles.dim}>:</span>
            <span className={styles.cyan}>~/dev-mode</span>
            <span className={styles.dim}>$</span>
            <span className={styles.cmd}>unlock --secret</span>
          </div>
          <button
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close developer mode"
            type="button"
          >
            [ESC]
          </button>
        </header>

        <div className={styles.banner}>
          <pre aria-hidden>{banner}</pre>
          <p className={styles.sub}>
            &gt; You found the secret. Welcome, fellow wanderer.
          </p>
        </div>

        <section className={styles.grid}>
          {stats.map((s) => (
            <div key={s.label} className={styles.card} data-hue={s.hue}>
              <div className={styles.cardLabel}>{s.label}</div>
              <div className={styles.cardValue}>{s.value}</div>
            </div>
          ))}
        </section>

        <footer className={styles.foot}>
          <span className={styles.dim}>// tip:</span>
          <span>
            press <kbd>ESC</kbd> to return — or try the Konami code again
            anywhere to reopen
          </span>
        </footer>
      </div>
    </div>
  );
}

const banner = `
 ██████   ███████ ██    ██     ███    ███  ██████  ██████  ███████
 ██   ██  ██      ██    ██     ████  ████ ██    ██ ██   ██ ██
 ██   ██  █████   ██    ██     ██ ████ ██ ██    ██ ██   ██ █████
 ██   ██  ██       ██  ██      ██  ██  ██ ██    ██ ██   ██ ██
 ██████   ███████   ████       ██      ██  ██████  ██████  ███████
`;
