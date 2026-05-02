import styles from "./SectionDivider.module.scss";

type Props = {
  variant?: "wave" | "petals";
  flip?: boolean;
};

export function SectionDivider({ variant = "wave", flip = false }: Props) {
  return (
    <div className={`${styles.divider} ${flip ? styles.flip : ""}`} aria-hidden>
      {variant === "wave" ? (
        <svg
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          className={styles.svg}
        >
          <defs>
            <linearGradient id="waveGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--pink-200)" />
              <stop offset="50%" stopColor="var(--lavender-200)" />
              <stop offset="100%" stopColor="var(--blue-200)" />
            </linearGradient>
          </defs>
          <path
            d="M0,64 C240,120 480,8 720,48 C960,88 1200,16 1440,56 L1440,120 L0,120 Z"
            fill="url(#waveGrad)"
            opacity="0.55"
          />
          <path
            d="M0,80 C240,40 480,120 720,80 C960,40 1200,100 1440,72 L1440,120 L0,120 Z"
            fill="url(#waveGrad)"
            opacity="0.35"
          />
        </svg>
      ) : null}
    </div>
  );
}
