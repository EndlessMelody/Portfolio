import { ImageResponse } from "next/og";
import { personal } from "@/lib/data";

// Dynamic Open Graph image — rendered at the edge, shown whenever anyone
// shares a link to this site on Discord, Twitter/X, LinkedIn, iMessage, etc.
// Uses Next.js built-in `@vercel/og` integration via `ImageResponse`.

export const runtime = "edge";

export const alt = `${personal.name} — ${personal.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "80px",
        backgroundColor: "#1a0f2e",
        backgroundImage:
          "radial-gradient(ellipse 60% 50% at 20% 20%, rgba(244,122,160,0.45), transparent 60%), radial-gradient(ellipse 50% 50% at 80% 30%, rgba(127,179,255,0.4), transparent 60%), radial-gradient(ellipse 40% 40% at 60% 95%, rgba(200,182,255,0.35), transparent 65%)",
        color: "#fff",
        fontFamily: "serif",
        position: "relative",
      }}
    >
      {/* Top-left chapter tag */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "16px",
          fontSize: "22px",
          fontWeight: 600,
          letterSpacing: "0.2em",
          color: "rgba(255,255,255,0.85)",
        }}
      >
        <div
          style={{
            width: "36px",
            height: "3px",
            background: "linear-gradient(90deg, #f47aa0, #7fb3ff)",
            borderRadius: "3px",
          }}
        />
        <span style={{ color: "#ffa1c0" }}>CH.01</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span>PORTFOLIO</span>
        <span style={{ opacity: 0.4 }}>·</span>
        <span style={{ color: "#b3d4ff" }}>自己紹介</span>
      </div>

      {/* Main title block */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            gap: "24px",
            fontSize: "140px",
            fontWeight: 700,
            lineHeight: 1,
            backgroundImage:
              "linear-gradient(120deg, #f47aa0 0%, #ffc0d4 30%, #d9c7ff 55%, #9dc0ff 80%, #7fb3ff 100%)",
            backgroundClip: "text",
            color: "transparent",
            letterSpacing: "-0.02em",
          }}
        >
          {personal.name}
          <span
            style={{
              fontSize: "46px",
              color: "rgba(255,255,255,0.5)",
              fontWeight: 500,
            }}
          >
            ({personal.kanji})
          </span>
        </div>

        <div
          style={{
            fontSize: "38px",
            color: "rgba(255,255,255,0.85)",
            fontWeight: 500,
            display: "flex",
          }}
        >
          {personal.title}
        </div>

        <div
          style={{
            fontSize: "28px",
            color: "rgba(255,255,255,0.6)",
            fontStyle: "italic",
            display: "flex",
          }}
        >
          {/* Strip glyphs the edge font loader can't fetch (e.g. ✦ U+2726) */}
          {personal.tagline.replace(/[\u2726\u2727\u2605\u2606]/g, "·")}
        </div>
      </div>

      {/* Bottom row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: "22px",
          color: "rgba(255,255,255,0.7)",
          letterSpacing: "0.15em",
          textTransform: "uppercase",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              background: "#7ee793",
              borderRadius: "50%",
              boxShadow: "0 0 16px #7ee793",
            }}
          />
          {personal.availability}
        </div>
        <div style={{ display: "flex", gap: "18px" }}>
          <span>{personal.location}</span>
          <span style={{ opacity: 0.3 }}>·</span>
          <span style={{ color: "#f47aa0" }}>{personal.alias}</span>
        </div>
      </div>

      {/* Vertical kanji accent on far right */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "90px",
          display: "flex",
          flexDirection: "column",
          fontSize: "160px",
          fontWeight: 700,
          lineHeight: 0.95,
          backgroundImage:
            "linear-gradient(180deg, rgba(244,122,160,0.35), rgba(200,182,255,0.3), rgba(127,179,255,0.25))",
          backgroundClip: "text",
          color: "transparent",
          letterSpacing: "-0.05em",
        }}
      >
        {personal.kanjiChars.map((c) => (
          <span key={c}>{c}</span>
        ))}
      </div>
    </div>,
    { ...size },
  );
}
