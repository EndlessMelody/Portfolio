// =====================================================
// Portfolio content — swap placeholders with your info
// =====================================================

export const personal = {
  name: "Melody",
  kana: "メロディ",
  kanji: "夢音美", // ateji — dream · sound · beauty
  kanjiChars: ["夢", "音", "美"] as const,
  fullName: "Đăng Khoa",
  alias: "melody.dev",
  title: "AI / ML Engineer · SE Student",
  tagline: "Teaching machines to dream in pastel ✦",
  location: "Vietnam",
  availability: "Open to ML / SWE internships",
  characterClass: "AI Mage · SE Apprentice",
  currentQuest: "training latent dreams",
  email: "pldkhoa.work@gmail.com",
  resumeUrl: "/resume.pdf",
  avatar: "/avatars.jpg",
  roles: [
    { icon: "cpu", label: "AI / ML", tone: "blue" },
    { icon: "code", label: "Software Engineering", tone: "pink" },
    { icon: "sparkle", label: "CS Student", tone: "lavender" },
  ],
  nowPlaying: {
    track: "Homecoming Star",
    artist: "from the Unbound",
    src: "/Homecoming%20Star%20from%20the%20Unbound.mp3",
    volume: 0.8, // 80%
  },
  currentlyBuilding: {
    name: "夢 Diffusion · sketch → anime",
    progress: 65,
    stack: "PyTorch · Diffusers",
  },
  techBelt: [
    "Python",
    "PyTorch",
    "TensorFlow",
    "Transformers",
    "scikit-learn",
    "NumPy",
    "Pandas",
    "FastAPI",
    "Docker",
    "Git",
    "TypeScript",
    "Next.js",
    "Node.js",
  ],
  socials: {
    github: "https://github.com/EndlessMelody/",
    linkedin: "https://www.linkedin.com/in/endlessmelody/",
    facebook: "https://www.facebook.com/Endless.Melody/",
  },
};

export const about = {
  intro:
    "Hi, I'm a passionate developer who blends clean code with creative storytelling. I love anime, pastel aesthetics, and building delightful UIs that feel alive.",
  story: [
    "I started my journey building tiny HTML pages styled like manga panels — that spark never left.",
    "Today I focus on full-stack web apps with React, Next.js, and Node — always with an eye for detail and motion.",
    "When offline, you'll find me sketching, reading manga, or chasing the perfect cup of matcha.",
  ],
  stats: [
    { label: "HP", value: 92, color: "var(--hp-color)" },
    { label: "MP", value: 78, color: "var(--mp-color)" },
    { label: "EXP", value: 64, color: "var(--xp-color)" },
  ],
  traits: ["Curious", "Detail-oriented", "Caffeinated", "Anime-coded"],
};

// =====================================================
// VN-style branching dialogue for About section
// Narrator: Selena (Melody's AI assistant)
// She speaks TO the visitor ABOUT Melody
// =====================================================
export type Emote = "neutral" | "smile" | "think" | "excited" | "wink" | "shy";

export type DialogueLine = {
  text: string;
  emote?: Emote;
};

export type DialogueThread = {
  id: string;
  label: string;
  icon: string;
  hint: string;
  preview: string; // shown in dialogue box when hovering this choice
  lines: DialogueLine[];
};

export const assistant = {
  name: "Selena",
  title: "Melody's Assistant",
  kana: "セレナ",
  avatar: "/selena.jpg",
  background: "/background.gif",
};

