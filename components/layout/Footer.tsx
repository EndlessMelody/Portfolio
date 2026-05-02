import { Github, Linkedin, Facebook, Mail, Heart } from "lucide-react";
import { personal } from "@/lib/data";
import styles from "./Footer.module.scss";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      {/* Background terminal grid */}
      <div className={styles.bgGrid} aria-hidden />

      <div className={`container ${styles.inner}`}>
        <div className={styles.left}>
          <p className={styles.brand}>{personal.name}</p>
          <p className={styles.tagline}>{personal.tagline}</p>
          <div className={styles.sysStatus} aria-hidden>
            <span className={styles.sysDot} /> SYSTEM_ONLINE
          </div>
        </div>

        <ul className={styles.socials} aria-label="Social links">
          <li>
            <a href={personal.socials.github} target="_blank" rel="noreferrer" aria-label="GitHub">
              <Github size={18} />
            </a>
          </li>
          <li>
            <a href={personal.socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Linkedin size={18} />
            </a>
          </li>
          <li>
            <a href={personal.socials.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
              <Facebook size={18} />
            </a>
          </li>
          <li>
            <a href={`mailto:${personal.email}`} aria-label="Email">
              <Mail size={18} />
            </a>
          </li>
        </ul>
      </div>

      <div className={styles.bottom}>
        <span>
          © {year} {personal.name} // ALL_SYSTEMS_NOMINAL
        </span>
        <span className={styles.made}>
          CODED_WITH <Heart size={12} fill="currentColor" /> & MATCHA
        </span>
      </div>

      {/* Decorative terminal edge */}
      <div className={styles.hudLines} aria-hidden />
    </footer>
  );
}
