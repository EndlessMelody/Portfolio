"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import {
  skillCategories,
  layoutRadialTree,
  type SkillCategory,
  type PositionedNode,
} from "@/lib/skills-data";
import styles from "./Skills.module.scss";
import { AnimeOrnaments } from "./AnimeOrnaments";

type Phase = { kind: "circle" } | { kind: "tree"; categoryId: string };

// =====================================================
// Main Skills Section
// =====================================================
export function Skills() {
  const [phase, setPhase] = useState<Phase>({ kind: "circle" });
  const [hoveredCat, setHoveredCat] = useState<string | null>(null);

  const activeCategory =
    phase.kind === "tree"
      ? skillCategories.find((c) => c.id === phase.categoryId) ?? null
      : null;

  return (
    <section id="skills" className={styles.skills}>
      {/* Ambient backdrops (match About/Hero) */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />
      <AnimeOrnaments />
      <div className={styles.kanjiSpine} aria-hidden>
        <span>技</span>
        <span>能</span>
        <span>樹</span>
      </div>

      {/* Issue tag (right) */}
      <div className={styles.issueTag} aria-hidden>
        ISSUE 03 · 技能樹 · 2026
      </div>

      <div className="container">
        <header className={styles.header}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.03</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              Skill Tree <span className={styles.chapterKana}>技能樹</span>
            </span>
          </div>

          <h2 className={styles.title}>
            Skill <span className={styles.titleAccent}>Tree</span>
          </h2>

          <p className={styles.subtitle}>
            Choose a class to reveal the tree — hover to inspect, click to
            enter ✦
          </p>
        </header>

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

        <div className={styles.stage}>
          <AnimatePresence mode="wait">
            {phase.kind === "circle" && (
              <motion.div
                key="circle"
                className={styles.stageMotion}
                initial={{ opacity: 0, scale: 0.7, rotate: -20 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.6, rotate: 15, filter: "blur(6px)" }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <MagicCircle
                  hovered={hoveredCat}
                  onHover={setHoveredCat}
                  onSelect={(id) => {
                    setHoveredCat(null);
                    setPhase({ kind: "tree", categoryId: id });
                  }}
                />
              </motion.div>
            )}

            {phase.kind === "tree" && activeCategory && (
              <motion.div
                key={`tree-${phase.categoryId}`}
                className={styles.stageMotion}
                initial={{ opacity: 0, scale: 0.88, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -15, filter: "blur(4px)" }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <SkillTree
                  category={activeCategory}
                  onBack={() => setPhase({ kind: "circle" })}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

// =====================================================
// Magic Circle (pentagon with 5 category gems)
// =====================================================
const CIRCLE_SIZE = 620;
const CIRCLE_CENTER = CIRCLE_SIZE / 2;
const CIRCLE_RADIUS = 240;

function polar(angleDeg: number, r: number) {
  // 0° = top, CW
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CIRCLE_CENTER + r * Math.cos(rad),
    y: CIRCLE_CENTER + r * Math.sin(rad),
  };
}

function MagicCircle({
  hovered,
  onHover,
  onSelect,
}: {
  hovered: string | null;
  onHover: (id: string | null) => void;
  onSelect: (id: string) => void;
}) {
  // Decorative runes on outer ring
  const outerRunes = ["✦", "♡", "✧", "✩", "❁", "✶", "✳", "❂"];
  const outerCount = 24;
  // Decorative kanji on middle ring
  const middleKanji = "技能樹夢音美創造発明探究知識力技";
  const middleCount = 16;

  const hoveredCat = hovered
    ? skillCategories.find((c) => c.id === hovered) ?? null
    : null;

  return (
    <div className={styles.circleWrap}>
      <svg
        viewBox={`0 0 ${CIRCLE_SIZE} ${CIRCLE_SIZE}`}
        className={styles.circleSvg}
        aria-hidden
      >
        <defs>
          {skillCategories.map((c) => (
            <radialGradient key={c.id} id={`grad-${c.id}`}>
              <stop offset="0%" stopColor={c.color} stopOpacity="0.85" />
              <stop offset="100%" stopColor={c.color} stopOpacity="0" />
            </radialGradient>
          ))}
          <radialGradient id="core-grad">
            <stop offset="0%" stopColor="#FFF" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#F47AA0" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#5A96EE" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer soft glow */}
        <circle
          cx={CIRCLE_CENTER}
          cy={CIRCLE_CENTER}
          r={CIRCLE_RADIUS + 40}
          className={styles.ringGlow}
        />

        {/* Outer rotating ring with runes (CCW) */}
        <g className={styles.ringOuter}>
          <circle
            cx={CIRCLE_CENTER}
            cy={CIRCLE_CENTER}
            r={CIRCLE_RADIUS + 12}
            className={styles.ringStroke}
          />
          <circle
            cx={CIRCLE_CENTER}
            cy={CIRCLE_CENTER}
            r={CIRCLE_RADIUS - 4}
            className={styles.ringStrokeThin}
          />
          {Array.from({ length: outerCount }).map((_, i) => {
            const angle = (i / outerCount) * 360;
            const p = polar(angle, CIRCLE_RADIUS + 4);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                className={styles.runeText}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {outerRunes[i % outerRunes.length]}
              </text>
            );
          })}
        </g>

        {/* Middle ring with kanji (CW) */}
        <g className={styles.ringMiddle}>
          <circle
            cx={CIRCLE_CENTER}
            cy={CIRCLE_CENTER}
            r={CIRCLE_RADIUS - 55}
            className={styles.ringStrokeDashed}
          />
          {Array.from({ length: middleCount }).map((_, i) => {
            const angle = (i / middleCount) * 360;
            const p = polar(angle, CIRCLE_RADIUS - 55);
            return (
              <text
                key={i}
                x={p.x}
                y={p.y}
                className={styles.kanjiRune}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {middleKanji[i % middleKanji.length]}
              </text>
            );
          })}
        </g>

        {/* Pentagon connecting the 5 category vertices */}
        <polygon
          points={skillCategories
            .map((c) => {
              const p = polar(c.angle, CIRCLE_RADIUS);
              return `${p.x},${p.y}`;
            })
            .join(" ")}
          className={styles.pentagon}
        />

        {/* Lines from center to each vertex */}
        {skillCategories.map((c) => {
          const p = polar(c.angle, CIRCLE_RADIUS);
          return (
            <line
              key={c.id}
              x1={CIRCLE_CENTER}
              y1={CIRCLE_CENTER}
              x2={p.x}
              y2={p.y}
              className={styles.spoke}
              style={{ color: c.color }}
            />
          );
        })}

        {/* Inner small rotating ring (CCW fast) */}
        <g className={styles.ringInner}>
          <circle
            cx={CIRCLE_CENTER}
            cy={CIRCLE_CENTER}
            r={82}
            className={styles.ringStrokeThin}
          />
          <circle
            cx={CIRCLE_CENTER}
            cy={CIRCLE_CENTER}
            r={60}
            className={styles.ringStrokeDashed}
          />
        </g>

        {/* Center core glow */}
        <circle
          cx={CIRCLE_CENTER}
          cy={CIRCLE_CENTER}
          r={80}
          fill="url(#core-grad)"
          className={styles.coreGlow}
        />
        <circle
          cx={CIRCLE_CENTER}
          cy={CIRCLE_CENTER}
          r={40}
          className={styles.centerCore}
        />
        <text
          x={CIRCLE_CENTER}
          y={CIRCLE_CENTER + 2}
          className={styles.centerKanji}
          textAnchor="middle"
          dominantBaseline="middle"
        >
          梦
        </text>
      </svg>

      {/* HTML overlay — category gem buttons */}
      <div className={styles.categoryNodes}>
        {skillCategories.map((c, i) => {
          const p = polar(c.angle, CIRCLE_RADIUS);
          const leftPct = (p.x / CIRCLE_SIZE) * 100;
          const topPct = (p.y / CIRCLE_SIZE) * 100;
          const isHovered = hovered === c.id;
          const Icon = c.icon;
          return (
            <button
              key={c.id}
              type="button"
              className={styles.categoryNode}
              data-hovered={isHovered || undefined}
              style={
                {
                  left: `${leftPct}%`,
                  top: `${topPct}%`,
                  "--cat-color": c.color,
                  "--cat-soft": c.colorSoft,
                  animationDelay: `${0.3 + i * 0.12}s`,
                } as React.CSSProperties
              }
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => onHover(c.id)}
              onMouseLeave={() => onHover(null)}
              onFocus={() => onHover(c.id)}
              onBlur={() => onHover(null)}
              aria-label={`Enter ${c.label} skill tree`}
            >
              <span className={styles.categoryGem} aria-hidden>
                <Icon size={24} strokeWidth={2} />
              </span>
              <span className={styles.categoryMeta}>
                <span className={styles.categoryLabel}>{c.label}</span>
                <span className={styles.categoryKanji}>{c.kanji}</span>
              </span>
              <span className={styles.categorySigil} aria-hidden>
                {c.sigil}
              </span>
            </button>
          );
        })}
      </div>

      {/* Tooltip */}
      <div
        className={styles.hoverTooltip}
        data-show={hoveredCat ? true : undefined}
        style={
          hoveredCat
            ? ({ "--cat-color": hoveredCat.color } as React.CSSProperties)
            : undefined
        }
      >
        {hoveredCat && (
          <>
            <span className={styles.tipKana}>{hoveredCat.kanji}</span>
            <strong className={styles.tipLabel}>{hoveredCat.label}</strong>
            <span className={styles.tipEng}>{hoveredCat.english}</span>
            <span className={styles.tipTagline}>{hoveredCat.tagline}</span>
          </>
        )}
      </div>

      {/* Floating orbiting sparkles */}
      <div className={styles.orbitSparkles} aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <span
            key={i}
            className={styles.orbitSparkle}
            style={{ animationDelay: `${i * 1.2}s` }}
          >
            ✦
          </span>
        ))}
      </div>
    </div>
  );
}

// =====================================================
// Skill Tree (radial, for a selected category)
// =====================================================
function SkillTree({
  category,
  onBack,
}: {
  category: SkillCategory;
  onBack: () => void;
}) {
  const layout = useMemo(() => layoutRadialTree(category.root), [category]);

  // Bounding box
  const padding = 90;
  const minX = Math.min(...layout.nodes.map((n) => n.x)) - padding;
  const maxX = Math.max(...layout.nodes.map((n) => n.x)) + padding;
  const minY = Math.min(...layout.nodes.map((n) => n.y)) - padding;
  const maxY = Math.max(...layout.nodes.map((n) => n.y)) + padding;
  const vbWidth = maxX - minX;
  const vbHeight = maxY - minY;

  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <div
      className={styles.treeWrap}
      style={
        {
          "--cat-color": category.color,
          "--cat-soft": category.colorSoft,
        } as React.CSSProperties
      }
    >
      <div className={styles.treeTopBar}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          <ArrowLeft size={14} strokeWidth={2.5} />
          <span>Back to circle</span>
        </button>

        <div className={styles.treeTitle}>
          <span className={styles.treeSigil} aria-hidden>
            {category.sigil}
          </span>
          <h3 className={styles.treeHeading}>
            {category.label}
            <span className={styles.treeKana}>{category.kanji}</span>
          </h3>
          <p className={styles.treeTagline}>{category.tagline}</p>
        </div>
      </div>

      <div className={styles.tree}>
        <svg
          viewBox="0 0 100 100"
          className={styles.treeSvg}
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <radialGradient id={`tree-bg-${category.id}`}>
              <stop
                offset="0%"
                stopColor={category.color}
                stopOpacity="0.28"
              />
              <stop offset="60%" stopColor={category.color} stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Soft radial background (root is at 0,0 in layout space) */}
          <circle 
            cx={((0 - minX) / vbWidth) * 100} 
            cy={((0 - minY) / vbHeight) * 100} 
            r={50} 
            fill={`url(#tree-bg-${category.id})`} 
          />

          {/* Edges (connection curves) */}
          {layout.edges.map((e) => {
            const startX = ((e.from.x - minX) / vbWidth) * 100;
            const startY = ((e.from.y - minY) / vbHeight) * 100;
            const endX = ((e.to.x - minX) / vbWidth) * 100;
            const endY = ((e.to.y - minY) / vbHeight) * 100;

            const mx = (startX + endX) / 2;
            const my = (startY + endY) / 2;
            const d = `M ${startX} ${startY} Q ${mx} ${my} ${endX} ${endY}`;
            
            const isActive =
              hoveredId === e.parentId || hoveredId === e.childId;
            return (
              <path
                key={`${e.parentId}-${e.childId}`}
                d={d}
                className={styles.edge}
                data-active={isActive || undefined}
                style={
                  {
                    animationDelay: `${0.35 + e.depth * 0.22}s`,
                  } as React.CSSProperties
                }
              />
            );
          })}
        </svg>

        {/* HTML nodes overlay */}
        {layout.nodes.map((n) => (
          <SkillNode
            key={n.skill.id}
            node={n}
            bbox={{ minX, minY, width: vbWidth, height: vbHeight }}
            isHovered={hoveredId === n.skill.id}
            onHover={setHoveredId}
          />
        ))}
      </div>
    </div>
  );
}

