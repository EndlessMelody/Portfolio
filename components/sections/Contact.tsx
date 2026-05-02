"use client";

import { useState, type FormEvent } from "react";
import { Send, Github, Linkedin, Facebook, Mail } from "lucide-react";
import { personal } from "@/lib/data";
import styles from "./Contact.module.scss";
import { AnimeOrnaments } from "./AnimeOrnaments";

type Status = "idle" | "ready" | "sending" | "sent";

export function Contact() {
  const [status, setStatus] = useState<Status>("idle");
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const update = (k: keyof typeof form, v: string) => {
    setForm((f) => {
      const next = { ...f, [k]: v };
      const ready = next.name && next.email && next.message;
      setStatus(ready ? "ready" : "idle");
      return next;
    });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status !== "ready") return;
    setStatus("sending");
    // Placeholder: open mail client. Replace with API later.
    const subject = encodeURIComponent(`Hello from ${form.name}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${personal.email}?subject=${subject}&body=${body}`;
    setTimeout(() => setStatus("sent"), 600);
  };

  return (
    <section id="contact" className={styles.contact}>
      {/* Ambient backdrops (match other sections) */}
      <div className={styles.bgGrid} aria-hidden />
      <div className={styles.bgDotsTl} aria-hidden />
      <div className={styles.bgDotsBr} aria-hidden />
      <div className={styles.bgGradient} aria-hidden />
      
      <AnimeOrnaments />

      {/* Kanji spine (left) — 終章 = Final Chapter */}
      <div className={styles.kanjiSpine} aria-hidden>
        <span>終</span>
        <span>章</span>
      </div>

      {/* Issue tag (right) */}
      <div className={styles.issueTag} aria-hidden>
        ISSUE 06 · 終章 · 2026
      </div>

      <div className="container">
        <header className={styles.header}>
          <div className={styles.chapter}>
            <span className={styles.chapterBar} aria-hidden />
            <span className={styles.chapterNo}>CH.06</span>
            <span className={styles.chapterSep}>·</span>
            <span className={styles.chapterLabel}>
              Transmission <span className={styles.chapterKana}>通信</span>
            </span>
          </div>

          <h2 className={styles.title}>
            Establish <span className={styles.titleAccent}>Connection</span>
          </h2>
          <p className={styles.subtitle}>
            Open to collaborations, freelance, or just a friendly hello.
            <br />I usually reply within a cycle ✿
          </p>
        </header>

        <div className={styles.grid}>
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.envelope} aria-hidden />

            <label className={styles.field}>
              <span>Sender_ID</span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Enter your designation"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Comms_Link</span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
                placeholder="you@domain.net"
                required
              />
            </label>

            <label className={styles.field}>
              <span>Payload</span>
              <textarea
                rows={5}
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                placeholder="Input data package here..."
                required
              />
            </label>

            <button
              type="submit"
              className={styles.submit}
              disabled={status === "sending" || status === "idle"}
              data-status={status}
            >
              <Send size={16} />
              {status === "sent"
                ? "Transmitted"
                : status === "sending"
                  ? "Uplinking…"
                  : "Transmit Data"}
            </button>
          </form>

          <aside className={styles.aside}>
            <h3 className={styles.asideTitle}>Alternative Nodes</h3>
            <a className={styles.lineLink} href={`mailto:${personal.email}`}>
              <Mail size={16} /> {personal.email}
            </a>
            <ul className={styles.socials}>
              <li>
                <a href={personal.socials.github} target="_blank" rel="noreferrer">
                  <Github size={18} /> GitHub Repository
                </a>
              </li>
              <li>
                <a href={personal.socials.linkedin} target="_blank" rel="noreferrer">
                  <Linkedin size={18} /> LinkedIn Network
                </a>
              </li>
              <li>
                <a href={personal.socials.facebook} target="_blank" rel="noreferrer">
                  <Facebook size={18} /> Facebook Network
                </a>
              </li>
            </ul>

            <p className={styles.note}>
              <span className={styles.noteIcon}>◈</span>
              Stationed in {personal.location}
            </p>
          </aside>
        </div>
      </div>
    </section>
  );
}
