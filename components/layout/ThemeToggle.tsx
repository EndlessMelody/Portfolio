"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/providers/ThemeProvider";
import styles from "./ThemeToggle.module.scss";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggle}
      className={styles.toggle}
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      data-theme={theme}
    >
      <span className={styles.track}>
        <span className={styles.thumb}>
          {isDark ? <Moon size={14} strokeWidth={2.5} /> : <Sun size={14} strokeWidth={2.5} />}
        </span>
      </span>
    </button>
  );
}
