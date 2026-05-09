"use client";

import { useEffect, useState } from "react";
import { Github } from "lucide-react";
import styles from "./GitHubLive.module.scss";

type Stats = {
  login: string;
  publicRepos: number;
  followers: number;
  lastActiveAt: number | null; // timestamp ms of most recent public event
};

const CACHE_KEY = "gh-live-v1";
const CACHE_TTL = 1000 * 60 * 30; // 30 min

function formatRelative(ts: number) {
  const diff = Math.max(0, Date.now() - ts);
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

export function GitHubLive({ username }: { username: string }) {
  const [stats, setStats] = useState<Stats | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ok">(
    "idle",
  );

  useEffect(() => {
    let cancelled = false;

    // Try cache first
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as { at: number; data: Stats };
        if (
          parsed &&
          parsed.data?.login === username &&
          Date.now() - parsed.at < CACHE_TTL
        ) {
          setStats(parsed.data);
          setStatus("ok");
          return;
        }
      }
    } catch {
      // ignore cache errors
    }

    setStatus("loading");

    (async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch(`https://api.github.com/users/${username}`),
          fetch(
            `https://api.github.com/users/${username}/events/public?per_page=1`,
          ),
        ]);
        if (!userRes.ok) throw new Error("user fetch failed");
        const user = await userRes.json();
        let lastActiveAt: number | null = null;
        if (eventsRes.ok) {
          const events = await eventsRes.json();
          if (Array.isArray(events) && events.length > 0) {
            const t = events[0]?.created_at;
            if (t) lastActiveAt = new Date(t).getTime();
          }
        }
        const data: Stats = {
          login: user.login,
          publicRepos: user.public_repos ?? 0,
          followers: user.followers ?? 0,
          lastActiveAt,
        };
        if (cancelled) return;
        setStats(data);
        setStatus("ok");
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ at: Date.now(), data }),
          );
        } catch {
          // ignore
        }
      } catch {
        if (!cancelled) setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [username]);

  if (status === "error" || (status === "ok" && !stats)) {
    return null; // fail silently; don't clutter UI
  }

  const recent =
    stats?.lastActiveAt != null && Date.now() - stats.lastActiveAt < 86_400_000;

  return (
    <a
      className={styles.chip}
      href={`https://github.com/${username}`}
      target="_blank"
      rel="noreferrer"
      aria-label="View GitHub profile"
      title={stats ? `@${stats.login} on GitHub` : "Loading GitHub stats…"}
    >
      <span className={styles.icon} aria-hidden>
        <Github size={12} strokeWidth={2.2} />
      </span>

      <span className={styles.handle}>@{stats?.login ?? username}</span>

      {stats && (
        <>
          <span className={styles.sep} aria-hidden>
            ·
          </span>
          <span className={styles.stat}>
            <strong>{stats.publicRepos}</strong> repos
          </span>
          <span className={styles.sep} aria-hidden>
            ·
          </span>
          <span className={styles.stat}>
            <strong>{stats.followers}</strong> followers
          </span>
          {stats.lastActiveAt != null && (
            <>
              <span className={styles.sep} aria-hidden>
                ·
              </span>
              <span
                className={`${styles.pulse} ${recent ? styles.pulseActive : ""}`}
                aria-hidden
              />
              <span className={styles.stat}>
                coding {formatRelative(stats.lastActiveAt)}
              </span>
            </>
          )}
        </>
      )}

      {status === "loading" && !stats && (
        <span className={styles.stat}>loading…</span>
      )}
    </a>
  );
}
