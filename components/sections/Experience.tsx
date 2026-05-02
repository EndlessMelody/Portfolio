import { experiences } from "@/lib/data";
import styles from "./Experience.module.scss";
import { AnimeOrnaments } from "./AnimeOrnaments";

export function Experience() {
  const chronologicalExp = [...experiences].reverse();

  return (
    <section id="experience" className={styles.experience}>
      {/* Ambient backdrops (match About/Skills/Projects) */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />
      <AnimeOrnaments />
      <div className={styles.kanjiSpine} aria-hidden>
        <span>冒</span>
        <span>険</span>
        <span>記</span>
      </div>

      {/* Issue tag (right) */}
      <div className={styles.issueTag} aria-hidden>
        ISSUE 05 · 冒険記 · 2026
      </div>

      {/* Fireflies */}
      <div className={styles.fireflies} aria-hidden>
        {Array.from({ length: 15 }).map((_, i) => (
          <div
            key={i}
            className={styles.firefly}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Star Map ambient background */}
      <div className={styles.bgStars} aria-hidden />
      <div className={styles.bgNebula} aria-hidden />

      <div className="container">
        <header className={styles.header}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.05</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              Journey <span className={styles.chapterKana}>冒険</span>
            </span>
          </div>

          <h2 className={styles.title}>
            The{" "}
            <span className={styles.titleAccent}>Star Map</span>
          </h2>
          <p className={styles.subtitle}>
            Constellations of my career — tracing the path from left to right.
          </p>
        </header>

        {/* Constellation Map */}
        <div className={styles.constellation}>
          {chronologicalExp.map((exp, i) => {
            const isCurrent = exp.period.includes("Present");
            const isTop = i % 2 === 0;

            return (
              <div
                key={exp.role + exp.company}
                className={`${styles.node} ${isTop ? styles.nodeTop : styles.nodeBottom}`}
              >
                {/* The Star */}
                <div className={styles.starNode}>
                  <span className={styles.star}>✦</span>
                  <span className={styles.starGlow} aria-hidden />
                </div>

                {/* Connector line from star to card */}
                <div className={styles.connector} aria-hidden />

                {/* The Card */}
                <div className={styles.card}>
                  <div className={styles.cardHeader}>
                    <span className={styles.period}>{exp.period}</span>
                    {isCurrent && <span className={styles.statusPing} />}
                  </div>
                  <h3 className={styles.role}>{exp.role}</h3>
                  <p className={styles.company}>@ {exp.company}</p>
                  <p className={styles.desc}>{exp.description}</p>
                  <ul className={styles.tags}>
                    {exp.tags.map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}

          {/* SVG constellation lines connecting stars */}
          <svg className={styles.lines} preserveAspectRatio="none" aria-hidden>
            <defs>
              <linearGradient id="conGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(191, 219, 254, 0.15)" />
                <stop offset="30%" stopColor="rgba(244, 122, 160, 0.5)" />
                <stop offset="70%" stopColor="rgba(191, 219, 254, 0.5)" />
                <stop offset="100%" stopColor="rgba(244, 122, 160, 0.15)" />
              </linearGradient>
            </defs>
            <line x1="12.5%" y1="50%" x2="37.5%" y2="50%" stroke="url(#conGrad)" strokeWidth="2" />
            <line x1="37.5%" y1="50%" x2="62.5%" y2="50%" stroke="url(#conGrad)" strokeWidth="2" />
            <line x1="62.5%" y1="50%" x2="87.5%" y2="50%" stroke="url(#conGrad)" strokeWidth="2" />
          </svg>
        </div>
      </div>
    </section>
  );
}