// =====================================================
// Individual skill node (HTML, positioned by %)
// =====================================================
function SkillNode({
  node,
  bbox,
  isHovered,
  onHover,
}: {
  node: PositionedNode;
  bbox: { minX: number; minY: number; width: number; height: number };
  isHovered: boolean;
  onHover: (id: string | null) => void;
}) {
  const Icon = node.skill.icon;
  const leftPct = ((node.x - bbox.minX) / bbox.width) * 100;
  const topPct = ((node.y - bbox.minY) / bbox.height) * 100;

  const mastery = node.skill.mastery;
  const masteryTitle = [
    "Novice",
    "Apprentice",
    "Journeyman",
    "Expert",
    "Master",
  ][mastery - 1];

  return (
    <div
      className={styles.skillNode}
      data-depth={node.depth}
      data-hovered={isHovered || undefined}
      data-mastery={mastery}
      style={
        {
          left: `${leftPct}%`,
          top: `${topPct}%`,
          "--skill-color": node.skill.color,
          animationDelay: `${0.25 + node.depth * 0.22}s`,
        } as React.CSSProperties
      }
      onMouseEnter={() => onHover(node.skill.id)}
      onMouseLeave={() => onHover(null)}
    >
      <div className={styles.iconContainer} aria-label={`Mastery: ${mastery}/5`}>
        <div className={styles.skillIconRing} aria-hidden />
        <div className={styles.skillIconWrap}>
          <Icon
            size={node.depth === 0 ? 32 : node.depth === 1 ? 26 : 22}
            aria-hidden
          />
        </div>
        <svg viewBox="0 0 100 100" className={styles.xpRingSvg} aria-hidden>
          <circle cx="50" cy="50" r="46" className={styles.xpRingTrack} />
          <circle
            cx="50"
            cy="50"
            r="46"
            className={styles.xpRingFill}
            style={{
              strokeDasharray: 289,
              strokeDashoffset: 289 - (mastery / 5) * 289,
            }}
          />
        </svg>
      </div>
      <div className={styles.skillLabel}>{node.skill.name}</div>
      <div className={styles.skillTitle}>{masteryTitle}</div>
    </div>
  );
}
