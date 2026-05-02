import deco from "./AnimeOrnaments.module.scss";

/**
 * Anime-styled decorative ornaments.
 * Manga corner brackets, floating diamonds, orbit arcs,
 * scan lines, and cross-hair markers.
 *
 * Drop <AnimeOrnaments /> inside any section with `position: relative; overflow: hidden`.
 */
export function AnimeOrnaments() {
  return (
    <>
      {/* Manga panel corner brackets */}
      <div className={deco.cornerTL} aria-hidden />
      <div className={deco.cornerTR} aria-hidden />
      <div className={deco.cornerBL} aria-hidden />
      <div className={deco.cornerBR} aria-hidden />

      {/* Floating diamonds */}
      <div className={deco.diamonds} aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className={deco.diamond}
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 10}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Orbit rings */}
      <div className={`${deco.orbitRing} ${deco.orbitA}`} aria-hidden />
      <div className={`${deco.orbitRing} ${deco.orbitB}`} aria-hidden />

      {/* Scan lines */}
      <div className={`${deco.scanLine} ${deco.scanTop}`} aria-hidden />
      <div className={`${deco.scanLine} ${deco.scanBottom}`} aria-hidden />

      {/* Cross targeting markers */}
      <div className={deco.crossMarkers} aria-hidden>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className={deco.crossMark}
            style={{
              left: `${5 + Math.random() * 90}%`,
              top: `${5 + Math.random() * 90}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* Hex badges */}
      <div className={`${deco.hexBadge} ${deco.hexA}`} aria-hidden />
      <div className={`${deco.hexBadge} ${deco.hexB}`} aria-hidden />
    </>
  );
}
