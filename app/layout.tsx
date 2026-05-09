import type { Metadata } from "next";
import {
  Kaisei_Decol,
  Klee_One,
  Zen_Kaku_Gothic_New,
  JetBrains_Mono,
} from "next/font/google";
import "./globals.scss";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { AudioPlayerProvider } from "@/components/providers/AudioPlayerProvider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { SakuraPetals } from "@/components/effects/SakuraPetals";
import { CursorSparkles } from "@/components/effects/CursorSparkles";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ScrollRail } from "@/components/ui/ScrollRail";
import { SeasonalOverlay } from "@/components/ui/SeasonalOverlay";
import { KonamiEasterEgg } from "@/components/ui/KonamiEasterEgg";
import { ParallaxController } from "@/components/ui/ParallaxController";
import { personal } from "@/lib/data";

// Display — elegant decorative anime-novel serif for names and titles
const kaisei = Kaisei_Decol({
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-kaisei",
  display: "swap",
});

// Body — clean Japanese-aware sans
const zenKaku = Zen_Kaku_Gothic_New({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  variable: "--font-zen",
  display: "swap",
});

// Handwritten — manga/kana accents
const klee = Klee_One({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-klee",
  display: "swap",
});

// Mono — terminal/typewriter blocks
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${personal.name} — ${personal.title}`,
  description: personal.tagline,
  applicationName: `${personal.name} Portfolio`,
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: `${personal.name} — ${personal.title}`,
    description: personal.tagline,
    type: "website",
    // Dynamic OG image auto-resolved from `app/opengraph-image.tsx`
  },
  twitter: {
    card: "summary_large_image",
    title: `${personal.name} — ${personal.title}`,
    description: personal.tagline,
  },
  icons: {
    icon: "/logo.jpg",
    apple: "/logo.jpg",
  },
  appleWebApp: {
    capable: true,
    title: `${personal.name}`,
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fff3f7" },
    { media: "(prefers-color-scheme: dark)", color: "#1a0f2e" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${kaisei.variable} ${zenKaku.variable} ${klee.variable} ${mono.variable}`}
      >
        <ThemeProvider>
          <AudioPlayerProvider
            src={personal.nowPlaying.src}
            volume={personal.nowPlaying.volume}
          >
            <SakuraPetals count={18} />
            <CursorSparkles />
            <ScrollReveal />
            <ParallaxController />
            <SeasonalOverlay />
            <ScrollRail />
            <KonamiEasterEgg />
            <Navbar />
            <main>{children}</main>
            <Footer />
          </AudioPlayerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
