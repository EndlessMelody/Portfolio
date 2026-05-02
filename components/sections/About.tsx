"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ChevronDown,
  RotateCcw,
  FastForward,
  Play,
  Pause,
  Sparkles,
  Check,
  Compass,
  Terminal,
  Palette,
  Rocket,
  Heart,
  Stars,
  PartyPopper,
  type LucideIcon,
} from "lucide-react";
import { aboutVN, assistant, type DialogueLine } from "@/lib/data";
import styles from "./About.module.scss";

type Phase = "intro" | "menu" | "thread" | "outro" | "complete";

const TYPE_SPEED = 28; // ms per character

const threadIconMap: Record<string, LucideIcon> = {
  compass: Compass,
  terminal: Terminal,
  palette: Palette,
  rocket: Rocket,
};

// Tiny Web Audio synth — typewriter clicks + chime
function useSfx() {
  const ctxRef = useRef<AudioContext | null>(null);
  const enabledRef = useRef(true);

  const ensureCtx = useCallback(() => {
    if (typeof window === "undefined") return null;
    if (!ctxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      try {
        ctxRef.current = new Ctx();
      } catch {
        return null;
      }
    }
    return ctxRef.current;
  }, []);

  const click = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = ensureCtx();
    if (!ctx || ctx.state === "suspended") return;
    try {
      const t = ctx.currentTime;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "square";
      o.frequency.setValueAtTime(2400 + Math.random() * 200, t);
      g.gain.setValueAtTime(0.02, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.05);
    } catch {}
  }, [ensureCtx]);

  const chime = useCallback(() => {
    if (!enabledRef.current) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    try {
      const t = ctx.currentTime;
      [880, 1320].forEach((freq, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = "sine";
        o.frequency.setValueAtTime(freq, t + i * 0.05);
        g.gain.setValueAtTime(0.055, t + i * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, t + i * 0.05 + 0.4);
        o.connect(g).connect(ctx.destination);
        o.start(t + i * 0.05);
        o.stop(t + i * 0.05 + 0.45);
      });
    } catch {}
  }, [ensureCtx]);

  const resume = useCallback(() => {
    const ctx = ensureCtx();
    if (ctx && ctx.state === "suspended") ctx.resume().catch(() => {});
  }, [ensureCtx]);

  const setEnabled = useCallback((v: boolean) => {
    enabledRef.current = v;
  }, []);

  return useMemo(
    () => ({ click, chime, resume, setEnabled }),
    [click, chime, resume, setEnabled],
  );
}

