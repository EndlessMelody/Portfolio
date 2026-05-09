"use client";

import { useMemo } from "react";
import { useActiveSection, useScrollProgress } from "@/lib/hooks";
import styles from "./ScrollRail.module.scss";

const chapters = [
  { id: "hero", no: "01", label: "Intro", kana: "自己紹介" },
  { id: "about", no: "02", label: "Story", kana: "物語" },
  { id: "skills", no: "03", label: "Skills", kana: "技能樹" },
  { id: "projects", no: "04", label: "Projects", kana: "魔法書" },
  { id: "experience", no: "05", label: "Journey", kana: "冒険" },
  { id: "contact", no: "06", label: "Contact", kana: "通信" },
];

export function ScrollRail() {
  const progress = useScrollProgress();
  const chapterIds = useMemo(() => chapters.map((c) => c.id), []);
  const active = useActiveSection(chapterIds);

  return (
    <>
      {/* Top progress bar */}
      <div
        className={styles.progress}
        style={{ transform: `scaleX(${progress})` }}
        aria-hidden
      />

      {/* Side rail (hidden on mobile) */}
      <nav className={styles.rail} aria-label="Chapter progress">
        <ul>
          {chapters.map((c) => {
            const isActive = c.id === active;
            return (
              <li
                key={c.id}
                className={`${styles.item} ${isActive ? styles.active : ""}`}
              >
                <a href={`#${c.id}`} className={styles.link}>
                  <span className={styles.dot} aria-hidden />
                  <span className={styles.tooltip}>
                    <span className={styles.no}>CH.{c.no}</span>
                    <span className={styles.label}>{c.label}</span>
                    <span className={styles.kana}>{c.kana}</span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
