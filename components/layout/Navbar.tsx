"use client";

import { useEffect, useMemo, useState } from "react";
import { Menu, X, Sparkles, Volume2, VolumeX } from "lucide-react";
import { navLinks, personal } from "@/lib/data";
import { useAudioPlayer } from "@/components/providers/AudioPlayerProvider";
import { useActiveSection } from "@/lib/hooks";
import { ThemeToggle } from "./ThemeToggle";
import styles from "./Navbar.module.scss";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { isMuted, toggleMute } = useAudioPlayer();

  const ids = useMemo(() => navLinks.map((l) => l.href.slice(1)), []);
  const activeId = useActiveSection(ids);
  const active = `#${activeId}`;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={styles.nav}
      data-scrolled={scrolled ? "true" : undefined}
      data-open={open ? "true" : undefined}
    >
      <div className={styles.inner}>
        <a href="#hero" className={styles.brand} onClick={() => setOpen(false)}>
          <span className={styles.brandIcon} aria-hidden>
            <img src="/logo.jpg" alt="Logo" className={styles.brandImage} />
          </span>
          <span className={styles.brandName}>
            {personal.name.split(" ")[0]}
          </span>
        </a>

        <nav className={styles.links} data-open={open ? "true" : undefined}>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className={`${styles.link} ${active === link.href ? styles.active : ""}`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute audio" : "Mute audio"}
            aria-pressed={isMuted}
            className={styles.iconBtn}
            data-muted={isMuted ? "true" : undefined}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <ThemeToggle />
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            className={styles.menuButton}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>
    </header>
  );
}
