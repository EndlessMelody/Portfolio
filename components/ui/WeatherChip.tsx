"use client";

import { useEffect, useState } from "react";
import { Cloud, CloudRain, CloudSnow, Sun, Moon, CloudFog } from "lucide-react";
import styles from "./WeatherChip.module.scss";

type Kind =
  | "clear-day"
  | "clear-night"
  | "cloudy"
  | "fog"
  | "rain"
  | "snow"
  | "storm";

type Weather = {
  temp: number; // °C
  kind: Kind;
  code: number; // raw Open-Meteo WMO code
  isDay: boolean;
};

const CACHE_KEY = "weather-v1";
const CACHE_TTL = 1000 * 60 * 15; // 15 minutes

function codeToKind(code: number, isDay: boolean): Kind {
  // WMO weather codes: https://open-meteo.com/en/docs
  if (code === 0) return isDay ? "clear-day" : "clear-night";
  if (code === 1 || code === 2 || code === 3) return "cloudy";
  if (code === 45 || code === 48) return "fog";
  if (code >= 51 && code <= 67) return "rain"; // drizzle/rain
  if (code >= 80 && code <= 82) return "rain"; // rain showers
  if (code >= 71 && code <= 77) return "snow";
  if (code >= 85 && code <= 86) return "snow";
  if (code >= 95 && code <= 99) return "storm";
  return "cloudy";
}

const kindLabel: Record<Kind, string> = {
  "clear-day": "Clear",
  "clear-night": "Clear night",
  cloudy: "Cloudy",
  fog: "Foggy",
  rain: "Raining",
  snow: "Snowing",
  storm: "Stormy",
};

function kindIcon(kind: Kind) {
  switch (kind) {
    case "clear-day":
      return <Sun size={14} strokeWidth={2.2} />;
    case "clear-night":
      return <Moon size={14} strokeWidth={2.2} />;
    case "cloudy":
      return <Cloud size={14} strokeWidth={2.2} />;
    case "fog":
      return <CloudFog size={14} strokeWidth={2.2} />;
    case "rain":
    case "storm":
      return <CloudRain size={14} strokeWidth={2.2} />;
    case "snow":
      return <CloudSnow size={14} strokeWidth={2.2} />;
  }
}

export function WeatherChip({
  lat,
  lon,
  timezone = "auto",
  onKind,
}: {
  lat: number;
  lon: number;
  timezone?: string;
  onKind?: (kind: Kind | null) => void;
}) {
  const [data, setData] = useState<Weather | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "ok">(
    "idle",
  );

  useEffect(() => {
    let cancelled = false;

    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          at: number;
          lat: number;
          lon: number;
          data: Weather;
        };
        if (
          parsed &&
          Math.abs(parsed.lat - lat) < 0.01 &&
          Math.abs(parsed.lon - lon) < 0.01 &&
          Date.now() - parsed.at < CACHE_TTL
        ) {
          setData(parsed.data);
          setStatus("ok");
          onKind?.(parsed.data.kind);
          return;
        }
      }
    } catch {
      // ignore
    }

    setStatus("loading");

    (async () => {
      try {
        const url = new URL("https://api.open-meteo.com/v1/forecast");
        url.searchParams.set("latitude", String(lat));
        url.searchParams.set("longitude", String(lon));
        url.searchParams.set("current", "temperature_2m,weather_code,is_day");
        url.searchParams.set("timezone", timezone);
        const res = await fetch(url.toString());
        if (!res.ok) throw new Error("weather fetch failed");
        const json = await res.json();
        const cur = json.current ?? {};
        const isDay = cur.is_day === 1;
        const code = Number(cur.weather_code);
        const weather: Weather = {
          temp: Math.round(Number(cur.temperature_2m)),
          code,
          isDay,
          kind: codeToKind(code, isDay),
        };
        if (cancelled) return;
        setData(weather);
        setStatus("ok");
        onKind?.(weather.kind);
        try {
          sessionStorage.setItem(
            CACHE_KEY,
            JSON.stringify({ at: Date.now(), lat, lon, data: weather }),
          );
        } catch {
          // ignore cache errors
        }
      } catch {
        if (!cancelled) setStatus("error");
        onKind?.(null);
      }
    })();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lat, lon, timezone]);

  if (status === "error" || !data) return null;

  return (
    <span
      className={styles.chip}
      data-kind={data.kind}
      title={`${kindLabel[data.kind]} · ${data.temp}°C`}
    >
      <span className={styles.icon} aria-hidden>
        {kindIcon(data.kind)}
      </span>
      <span className={styles.temp}>
        {data.temp}
        <span className={styles.deg}>°C</span>
      </span>
      <span className={styles.label}>{kindLabel[data.kind]}</span>
    </span>
  );
}
