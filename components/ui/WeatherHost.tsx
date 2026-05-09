"use client";

import { useState } from "react";
import { WeatherChip } from "./WeatherChip";
import { WeatherOverlay } from "./WeatherOverlay";

type Kind =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

/**
 * Shares weather state between the compact chip (inline) and the fullscreen
 * particle overlay (rain/snow/fog). Renders just the chip here; the overlay
 * is rendered globally from `WeatherHostOverlay` (same hook, split render).
 */
export function WeatherHost({
  lat,
  lon,
  timezone,
}: {
  lat: number;
  lon: number;
  timezone?: string;
}) {
  const [kind, setKind] = useState<Kind | null>(null);
  return (
    <>
      <WeatherChip
        lat={lat}
        lon={lon}
        timezone={timezone}
        onKind={(k) => setKind(k)}
      />
      <WeatherOverlay kind={kind} />
    </>
  );
}
