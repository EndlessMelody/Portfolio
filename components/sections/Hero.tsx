"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Github,
  Linkedin,
  Mail,
  MapPin,
  Cpu,
  Code2,
  Sparkles,
  Music2,
  Hammer,
  Play,
  Pause,
} from "lucide-react";
import { personal } from "@/lib/data";
import { useAudioPlayer } from "@/components/providers/AudioPlayerProvider";
import styles from "./Hero.module.scss";



const rotatingLines = [
  "building ML models with a heart ♡",
  "shipping software like a craftswoman",
  "dreaming in tensors & types",
  "learning, shipping, repeat ✦",
];

const roleIcon = {
  cpu: Cpu,
  code: Code2,
  sparkle: Sparkles,
} as const;

export function Hero() {
  const [typed, setTyped] = useState("");
  const [lineIdx, setLineIdx] = useState(0);
  const [phase, setPhase] = useState<"typing" | "holding" | "erasing">(
    "typing",
  );

  const [timeOfDay, setTimeOfDay] = useState<"day" | "sunset" | "night">("day");
  const [scrollY, setScrollY] = useState(0);
  const { isPlaying, togglePlay, hasError } = useAudioPlayer();



  // Detect time of day for ambient color shift
  useEffect(() => {
    const updateTime = () => {
      const hour = new Date().getHours();
      if (hour >= 6 && hour < 17) setTimeOfDay("day");
      else if (hour >= 17 && hour < 20) setTimeOfDay("sunset");
      else setTimeOfDay("night");
    };
    updateTime();
    const interval = setInterval(updateTime, 60000); // update every minute
    return () => clearInterval(interval);
  }, []);

  // Scroll parallax for kanji spine and issue tag
  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = rotatingLines[lineIdx];
    let t: number | undefined;

    if (phase === "typing") {
      if (typed.length < target.length) {
        t = window.setTimeout(
          () => setTyped(target.slice(0, typed.length + 1)),
          55,
        );
      } else {
        t = window.setTimeout(() => setPhase("holding"), 1600);
      }
    } else if (phase === "holding") {
      t = window.setTimeout(() => setPhase("erasing"), 400);
    } else {
      if (typed.length > 0) {
        t = window.setTimeout(
          () => setTyped(target.slice(0, typed.length - 1)),
          28,
        );
      } else {
        setPhase("typing");
        setLineIdx((v) => (v + 1) % rotatingLines.length);
      }
    }

    return () => {
      if (t) window.clearTimeout(t);
    };
  }, [typed, phase, lineIdx]);

  return (
    <section
      id="hero"
      className={`${styles.hero} ${styles[`time-${timeOfDay}`]}`}
      data-time={timeOfDay}
    >
      {/* ===== Ambient backdrops ===== */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />

      {/* Vertical kanji watermark spine — far left with parallax */}
      <div
        className={styles.kanjiSpine}
        aria-hidden
        style={{ transform: `translateY(${scrollY * 0.15}px)` }}
      >
        {personal.kanjiChars.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* Magazine spine — far right with parallax (slower) */}
      <div
        className={styles.issueTag}
        aria-hidden
        style={{ transform: `translateY(${scrollY * 0.08}px)` }}
      >
        ISSUE 01 · 自己紹介編 · 2026
      </div>

      <div className={`container ${styles.inner}`}>
        {/* ============== LEFT: text + bentos ============== */}
        <div className={styles.text}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.01</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              Introduction <span className={styles.chapterKana}>自己紹介</span>
            </span>
          </div>

          <div className={styles.nameBlock}>
            <div className={styles.kanaLine} aria-hidden>
              <span className={styles.kanaSmall}>{personal.kana}</span>
            </div>

            <h1 className={styles.title}>
              <span className={styles.gradientText}>
                {personal.name}
              </span>
              <span className={styles.kanjiSuffix}>({personal.kanji})</span>
              <span className={styles.titlePeriod}>.</span>
            </h1>

            <p className={styles.realName}>
              <span className={styles.aka}>a.k.a.</span>
              <span className={styles.realNameText}>{personal.fullName}</span>
            </p>
          </div>

          <ul className={styles.roleTags} aria-label="Focus areas">
            {personal.roles.map((r) => {
              const Icon =
                roleIcon[r.icon as keyof typeof roleIcon] ?? Sparkles;
              return (
                <li
                  key={r.label}
                  className={`${styles.roleTag} ${styles[`tone-${r.tone}`]}`}
                >
                  <Icon size={12} strokeWidth={2.5} />
                  <span>{r.label}</span>
                </li>
              );
            })}
          </ul>

          <p className={styles.tagline}>{personal.tagline}</p>

          <div className={styles.typed} role="status" aria-live="polite">
            <span className={styles.typedPrefix}>~/melody</span>
            <span className={styles.typedArrow}>❯</span>
            <span className={styles.typedText}>{typed}</span>
            <span className={styles.caret} aria-hidden>
              ▌
            </span>
          </div>

          <div className={styles.actions}>
            <a href="#projects" className={`${styles.btn} ${styles.primary}`}>
              <Sparkles size={15} strokeWidth={2.5} />
              View my quests
            </a>
            <a href="#contact" className={`${styles.btn} ${styles.ghost}`}>
              Say hi ✿
            </a>
          </div>

          {/* === Bento mini cards (now on the LEFT) === */}
          <div className={styles.bentoRow}>
            <div className={`${styles.bento} ${styles.bentoNow}`}>
              <div className={styles.bentoHead}>
                <Music2 size={10} /> NOW PLAYING
              </div>
              <div className={styles.nowMain}>
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`${styles.nowArt} ${isPlaying ? styles.nowArtPlaying : ""}`}
                  aria-label={isPlaying ? "Pause track" : "Play track"}
                  aria-pressed={isPlaying}
                >
                  {isPlaying ? (
                    <Pause size={14} fill="currentColor" strokeWidth={0} />
                  ) : (
                    <Play size={14} fill="currentColor" strokeWidth={0} />
                  )}
                </button>
                <div className={styles.nowText}>
                  <div className={styles.nowTrack}>
                    {hasError ? "Track unavailable" : personal.nowPlaying.track}
                  </div>
                  <div className={styles.nowArtist}>
                    {hasError
                      ? "drop /now-playing.mp3"
                      : personal.nowPlaying.artist}
                  </div>
                </div>
                <div
                  className={`${styles.eq} ${isPlaying ? styles.eqPlaying : ""}`}
                  aria-hidden
                >
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>

            <div className={`${styles.bento} ${styles.bentoBuild}`}>
              <div className={styles.bentoHead}>
                <Hammer size={10} /> CURRENTLY BUILDING
              </div>
              <div className={styles.buildName}>
                {personal.currentlyBuilding.name}
              </div>
              <div className={styles.progressTrack}>
                <span
                  className={styles.progressFill}
                  style={{ width: `${personal.currentlyBuilding.progress}%` }}
                />
              </div>
              <div className={styles.buildMeta}>
                <span className={styles.buildPct}>
                  {personal.currentlyBuilding.progress}%
                </span>
                <span className={styles.buildSep}>·</span>
                <span>{personal.currentlyBuilding.stack}</span>
              </div>
            </div>
          </div>

          {/* Combined status + socials in one slim bar */}
          <div className={styles.metaRow}>
            <div className={styles.metaStatus}>
              <span className={styles.statusItem}>
                <span className={styles.onlineDot} aria-hidden />
                {personal.availability}
              </span>
              <span className={styles.metaSep}>·</span>
              <span className={styles.statusItem}>
                <MapPin size={11} />
                {personal.location}
              </span>
            </div>

            <div className={styles.socials}>
              <a
                href={personal.socials.github}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
              >
                <Github size={15} />
              </a>
              <a
                href={personal.socials.linkedin}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
              >
                <Linkedin size={15} />
              </a>
              <a href={`mailto:${personal.email}`} aria-label="Email">
                <Mail size={15} />
              </a>
            </div>
          </div>
        </div>

        {/* ============== RIGHT: ID card alone ============== */}
        <div className={styles.right}>
          <span className={styles.stage} aria-hidden />

          <article className={styles.idCard}>
            <span className={styles.idHalo} aria-hidden />

            <span className={`${styles.corner} ${styles.tl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.tr}`} aria-hidden />
            <span className={`${styles.corner} ${styles.bl}`} aria-hidden />
            <span className={`${styles.corner} ${styles.br}`} aria-hidden />

            <header className={styles.idHeader}>
              <span className={styles.idLabel}>STUDENT ID · CHAR.001</span>
              <span className={styles.hanko} aria-hidden>
                夢
              </span>
            </header>

            <div className={styles.idBody}>
              <div className={styles.idPhoto}>
                <Image
                  src={personal.avatar}
                  alt={`${personal.name} portrait`}
                  fill
                  sizes="(max-width: 1100px) 240px, 280px"
                  priority
                />
                <span className={styles.photoTag} aria-hidden>
                  PHOTO · 写真
                </span>
                <span className={styles.photoFrame} aria-hidden />
              </div>

              <div className={styles.idKanjiCol} aria-hidden>
                {personal.kanjiChars.map((c) => (
                  <span key={c}>{c}</span>
                ))}
                <span className={styles.idKanjiDivider} />
                <span className={styles.idKanjiKana}>メ</span>
                <span className={styles.idKanjiKana}>ロ</span>
                <span className={styles.idKanjiKana}>デ</span>
                <span className={styles.idKanjiKana}>ィ</span>
              </div>
            </div>

            <footer className={styles.idFooter}>
              <div className={styles.idRow}>
                <span className={styles.idKey}>LV</span>
                <span className={styles.idVal}>
                  <span className={styles.idLv}>∞</span>
                  <span className={styles.idMuted}>· endless learner</span>
                </span>
              </div>
              <div className={styles.idRow}>
                <span className={styles.idKey}>CLASS</span>
                <span className={styles.idVal}>{personal.characterClass}</span>
              </div>
              <div className={styles.idRow}>
                <span className={styles.idKey}>QUEST</span>
                <span className={styles.idVal}>
                  {personal.currentQuest}{" "}
                  <span className={styles.questSparkle}>✦</span>
                </span>
              </div>
            </footer>

            <span className={`${styles.deco} ${styles.deco1}`} aria-hidden>
              ♪
            </span>
            <span className={`${styles.deco} ${styles.deco2}`} aria-hidden>
              ✦
            </span>
            <span className={`${styles.deco} ${styles.deco3}`} aria-hidden>
              ♬
            </span>
          </article>
        </div>
      </div>

      {/* ===== Tech marquee belt ===== */}
      <div className={styles.marquee} aria-hidden>
        <div className={styles.marqueeTrack}>
          <MarqueeRow items={personal.techBelt} />
          <MarqueeRow items={personal.techBelt} />
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({ items }: { items: readonly string[] }) {
  return (
    <div className={styles.marqueeRow}>
      {items.map((t, i) => (
        <span key={`${t}-${i}`} className={styles.marqueeItem}>
          <span className={styles.marqueeDot} aria-hidden>
            ✦
          </span>
          {t}
        </span>
      ))}
    </div>
  );
}
