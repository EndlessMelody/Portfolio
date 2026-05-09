"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

type AudioPlayerCtx = {
  isPlaying: boolean;
  isMuted: boolean;
  hasError: boolean;
  duration: number; // seconds, 0 until metadata loaded
  currentTime: number; // seconds
  togglePlay: () => void;
  toggleMute: () => void;
  seek: (seconds: number) => void;
};

const AudioPlayerContext = createContext<AudioPlayerCtx | null>(null);

export function AudioPlayerProvider({
  src,
  volume = 1,
  children,
}: {
  src: string;
  volume?: number; // 0..1
  children: React.ReactNode;
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  // wire audio element listeners once
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => setIsPlaying(false);
    const onError = () => {
      setHasError(true);
      setIsPlaying(false);
    };
    const onLoadedMeta = () => {
      if (!Number.isNaN(a.duration) && Number.isFinite(a.duration)) {
        setDuration(a.duration);
      }
    };
    const onTimeUpdate = () => setCurrentTime(a.currentTime);

    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnded);
    a.addEventListener("error", onError);
    a.addEventListener("loadedmetadata", onLoadedMeta);
    a.addEventListener("timeupdate", onTimeUpdate);
    a.addEventListener("durationchange", onLoadedMeta);

    return () => {
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnded);
      a.removeEventListener("error", onError);
      a.removeEventListener("loadedmetadata", onLoadedMeta);
      a.removeEventListener("timeupdate", onTimeUpdate);
      a.removeEventListener("durationchange", onLoadedMeta);
    };
  }, []);

  // sync mute state to element
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = isMuted;
  }, [isMuted]);

  // apply requested volume (e.g. 0.8 = 80%) — clamp to safe range
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = Math.max(0, Math.min(1, volume));
  }, [volume]);

  const togglePlay = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    if (a.paused) {
      const result = a.play();
      if (result && typeof result.catch === "function") {
        result.catch(() => setHasError(true));
      }
    } else {
      a.pause();
    }
  }, []);

  const toggleMute = useCallback(() => setIsMuted((v) => !v), []);

  const seek = useCallback((seconds: number) => {
    const a = audioRef.current;
    if (!a || !Number.isFinite(seconds)) return;
    const target = Math.max(0, Math.min(a.duration || 0, seconds));
    a.currentTime = target;
    setCurrentTime(target);
  }, []);

  const value = useMemo<AudioPlayerCtx>(
    () => ({
      isPlaying,
      isMuted,
      hasError,
      duration,
      currentTime,
      togglePlay,
      toggleMute,
      seek,
    }),
    [
      isPlaying,
      isMuted,
      hasError,
      duration,
      currentTime,
      togglePlay,
      toggleMute,
      seek,
    ],
  );

  return (
    <AudioPlayerContext.Provider value={value}>
      {children}
      {/* Single global audio element. Loops the lo-fi track. */}
      <audio
        ref={audioRef}
        src={src}
        loop
        preload="metadata"
        playsInline
        aria-hidden
      />
    </AudioPlayerContext.Provider>
  );
}

export function useAudioPlayer(): AudioPlayerCtx {
  const ctx = useContext(AudioPlayerContext);
  if (!ctx) {
    // graceful no-op fallback (avoids crashing if used outside provider during SSR)
    return {
      isPlaying: false,
      isMuted: false,
      hasError: false,
      duration: 0,
      currentTime: 0,
      togglePlay: () => {},
      toggleMute: () => {},
      seek: () => {},
    };
  }
  return ctx;
}
