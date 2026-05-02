"use client";

import { useState } from "react";
import { projects, type Project } from "@/lib/data";
import { ChevronLeft, ChevronRight, ExternalLink, Github } from "lucide-react";
import styles from "./Projects.module.scss";
import { AnimeOrnaments } from "./AnimeOrnaments";

const SparkleIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden>
    <path d="M10 0C10 5 15 10 20 10C15 10 10 15 10 20C10 15 5 10 0 10C5 10 10 5 10 0Z" fill="currentColor" />
  </svg>
);

const MagicCircle = () => (
  <svg className={styles.magicCircleSvg} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 8" />
    <circle cx="100" cy="100" r="78" fill="none" stroke="currentColor" strokeWidth="1" />
    <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.5" />
    <path d="M 100 22 L 168 138 L 32 138 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M 100 178 L 168 62 L 32 62 Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="100" cy="100" r="35" fill="none" stroke="currentColor" strokeWidth="1.5" strokeDasharray="2 4" />
    <circle cx="100" cy="100" r="15" fill="currentColor" opacity="0.5" />
    <circle cx="100" cy="100" r="5" fill="currentColor" />
  </svg>
);

export function Projects() {
  const [currentPage, setCurrentPage] = useState(0); // 0 to 4
  const featuredProjects = projects.slice(0, 3); // Limit to 3 projects
  
  // 0: Closed Front Cover
  // 1: Project 0 Spread
  // 2: Project 1 Spread
  // 3: Project 2 Spread
  // 4: Closed Back Cover

  const leaves = [
    {
      front: (
        <div className={styles.outerCover}>
          <div className={styles.spineTexture} />
          <div className={styles.coverCorners}>
            <span className={styles.cTl}>◥</span>
            <span className={styles.cTr}>◤</span>
            <span className={styles.cBl}>◢</span>
            <span className={styles.cBr}>◣</span>
          </div>
          <div className={styles.magicSeal}>
            <MagicCircle />
          </div>
          <div className={styles.coverTitleBox}>
            <span className={styles.coverLabel}>[ ANCIENT ARTIFACT ]</span>
            <h3>Grimoire</h3>
            <p>Forbidden Projects</p>
          </div>
        </div>
      ),
      back: <div className={styles.imageSide} style={{ backgroundImage: `url(${featuredProjects[0].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className={styles.mysticOverlay}/><span className={styles.kanjiDeco}>壱</span></div>
    },
    {
      front: <ProjectContent project={featuredProjects[0]} index={0} />,
      back: <div className={styles.imageSide} style={{ backgroundImage: `url(${featuredProjects[1].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className={styles.mysticOverlay}/><span className={styles.kanjiDeco}>弐</span></div>
    },
    {
      front: <ProjectContent project={featuredProjects[1]} index={1} />,
      back: <div className={styles.imageSide} style={{ backgroundImage: `url(${featuredProjects[2].image})`, backgroundSize: 'cover', backgroundPosition: 'center' }}><div className={styles.mysticOverlay}/><span className={styles.kanjiDeco}>参</span></div>
    },
    {
      front: <ProjectContent project={featuredProjects[2]} index={2} />,
      back: (
        <div className={styles.outerCover}>
          <div className={styles.spineTexture} />
          <div className={styles.coverCorners}>
            <span className={styles.cTl}>◥</span>
            <span className={styles.cTr}>◤</span>
            <span className={styles.cBl}>◢</span>
            <span className={styles.cBr}>◣</span>
          </div>
          <div className={styles.magicSeal} data-end="true">
            <MagicCircle />
          </div>
          <div className={styles.coverTitleBox}>
            <span className={styles.coverLabel}>[ SEALED RECORD ]</span>
            <h3>The End</h3>
            <p>Return to Source (Github)</p>
          </div>
        </div>
      )
    }
  ];

  const getBookTransform = () => {
    // We add rotateX here so the book looks 3D tilted from above.
    if (currentPage === 0) return "translateX(-25%) rotateX(10deg) rotateY(-5deg)"; 
    if (currentPage === leaves.length) return "translateX(25%) rotateX(10deg) rotateY(5deg)";
    return "translateX(0%) rotateX(10deg)"; 
  };

  return (
    <section id="projects" className={styles.projects}>
      {/* Ambient backdrops (match About/Skills) */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />
      <AnimeOrnaments />
      <div className={styles.kanjiSpine} aria-hidden>
        <span>魔</span>
        <span>法</span>
        <span>書</span>
      </div>

      {/* Issue tag (right) */}
      <div className={styles.issueTag} aria-hidden>
        ISSUE 04 · 魔法書 · 2026
      </div>

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

      <div className="container">
        <header className={styles.header}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.04</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              Projects <span className={styles.chapterKana}>魔法書</span>
            </span>
          </div>

          <h2 className={styles.title}>
            <div className={styles.titleSparkles} aria-hidden>
              <SparkleIcon className={styles.sparkle1} />
              <SparkleIcon className={styles.sparkle2} />
              <SparkleIcon className={styles.sparkle3} />
            </div>
            Featured <span className={styles.titleAccent}>Projects</span>
          </h2>
          <p className={styles.subtitle}>
            A magical archive of my 3 most powerful creations.
          </p>
        </header>

        <div className={styles.bookContainer}>
          {/* Magic Altar beneath the book */}
          <div className={styles.altarWrap} aria-hidden>
            <div className={styles.altarGlow} />
            <div className={styles.altarRingOuter} />
            <div className={styles.altarRingInner} />
            
            {/* Floating Magical Runes rising from the altar */}
            <div className={styles.floatingRunes}>
              {['幻', '魔', '光', '星', '夢', '霊', '魂', '術', '界', '時'].map((rune, i) => (
                <span 
                  key={i} 
                  className={styles.rune}
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 15}s`,
                    animationDuration: `${10 + Math.random() * 10}s`,
                  }}
                >
                  {rune}
                </span>
              ))}
            </div>
          </div>

          <button 
            className={`${styles.navBtn} ${styles.prevBtn}`} 
            onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            title="Previous Page"
          >
            <ChevronLeft />
          </button>

          <div className={styles.book}>
            <div 
              className={styles.bookInner}
              style={{ transform: getBookTransform() }}
            >
              {leaves.map((leaf, index) => {
                const isTurned = index < currentPage;
                const zIndex = isTurned ? index : leaves.length - index;
                
                return (
                  <div 
                    key={index} 
                    className={`${styles.leaf} ${isTurned ? styles.turned : ""}`}
                    style={{ zIndex }}
                  >
                    <div className={styles.pageFront}>
                      {leaf.front}
                    </div>
                    <div className={styles.pageBack}>
                      {leaf.back}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <button 
            className={`${styles.navBtn} ${styles.nextBtn}`} 
            onClick={() => setCurrentPage(p => Math.min(leaves.length, p + 1))}
            disabled={currentPage === leaves.length}
            title="Next Page"
          >
            <ChevronRight />
          </button>
        </div>
      </div>
    </section>
  );
}

function ProjectContent({ project, index }: { project: Project; index: number }) {
  return (
    <div className={styles.projectContent}>
      {/* Decorative top border */}
      <div className={styles.pageBorderTop} aria-hidden>
        <span className={styles.cornerL}>✧</span>
        <div className={styles.line} />
        <span className={styles.cornerR}>✧</span>
      </div>

      <div className={styles.pageHeader}>
        <span className={styles.spellNumber}>SPELL NO. {String(index + 1).padStart(2, "0")}</span>
        <span className={styles.spellClass}>[ {project.accent.toUpperCase()} CLASS ]</span>
      </div>

      <h3 className={styles.projectTitle}>{project.title}</h3>
      <div className={styles.titleUnderline} />
      
      <div className={styles.projectDescWrapper}>
        <span className={styles.dropCap}>{project.description.charAt(0)}</span>
        <p className={styles.projectDesc}>{project.description.slice(1)}</p>
      </div>

      <div className={styles.techRunes}>
         {project.tech.map(t => <span key={t} className={styles.runeTag}>{t}</span>)}
      </div>

      <div className={styles.pageFooter}>
        <div className={styles.links}>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className={styles.linkPrimary}>
              <ExternalLink size={14} /> Conjure
            </a>
          )}
          {project.repoUrl && (
            <a href={project.repoUrl} target="_blank" rel="noreferrer" className={styles.linkGhost}>
              <Github size={14} /> Grimoire
            </a>
          )}
        </div>
      </div>

      {/* Decorative bottom border */}
      <div className={styles.pageBorderBottom} aria-hidden>
        <span className={styles.cornerL}>✦</span>
        <div className={styles.line} />
        <span className={styles.cornerR}>✦</span>
      </div>
    </div>
  );
}
