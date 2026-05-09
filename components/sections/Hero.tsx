"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
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
import { useTimeGreeting } from "@/lib/hooks";
import { GitHubLive } from "@/components/ui/GitHubLive";
import { WeatherHost } from "@/components/ui/WeatherHost";
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
  const { isPlaying, togglePlay, hasError, duration, currentTime, seek } =
    useAudioPlayer();
  const greeting = useTimeGreeting();

  const formatTime = (s: number) => {
    if (!Number.isFinite(s) || s < 0) return "0:00";
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const progressPct = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    const track = e.currentTarget;
    const rect = track.getBoundingClientRect();
    const ratio = Math.max(
      0,
      Math.min(1, (e.clientX - rect.left) / rect.width),
    );
    seek(ratio * duration);
  };

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
      <div className={styles.kanjiSpine} aria-hidden data-parallax="0.18">
        {personal.kanjiChars.map((c, i) => (
          <span key={i}>{c}</span>
        ))}
      </div>

      {/* Magazine spine — far right with parallax (slower) */}
      <div className={styles.issueTag} aria-hidden data-parallax="0.1">
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
            <p
              className={styles.greeting}
              data-time={greeting.time}
              aria-live="polite"
            >
              <span className={styles.greetIcon} aria-hidden>
                {greeting.icon}
              </span>
              <span className={styles.greetText}>{greeting.text}</span>
              <span className={styles.greetKana} aria-hidden>
                ({greeting.kana})
              </span>
            </p>

            <div className={styles.kanaLine} aria-hidden>
              <span className={styles.kanaSmall}>{personal.kana}</span>
            </div>

            <h1 className={styles.title}>
              <span className={styles.gradientText}>{personal.name}</span>
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

          <GitHubLive
            username={
              personal.socials.github.replace(/\/$/, "").split("/").pop() ??
              "EndlessMelody"
            }
          />

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
              <span className={styles.btnIcon} aria-hidden>
                <Sparkles size={16} strokeWidth={2.5} />
              </span>
              <span className={styles.btnBody}>
                <span className={styles.btnLabel}>View my quests</span>
                <span className={styles.btnHint}>→ projects</span>
              </span>
            </a>
            <a href="#contact" className={`${styles.btn} ${styles.ghost}`}>
              <span className={styles.btnIcon} aria-hidden>
                <Mail size={16} strokeWidth={2.5} />
              </span>
              <span className={styles.btnBody}>
                <span className={styles.btnLabel}>Say hi ✿</span>
                <span className={styles.btnHint}>→ contact</span>
              </span>
            </a>
            <WeatherHost
              lat={personal.coords.lat}
              lon={personal.coords.lon}
              timezone={personal.coords.timezone}
            />
          </div>

          {/* === Bento mini cards (now on the LEFT) === */}
          <div className={styles.bentoRow}>
            <div className={`${styles.bento} ${styles.bentoNow}`}>
              <div className={styles.bentoHead}>
                <Music2 size={10} /> NOW PLAYING
                {isPlaying && (
                  <span className={styles.nowLive} aria-hidden>
                    <span className={styles.nowLiveDot} />
                    <span className={styles.nowLiveText}>ON AIR</span>
                  </span>
                )}
              </div>

              <div className={styles.nowMain}>
                {/* Rotating album art / disc */}
                <button
                  type="button"
                  onClick={togglePlay}
                  className={`${styles.nowDisc} ${isPlaying ? styles.nowDiscPlaying : ""}`}
                  aria-label={isPlaying ? "Pause track" : "Play track"}
                  aria-pressed={isPlaying}
                  title={isPlaying ? "Pause" : "Play"}
                >
                  {personal.nowPlaying.cover ? (
                    <img
                      src={personal.nowPlaying.cover}
                      alt=""
                      className={styles.nowDiscCover}
                      aria-hidden
                    />
                  ) : (
                    <span className={styles.nowDiscKanji} aria-hidden>
                      {personal.nowPlaying.kanji}
                    </span>
                  )}
                  <span className={styles.nowDiscGrooves} aria-hidden />
                  <span className={styles.nowDiscCenter} aria-hidden>
                    {isPlaying ? (
                      <Pause size={11} fill="currentColor" strokeWidth={0} />
                    ) : (
                      <Play size={11} fill="currentColor" strokeWidth={0} />
                    )}
                  </span>
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

              {/* Progress strip: real elapsed/total time with click-to-seek.
                  Replaces the previous dashed border so the card keeps
                  the exact same height as before. */}
              {!hasError && (
                <div className={styles.nowProgress}>
                  <span className={styles.nowTime}>
                    {formatTime(currentTime)}
                  </span>
                  <div
                    className={styles.nowBar}
                    role="slider"
                    aria-label="Seek"
                    aria-valuemin={0}
                    aria-valuemax={Math.max(1, Math.round(duration))}
                    aria-valuenow={Math.round(currentTime)}
                    tabIndex={0}
                    onClick={handleSeek}
                    onKeyDown={(e) => {
                      if (e.key === "ArrowLeft") seek(currentTime - 5);
                      else if (e.key === "ArrowRight") seek(currentTime + 5);
                    }}
                  >
                    <span
                      className={styles.nowBarFill}
                      style={{ width: `${progressPct}%` }}
                    />
                    <span
                      className={styles.nowBarThumb}
                      style={{ left: `${progressPct}%` }}
                      aria-hidden
                    />
                  </div>
                  <span className={styles.nowTime}>
                    {duration > 0 ? formatTime(duration) : "--:--"}
                  </span>
                </div>
              )}

              {/* Lyric ticker — scrolls when playing, static when paused.
                  Lines are just vibe placeholders; edit `nowPlaying.lyrics`
                  in `lib/data.ts` to customise. */}
              {!hasError && personal.nowPlaying.lyrics?.length > 0 && (
                <div
                  className={`${styles.lyricTicker} ${isPlaying ? styles.lyricPlaying : ""}`}
                  aria-hidden
                >
                  <span className={styles.lyricNote}>♪</span>
                  <div className={styles.lyricTrack}>
                    <div className={styles.lyricStrip}>
                      {personal.nowPlaying.lyrics.map((line, i) => (
                        <span key={`a-${i}`} className={styles.lyricLine}>
                          {line}
                        </span>
                      ))}
                      {/* Duplicate for seamless marquee */}
                      {personal.nowPlaying.lyrics.map((line, i) => (
                        <span key={`b-${i}`} className={styles.lyricLine}>
                          {line}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className={`${styles.bento} ${styles.bentoBuild}`}>
              <div className={styles.bentoHead}>
                <Hammer size={10} /> CURRENTLY BUILDING
                <span className={styles.livePulse} aria-hidden>
                  <span className={styles.livePulseDot} />
                  <span className={styles.livePulseText}>LIVE</span>
                </span>
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
              <div className={styles.commitStrip} aria-hidden>
                {Array.from({ length: 14 }).map((_, i) => (
                  <span
                    key={i}
                    className={styles.commitBar}
                    style={{
                      height: `${30 + ((i * 37) % 70)}%`,
                      animationDelay: `${i * 0.08}s`,
                    }}
                  />
                ))}
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
        <span className={styles.marqueeHairline} data-top aria-hidden />
        <span className={styles.marqueeHairline} data-bottom aria-hidden />
        <span className={styles.marqueeShimmer} aria-hidden />
        <div className={styles.marqueeTrack}>
          <MarqueeRow />
          <MarqueeRow />
        </div>
      </div>
    </section>
  );
}

type BeltToken =
  | { kind: "tech"; label: string; tone: "ml" | "web" | "infra" }
  | {
      kind: "kanji";
      kanji: string;
      label: string;
      tone: "ml" | "web" | "infra";
    };

const ML_SET = new Set<string>([
  "Python",
  "PyTorch",
  "CUDA",
  "Diffusers",
  "Transformers",
  "LangChain",
  "Vector DB",
]);
const INFRA_SET = new Set<string>(["FastAPI", "Docker", "MLOps"]);

function toneOf(name: string): "ml" | "web" | "infra" {
  if (ML_SET.has(name)) return "ml";
  if (INFRA_SET.has(name)) return "infra";
  return "web";
}

function buildBelt(): BeltToken[] {
  const buckets: Record<"ml" | "web" | "infra", string[]> = {
    ml: [],
    web: [],
    infra: [],
  };
  for (const t of personal.techBelt) buckets[toneOf(t)].push(t);

  const heads: Record<
    "ml" | "web" | "infra",
    { kanji: string; label: string }
  > = {
    ml: { kanji: "学", label: "Machine Learning" },
    web: { kanji: "技", label: "Web Craft" },
    infra: { kanji: "築", label: "Infra" },
  };

  const out: BeltToken[] = [];
  (["ml", "web", "infra"] as const).forEach((key) => {
    if (!buckets[key].length) return;
    out.push({
      kind: "kanji",
      kanji: heads[key].kanji,
      label: heads[key].label,
      tone: key,
    });
    for (const label of buckets[key])
      out.push({ kind: "tech", label, tone: key });
  });
  return out;
}

const BELT_TOKENS: BeltToken[] = buildBelt();

function MarqueeRow() {
  return (
    <div className={styles.marqueeRow}>
      {BELT_TOKENS.map((t, i) =>
        t.kind === "kanji" ? (
          <span
            key={`k-${i}`}
            className={`${styles.marqueeKanji} ${styles[`tone-${t.tone}`] ?? ""}`}
          >
            <span className={styles.marqueeKanjiGlyph}>{t.kanji}</span>
            <span className={styles.marqueeKanjiLabel}>{t.label}</span>
          </span>
        ) : (
          <span
            key={`t-${i}`}
            className={`${styles.marqueeItem} ${styles[`tone-${t.tone}`] ?? ""}`}
            style={{ ["--dot-delay" as string]: `${(i * 0.35) % 3}s` }}
          >
            <span className={styles.marqueeDot} aria-hidden>
              ✦
            </span>
            <span className={styles.marqueeLabel}>{t.label}</span>
          </span>
        ),
      )}
    </div>
  );
}