export const aboutVN = {
  // Selena's line shown in the dialogue box while the choice menu is open
  menuPrompt: {
    emote: "smile" as const,
    text: "So… what would you like to know about Melody? Pick a topic, traveler ~",
  },
  intro: [
    {
      emote: "smile" as const,
      text: "Welcome, traveler~ I'm *Selena*, Melody's assistant ♡",
    },
    {
      emote: "excited" as const,
      text: "He's a bit shy about talking about himself, so he sent me instead ✦",
    },
    {
      emote: "neutral" as const,
      text: "Tap or press Space to continue. Pick a topic and I'll tell you all about him.",
    },
  ],
  threads: [
    {
      id: "journey",
      label: "His journey so far",
      icon: "compass",
      hint: "How Melody got here",
      preview: "A peek into Melody's origin story— how it all started… ✦",
      lines: [
        {
          emote: "think" as const,
          text: "It all started with sketching — manga panels, character designs, little stories he wanted to tell.",
        },
        {
          emote: "smile" as const,
          text: "Then he discovered code, and realized he could *make things move* and feel alive.",
        },
        {
          emote: "excited" as const,
          text: "Now he's chasing both paths — engineering systems with a soul, like a good anime ♡",
        },
        {
          emote: "neutral" as const,
          text: "Every project is a new chapter. This portfolio you're exploring? That's his latest one.",
        },
      ],
    },
    {
      id: "stack",
      label: "His tech stack",
      icon: "terminal",
      hint: "Tools of the trade",
      preview: "Let me tell you about the tools he loves to build with ✦",
      lines: [
        {
          emote: "neutral" as const,
          text: "On the AI/ML side: *Python, PyTorch, Diffusers, Transformers*. He loves generative models.",
        },
        {
          emote: "smile" as const,
          text: "For software: *TypeScript, Next.js, React, Node* — anything that ships fast and feels good.",
        },
        {
          emote: "think" as const,
          text: "He cares deeply about *craft* — typography, motion, spacing. Details make the magic.",
        },
        {
          emote: "wink" as const,
          text: "Also... he uses Vim. Don't judge him for it, okay? ✦",
        },
      ],
    },
    {
      id: "hobbies",
      label: "Outside of code",
      icon: "palette",
      hint: "Hobbies & interests",
      preview: "Curious about his non-coding side? It's surprisingly soft ♡",
      lines: [
        {
          emote: "shy" as const,
          text: "He draws — usually anime girls in pastel palettes. It helps clear his head.",
        },
        {
          emote: "smile" as const,
          text: "He reads a *lot* of manga. Currently obsessed with *Frieren* and *Oshi no Ko*.",
        },
        {
          emote: "excited" as const,
          text: "Music: lo-fi while coding, J-pop & city pop while drawing, classical at 3am ♪",
        },
        {
          emote: "wink" as const,
          text: "And matcha. So. Much. Matcha. ♡",
        },
      ],
    },
    {
      id: "building",
      label: "What he's building",
      icon: "rocket",
      hint: "His current quest",
      preview: "His current passion project— brace yourself, it's cool ✦",
      lines: [
        {
          emote: "excited" as const,
          text: "Right now he's training a *sketch→anime* diffusion model — to bring his drawings to life.",
        },
        {
          emote: "think" as const,
          text: "It's a fine-tune of Stable Diffusion with a custom LoRA on his own art style.",
        },
        {
          emote: "neutral" as const,
          text: "He's also polishing this portfolio obsessively — every detail tested, every animation hand-tuned.",
        },
        {
          emote: "smile" as const,
          text: "His goal? Make the web feel as expressive as a well-directed anime opening ✦",
        },
      ],
    },
  ] as DialogueThread[],
  outro: [
    {
      emote: "smile" as const,
      text: "That's everything I can share about Melody for now ♡",
    },
    {
      emote: "excited" as const,
      text: "Scroll down to see his actual work — the code speaks louder than I can ✦",
    },
    {
      emote: "wink" as const,
      text: "Thanks for listening, traveler~ Enjoy the rest of your visit!",
    },
  ],
};

export type Project = {
  title: string;
  description: string;
  tech: string[];
  liveUrl?: string;
  repoUrl?: string;
  image: string; // gradient css or image path
  accent: "pink" | "blue" | "lavender";
};

export const projects: Project[] = [
  {
    title: "Careermate",
    description:
      "An end-to-end intelligent career assistant designed to streamline the job hunting process. Features include automated application tracking, AI-driven resume tailoring, interview preparation agents, and comprehensive market analytics to empower professionals.",
    tech: ["React", "TypeScript", "Node.js", "MongoDB", "OpenAI API", "TailwindCSS"],
    repoUrl: "https://github.com/EndlessMelody/Careermate",
    image: "/CareerMate.png",
    accent: "blue",
  },
  {
    title: "AiRI",
    description:
      "A sophisticated conversational AI agent engineered for the moeru-ai ecosystem. Built with deep anime knowledge bases, persistent personalized memory, and emotionally intelligent dialogue generation utilizing RAG and fine-tuned LLMs.",
    tech: ["Python", "PyTorch", "FastAPI", "Transformers", "LangChain", "Vector DB"],
    repoUrl: "https://github.com/moeru-ai/airi",
    image: "/AiRI.png",
    accent: "pink",
  },
  {
    title: "TasteMap",
    description:
      "A high-fidelity social networking platform tailored for food enthusiasts. Implements the 'Elite Pastel Blue' design system with a real-time messenger, interactive friend discovery, and cinematic UI transitions for a premium experience.",
    tech: ["Next.js", "TypeScript", "Framer Motion", "WebSockets", "Zustand", "Once UI"],
    repoUrl: "https://github.com/EndlessMelody/TasteMap",
    image: "/TasteMap.png",
    accent: "lavender",
  },
];

export type Experience = {
  role: string;
  company: string;
  period: string;
  description: string;
  tags: string[];
};

export const experiences: Experience[] = [
  {
    role: "AI Applied Intern",
    company: "VNG Cloud",
    period: "April 2026 — Present",
    description:
      "Applying AI/ML solutions in cloud infrastructure, optimizing models, and enhancing cloud services with deep learning.",
    tags: ["AI/ML", "Cloud Computing", "Deep Learning"],
  },
  {
    role: "AI-Driven Developer",
    company: "Shopee",
    period: "Nov 2025 — Present",
    description:
      "Developing and integrating AI models into the e-commerce platform. Focused on recommendation systems, predictive analytics, and enhancing user personalization through data-driven approaches.",
    tags: ["Recommendation Systems", "Machine Learning", "E-commerce"],
  },
  {
    role: "AIO2025 Scholar",
    company: "AI Việt Nam",
    period: "Feb 2025 — Present",
    description:
      "Top 10 performer in the prestigious AIO2025 course. Demonstrated high efficiency in Machine Learning architectures and precise model controlling techniques.",
    tags: ["Machine Learning", "Model Controlling", "PyTorch"],
  },
  {
    role: "CS Student (AI/ML Focus)",
    company: "HCMUS (FIT)",
    period: "2024 — Present",
    description:
      "2nd-year student at the Faculty of Information Technology, majoring in Computer Science with a specialized focus on Artificial Intelligence and Machine Learning.",
    tags: ["Computer Science", "Algorithms", "Mathematics"],
  },
];

export const navLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];
