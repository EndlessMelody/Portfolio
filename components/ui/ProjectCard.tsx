"use client";

import { useRef, type MouseEvent } from "react";
import { ExternalLink, Github } from "lucide-react";
import type { Project } from "@/lib/data";
import styles from "./ProjectCard.module.scss";

export function ProjectCard({ project }: { project: Project }) {
  const ref = useRef<HTMLElement>(null);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.setProperty("--rx", `${(-y * 6).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(x * 8).toFixed(2)}deg`);
    el.style.setProperty("--mx", `${(x * 100 + 50).toFixed(1)}%`);
    el.style.setProperty("--my", `${(y * 100 + 50).toFixed(1)}%`);
  };

  const handleLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };

  return (
    <article
      ref={ref}
      className={`${styles.card} ${styles[project.accent]}`}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <div className={styles.thumb} style={{ background: project.image }}>
        <span className={styles.glow} aria-hidden />
        <span className={styles.title}>{project.title}</span>
      </div>

      <div className={styles.body}>
        <p className={styles.desc}>{project.description}</p>

        <ul className={styles.tech}>
          {project.tech.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ul>

        <div className={styles.links}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.linkPrimary}>
              <ExternalLink size={14} /> Live
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.linkGhost}>
              <Github size={14} /> Code
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