export function About() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [lineIdx, setLineIdx] = useState(0);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [displayed, setDisplayed] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isAuto, setIsAuto] = useState(false);
  const [sfxOn, setSfxOn] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [hoveredChoice, setHoveredChoice] = useState<string | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const sfx = useSfx();

  // Store sfx in a ref so effects don't need it as a dep
  const sfxRef = useRef(sfx);
  sfxRef.current = sfx;

  // Sakura petals (seeded once) drifting inside the stage
  const petals = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        key: i,
        left: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 8 + Math.random() * 6,
        size: 10 + Math.random() * 14,
        sway: 20 + Math.random() * 40,
      })),
    [],
  );

  // Confetti for the Story Complete moment
  const confetti = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        key: i,
        symbol: ["♡", "✦", "♪", "♬", "✿", "★"][i % 6],
        left: Math.random() * 100,
        delay: Math.random() * 0.9,
        duration: 2.2 + Math.random() * 1.8,
        size: 14 + Math.random() * 18,
        rotate: Math.random() * 720 - 360,
        colorIdx: i % 4,
      })),
    [],
  );

  // Load visited threads from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("about-vn-visited-v2");
      if (stored) setVisited(new Set(JSON.parse(stored) as string[]));
    } catch {}
  }, []);

  // Persist visited threads
  useEffect(() => {
    try {
      localStorage.setItem(
        "about-vn-visited-v2",
        JSON.stringify(Array.from(visited)),
      );
    } catch {}
  }, [visited]);

  // Sync sfx on/off (via ref, no re-render triggered)
  useEffect(() => {
    sfxRef.current.setEnabled(sfxOn);
  }, [sfxOn]);

  // Resolve the current line based on phase
  const currentLine: DialogueLine | null = useMemo(() => {
    if (phase === "intro") return aboutVN.intro[lineIdx] ?? null;
    if (phase === "outro") return aboutVN.outro[lineIdx] ?? null;
    if (phase === "thread" && threadId) {
      const thread = aboutVN.threads.find((t) => t.id === threadId);
      return thread?.lines[lineIdx] ?? null;
    }
    if (phase === "menu") return aboutVN.menuPrompt;
    return null;
  }, [phase, lineIdx, threadId]);

  const currentThread = useMemo(
    () =>
      threadId ? aboutVN.threads.find((t) => t.id === threadId) ?? null : null,
    [threadId],
  );

  const totalLinesInPhase = useMemo(() => {
    if (phase === "intro") return aboutVN.intro.length;
    if (phase === "outro") return aboutVN.outro.length;
    if (phase === "thread" && currentThread) return currentThread.lines.length;
    return 0;
  }, [phase, currentThread]);

  const prefersReducedMotion = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  // Typewriter
  useEffect(() => {
    if (!currentLine) {
      setDisplayed("");
      setIsTyping(false);
      return;
    }
    if (prefersReducedMotion) {
      setDisplayed(currentLine.text);
      setIsTyping(false);
      return;
    }
    setDisplayed("");
    setIsTyping(true);
    let i = 0;
    const target = currentLine.text;
    const id = window.setInterval(() => {
      i++;
      setDisplayed(target.slice(0, i));
      if (i % 3 === 0) sfxRef.current.click();
      if (i >= target.length) {
        window.clearInterval(id);
        setIsTyping(false);
      }
    }, TYPE_SPEED);
    return () => window.clearInterval(id);
  }, [currentLine, prefersReducedMotion]);

  const advance = useCallback(() => {
    if (isTyping && currentLine) {
      setDisplayed(currentLine.text);
      setIsTyping(false);
      return;
    }
    if (phase === "intro") {
      if (lineIdx < aboutVN.intro.length - 1) setLineIdx((i) => i + 1);
      else {
        setPhase("menu");
        setLineIdx(0);
      }
      return;
    }
    if (phase === "thread" && currentThread) {
      if (lineIdx < currentThread.lines.length - 1) setLineIdx((i) => i + 1);
      else {
        const next = new Set(visited);
        next.add(currentThread.id);
        setVisited(next);
        sfxRef.current.chime();
        if (next.size >= aboutVN.threads.length) {
          setPhase("outro");
          setLineIdx(0);
        } else {
          setPhase("menu");
          setThreadId(null);
          setLineIdx(0);
        }
      }
      return;
    }
    if (phase === "outro") {
      if (lineIdx < aboutVN.outro.length - 1) setLineIdx((i) => i + 1);
      else {
        setPhase("complete");
        sfxRef.current.chime();
      }
    }
  }, [isTyping, currentLine, phase, lineIdx, currentThread, visited]);

  useEffect(() => {
    if (!isAuto) return;
    if (isTyping) return;
    if (phase === "menu" || phase === "complete") return;
    const t = window.setTimeout(() => advance(), 2400);
    return () => window.clearTimeout(t);
  }, [isAuto, isTyping, phase, lineIdx, threadId, advance]);

  const selectThread = useCallback((id: string) => {
    sfxRef.current.resume();
    sfxRef.current.chime();
    setHoveredChoice(null);
    setThreadId(id);
    setLineIdx(0);
    setPhase("thread");
  }, []);

  // Clear hovered choice whenever we leave menu phase
  useEffect(() => {
    if (phase !== "menu") setHoveredChoice(null);
  }, [phase]);

  const restart = useCallback(() => {
    setVisited(new Set());
    setThreadId(null);
    setLineIdx(0);
    setPhase("intro");
    try {
      localStorage.removeItem("about-vn-visited-v2");
    } catch {}
  }, []);

  const handleStageClick = useCallback(
    (e: React.MouseEvent) => {
      if (!hasInteracted) {
        setHasInteracted(true);
        sfxRef.current.resume();
      }
      const target = e.target as HTMLElement;
      if (target.closest("button") || target.closest("a")) return;
      if (phase === "complete") return;
      if (phase === "menu") {
        if (isTyping && currentLine) {
          setDisplayed(currentLine.text);
          setIsTyping(false);
        }
        return;
      }
      advance();
    },
    [advance, phase, hasInteracted, isTyping, currentLine],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.7 && rect.bottom > 200;
      if (!inView) return;
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === " " || e.key === "Enter") {
        if (phase !== "complete") {
          e.preventDefault();
          if (!hasInteracted) setHasInteracted(true);
          if (phase === "menu") {
            if (isTyping && currentLine) {
              setDisplayed(currentLine.text);
              setIsTyping(false);
            }
            return;
          }
          advance();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [advance, phase, hasInteracted, isTyping, currentLine]);

  const allVisited = visited.size >= aboutVN.threads.length;
  const currentEmote = currentLine?.emote ?? "neutral";

  // Preview text when hovering a choice in menu phase
  const previewText =
    phase === "menu" && hoveredChoice
      ? aboutVN.threads.find((t) => t.id === hoveredChoice)?.preview ?? ""
      : null;

  return (
    <section id="about" className={styles.about} ref={sectionRef}>
      {/* Ambient backdrops */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />

      {/* Kanji spine (left) */}
      <div className={styles.kanjiSpine} aria-hidden>
        <span>物</span>
        <span>語</span>
        <span>編</span>
      </div>

      {/* Magazine issue tag (right) */}
      <div className={styles.issueTag} aria-hidden>
        ISSUE 02 · 物語編 · 2026
      </div>

      <div className="container">
        <header className={styles.header}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.02</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              The Story <span className={styles.chapterKana}>物語</span>
            </span>
          </div>

          <h2 className={styles.title}>
            About <span className={styles.titleAccent}>Melody</span>
            <span className={styles.titlePeriod}>.</span>
          </h2>

          <p className={styles.subtitle}>
            Let <strong>Selena</strong> introduce you — tap or press{" "}
            <kbd>Space</kbd> to advance the dialogue ✦
          </p>
        </header>

        <div className={styles.stageWrap}>
          <span className={`${styles.stageDeco} ${styles.stageDeco1}`} aria-hidden>
            ♡
          </span>
          <span className={`${styles.stageDeco} ${styles.stageDeco2}`} aria-hidden>
            ✦
          </span>
          <span className={`${styles.stageDeco} ${styles.stageDeco3}`} aria-hidden>
            ♪
          </span>
          <span className={`${styles.stageDeco} ${styles.stageDeco4}`} aria-hidden>
            ♬
          </span>

          <div
            className={styles.stage}
            onClick={handleStageClick}
            role="button"
            tabIndex={0}
            aria-label="Visual novel dialogue — click to advance"
          >
            {/* Background image */}
            <div className={styles.bgLayer} aria-hidden>
              <Image
                src={assistant.background}
                alt=""
                fill
                priority
                sizes="(max-width: 1100px) 100vw, 1100px"
                className={styles.bgImg}
                unoptimized
              />
              <div className={styles.bgOverlay} />
              <div className={styles.bgVignette} />
            </div>

            {/* Sakura petals drifting inside the stage */}
            <div className={styles.petalLayer} aria-hidden>
              {petals.map((p) => (
                <span
                  key={p.key}
                  className={styles.petal}
                  style={
                    {
                      left: `${p.left}%`,
                      animationDelay: `${p.delay}s`,
                      animationDuration: `${p.duration}s`,
                      fontSize: `${p.size}px`,
                      "--sway": `${p.sway}px`,
                    } as React.CSSProperties
                  }
                >
                  ❀
                </span>
              ))}
            </div>

            {/* Manga panel corners */}
            <span
              className={`${styles.mangaCorner} ${styles.cornerTl}`}
              aria-hidden
            />
            <span
              className={`${styles.mangaCorner} ${styles.cornerTr}`}
              aria-hidden
            />
            <span
              className={`${styles.mangaCorner} ${styles.cornerBl}`}
              aria-hidden
            />
            <span
              className={`${styles.mangaCorner} ${styles.cornerBr}`}
              aria-hidden
            />

            {/* Top controls */}
            <div className={styles.controls}>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsAuto((v) => !v);
                }}
                data-active={isAuto || undefined}
                title={isAuto ? "Auto: ON" : "Auto: OFF"}
              >
                {isAuto ? <Pause size={12} /> : <Play size={12} />}
                <span>AUTO</span>
              </button>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isTyping && currentLine) {
                    setDisplayed(currentLine.text);
                    setIsTyping(false);
                  } else if (phase !== "menu") {
                    advance();
                  }
                }}
                title="Skip / fast-forward"
              >
                <FastForward size={12} />
                <span>SKIP</span>
              </button>
              <button
                type="button"
                className={styles.ctrlBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  setSfxOn((v) => !v);
                }}
                data-active={sfxOn || undefined}
                title={sfxOn ? "SFX: ON" : "SFX: OFF"}
              >
                <Sparkles size={12} />
                <span>SFX</span>
              </button>
            </div>

            {/* Story Complete overlay with confetti rain */}
            {phase === "complete" && (
              <div
                className={styles.completeOverlay}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.confettiLayer} aria-hidden>
                  {confetti.map((c) => (
                    <span
                      key={c.key}
                      className={`${styles.confettiPiece} ${styles[`confettiColor${c.colorIdx}`]}`}
                      style={
                        {
                          left: `${c.left}%`,
                          animationDelay: `${c.delay}s`,
                          animationDuration: `${c.duration}s`,
                          fontSize: `${c.size}px`,
                          "--spin": `${c.rotate}deg`,
                        } as React.CSSProperties
                      }
                    >
                      {c.symbol}
                    </span>
                  ))}
                </div>

                <div className={styles.completeCard}>
                  <div className={styles.completeIcons} aria-hidden>
                    <Stars size={18} className={styles.completeIconStar} />
                    <Heart size={22} className={styles.completeIconHeart} />
                    <PartyPopper
                      size={18}
                      className={styles.completeIconParty}
                    />
                  </div>
                  <div className={styles.completeTitle}>Story Complete ♡</div>
                  <div className={styles.completeSub}>
                    You learned everything about Melody
                  </div>
                  <div className={styles.completeStats}>
                    <span className={styles.completeStat}>
                      <Check size={12} /> {aboutVN.threads.length} topics
                    </span>
                    <span className={styles.completeDot}>·</span>
                    <span className={styles.completeStat}>
                      <Sparkles size={12} /> 1 happy assistant
                    </span>
                  </div>
                  <button
                    type="button"
                    className={styles.replayBtn}
                    onClick={restart}
                  >
                    <RotateCcw size={14} />
                    Replay the story
                  </button>
                </div>
              </div>
            )}

            {/* Bottom bar: portrait + content */}
            {phase !== "complete" && (
              <div className={styles.bottomBar}>
                <div className={styles.portraitWrap} aria-hidden>
                  <div
                    className={`${styles.portrait} ${styles[`emote-${currentEmote}`]}`}
                  >
                    <div className={styles.portraitImg}>
                      <Image
                        src={assistant.avatar}
                        alt={`${assistant.name} — ${assistant.title}`}
                        fill
                        sizes="(max-width: 760px) 120px, 200px"
                        priority
                      />
                    </div>
                    <span className={styles.portraitGlow} />
                    <span className={styles.emoteBubble}>
                      {emoteIcon(currentEmote)}
                    </span>
                  </div>
                </div>

                <div className={styles.bottomContent}>
                  {phase === "menu" && (
                    <div
                      className={styles.choicesAbove}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.choicesHeader}>
                        <span className={styles.choicesCount}>
                          <Sparkles size={10} /> {visited.size}/
                          {aboutVN.threads.length} explored
                        </span>
                      </div>
                      <div className={styles.choiceGrid}>
                        {aboutVN.threads.map((t) => {
                          const done = visited.has(t.id);
                          const Icon = threadIconMap[t.icon] ?? Sparkles;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              className={styles.choice}
                              data-visited={done || undefined}
                              onClick={() => selectThread(t.id)}
                              onMouseEnter={() => setHoveredChoice(t.id)}
                              onMouseLeave={() => setHoveredChoice(null)}
                              onFocus={() => setHoveredChoice(t.id)}
                              onBlur={() => setHoveredChoice(null)}
                            >
                              <span className={styles.choiceIcon} aria-hidden>
                                <Icon size={18} strokeWidth={2} />
                              </span>
                              <span className={styles.choiceBody}>
                                <span className={styles.choiceLabel}>
                                  {t.label}
                                </span>
                                <span className={styles.choiceHint}>
                                  {t.hint}
                                </span>
                              </span>
                              {done && (
                                <span
                                  className={styles.choiceCheck}
                                  aria-hidden
                                >
                                  <Check size={11} strokeWidth={3} />
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      {allVisited && (
                        <p className={styles.allDoneHint}>
                          ✦ all topics explored — tap any to revisit ✦
                        </p>
                      )}
                    </div>
                  )}

                  {currentLine && (
                    <div className={styles.dialogue}>
                      <div className={styles.namePlate}>
                        <span className={styles.nameSparkle}>✦</span>
                        <span className={styles.nameMain}>
                          {assistant.name}
                        </span>
                        <span className={styles.nameKana}>
                          {assistant.kana}
                        </span>
                        <span className={styles.nameDivider} />
                        <span className={styles.nameTitle}>
                          {assistant.title}
                        </span>
                      </div>

                      <div
                        className={`${styles.dialogueBox} ${previewText ? styles.dialogueBoxPreview : ""}`}
                      >
                        <p className={styles.dialogueText}>
                          {previewText
                            ? renderRichText(previewText)
                            : renderRichText(displayed)}
                          {isTyping && !previewText && (
                            <span className={styles.cursor} aria-hidden />
                          )}
                        </p>

                        {totalLinesInPhase > 0 && (
                          <div className={styles.progressDots} aria-hidden>
                            {Array.from({ length: totalLinesInPhase }).map(
                              (_, i) => (
                                <span
                                  key={i}
                                  className={`${styles.progressDot} ${i <= lineIdx ? styles.progressDotActive : ""}`}
                                />
                              ),
                            )}
                          </div>
                        )}

                        {!isTyping && phase !== "menu" && (
                          <span className={styles.nextChevron} aria-hidden>
                            <ChevronDown size={15} strokeWidth={2.5} />
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!hasInteracted && phase === "intro" && lineIdx === 0 && (
              <div className={styles.tapHint} aria-hidden>
                ✦ tap anywhere to advance ✦
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function renderRichText(text: string) {
  const parts = text.split(/(\*[^*]+\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
      return (
        <em key={i} className={styles.emphasis}>
          {part.slice(1, -1)}
        </em>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

function emoteIcon(emote: string) {
  switch (emote) {
    case "smile":
      return "♡";
    case "think":
      return "…";
    case "excited":
      return "✦";
    case "wink":
      return ";)";
    case "shy":
      return "♪";
    default:
      return "~";
  }
}
