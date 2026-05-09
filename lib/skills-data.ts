import {
  SiReact,
  SiNextdotjs,
  SiVuedotjs,
  SiSvelte,
  SiTypescript,
  SiTailwindcss,
  SiSass,
  SiFramer,
  SiThreedotjs,
  SiNodedotjs,
  SiExpress,
  SiNestjs,
  SiPython,
  SiFastapi,
  SiGo,
  SiRust,
  SiGraphql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiMysql,
  SiPrisma,
  SiSqlalchemy,
  SiSupabase,
  SiFirebase,
  SiPytorch,
  SiTensorflow,
  SiKeras,
  SiHuggingface,
  SiScikitlearn,
  SiNumpy,
  SiPandas,
  SiDocker,
  SiKubernetes,
  SiGithubactions,
  SiGitlab,
  SiVercel,
  SiNginx,
  SiLinux,
  SiTerraform,
} from "react-icons/si";
import {
  Network,
  Cloud,
  Zap,
  Palette,
  Code2,
  Database,
  Brain,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconType } from "react-icons";

// Unified icon type — both react-icons and lucide-react components fit this
export type IconComponent = IconType | LucideIcon;

export type Skill = {
  id: string;
  name: string;
  icon: IconComponent;
  color: string; // brand color
  mastery: 1 | 2 | 3 | 4 | 5;
  children?: Skill[];
};

export type SkillCategory = {
  id: "illusionist" | "architect" | "archivist" | "summoner" | "artificer";
  label: string; // RPG class name
  english: string; // plain english label
  kanji: string; // 2-char kanji
  sigil: string; // unicode symbol
  color: string; // primary brand color
  colorSoft: string; // faded tint
  icon: LucideIcon; // class icon (lucide)
  angle: number; // degrees from top, CW
  tagline: string; // short phrase
  root: Skill; // tree root (depth 1)
};

// Deterministic pseudo-random 1-5 based on skill id string
// (random-looking but stable across reloads; user can tweak manually later)
function m(id: string): 1 | 2 | 3 | 4 | 5 {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return ((Math.abs(h) % 5) + 1) as 1 | 2 | 3 | 4 | 5;
}

// Helper to create a skill node with deterministic mastery
const s = (
  id: string,
  name: string,
  icon: IconComponent,
  color: string,
  children?: Skill[],
): Skill => ({
  id,
  name,
  icon,
  color,
  mastery: m(id),
  children,
});

// =====================================================
// 1. ILLUSIONIST (Frontend) — pink
// =====================================================
const illusionistRoot: Skill = {
  id: "illusionist",
  name: "Illusionist",
  icon: Palette,
  color: "#F47AA0",
  mastery: 5,
  children: [
    s("il-ts", "TypeScript", SiTypescript, "#3178C6", [
      s("il-react", "React", SiReact, "#61DAFB", [
        s("il-next", "Next.js", SiNextdotjs, "#FFFFFF"),
        s("il-framer", "Framer Motion", SiFramer, "#FF5F8E"),
      ]),
      s("il-vue", "Vue", SiVuedotjs, "#4FC08D"),
      s("il-svelte", "Svelte", SiSvelte, "#FF3E00"),
    ]),
    s("il-style", "Styling", Code2, "#F47AA0", [
      s("il-tailwind", "Tailwind", SiTailwindcss, "#38BDF8"),
      s("il-scss", "SCSS", SiSass, "#CD6799"),
    ]),
    s("il-3d", "3D & Motion", Zap, "#C8B6FF", [
      s("il-three", "Three.js", SiThreedotjs, "#FFFFFF"),
    ]),
  ],
};

// =====================================================
// 2. ARCHITECT (Backend) — blue
// =====================================================
const architectRoot: Skill = {
  id: "architect",
  name: "Architect",
  icon: Wrench,
  color: "#5A96EE",
  mastery: 4,
  children: [
    s("ar-node", "Node.js", SiNodedotjs, "#8CC84B", [
      s("ar-express", "Express", SiExpress, "#FFFFFF"),
      s("ar-nest", "NestJS", SiNestjs, "#E0234E"),
    ]),
    s("ar-python", "Python", SiPython, "#3776AB", [
      s("ar-fastapi", "FastAPI", SiFastapi, "#009688"),
    ]),
    s("ar-go", "Go", SiGo, "#00ADD8"),
    s("ar-rust", "Rust", SiRust, "#DEA584"),
    s("ar-api", "APIs", Network, "#5A96EE", [
      s("ar-graphql", "GraphQL", SiGraphql, "#E535AB"),
      s("ar-grpc", "gRPC", Network, "#7FD9C5"),
    ]),
  ],
};

// =====================================================
// 3. ARCHIVIST (Database) — lavender
// =====================================================
const archivistRoot: Skill = {
  id: "archivist",
  name: "Archivist",
  icon: Database,
  color: "#C8B6FF",
  mastery: 4,
  children: [
    s("av-sql", "SQL", Database, "#C8B6FF", [
      s("av-postgres", "PostgreSQL", SiPostgresql, "#4169E1"),
      s("av-mysql", "MySQL", SiMysql, "#4479A1"),
      s("av-prisma", "Prisma", SiPrisma, "#FFFFFF"),
    ]),
    s("av-nosql", "NoSQL", Database, "#9D84DD", [
      s("av-mongo", "MongoDB", SiMongodb, "#47A248"),
      s("av-redis", "Redis", SiRedis, "#DC382D"),
    ]),
    s("av-orm", "Python ORM", Code2, "#B8A4F0", [
      s("av-sqlalchemy", "SQLAlchemy", SiSqlalchemy, "#D71F00"),
    ]),
    s("av-baas", "BaaS", Cloud, "#C8B6FF", [
      s("av-supabase", "Supabase", SiSupabase, "#3ECF8E"),
      s("av-firebase", "Firebase", SiFirebase, "#FFCA28"),
    ]),
  ],
};

// =====================================================
// 4. SUMMONER (AI / ML) — gold
// =====================================================
const summonerRoot: Skill = {
  id: "summoner",
  name: "Summoner",
  icon: Brain,
  color: "#F5C06F",
  mastery: 5,
  children: [
    s("su-pycore", "Python Core", SiPython, "#3776AB", [
      s("su-numpy", "NumPy", SiNumpy, "#4D77CF"),
      s("su-pandas", "Pandas", SiPandas, "#150458"),
      s("su-sklearn", "scikit-learn", SiScikitlearn, "#F7931E"),
    ]),
    s("su-dl", "Deep Learning", Brain, "#F5C06F", [
      s("su-pytorch", "PyTorch", SiPytorch, "#EE4C2C", [
        s("su-diffusers", "Diffusers", SiHuggingface, "#FFD21E"),
        s("su-transformers", "Transformers", SiHuggingface, "#FFD21E"),
      ]),
      s("su-tf", "TensorFlow", SiTensorflow, "#FF6F00", [
        s("su-keras", "Keras", SiKeras, "#D00000"),
      ]),
      s("su-jax", "JAX", Zap, "#9D84DD"),
    ]),
    s("su-llm", "LLM Tools", Brain, "#F5C06F", [
      s("su-hf", "HuggingFace", SiHuggingface, "#FFD21E"),
    ]),
  ],
};

// =====================================================
// 5. ARTIFICER (DevOps) — mint
// =====================================================
const artificerRoot: Skill = {
  id: "artificer",
  name: "Artificer",
  icon: Wrench,
  color: "#7FD9C5",
  mastery: 3,
  children: [
    s("af-container", "Containers", Cloud, "#7FD9C5", [
      s("af-docker", "Docker", SiDocker, "#2496ED"),
      s("af-k8s", "Kubernetes", SiKubernetes, "#326CE5"),
    ]),
    s("af-cicd", "CI / CD", Code2, "#7FD9C5", [
      s("af-gha", "GitHub Actions", SiGithubactions, "#2088FF"),
      s("af-gitlab", "GitLab CI", SiGitlab, "#FC6D26"),
    ]),
    s("af-cloud", "Cloud", Cloud, "#7FD9C5", [
      s("af-aws", "AWS", Cloud, "#FF9900"),
      s("af-vercel", "Vercel", SiVercel, "#FFFFFF"),
    ]),
    s("af-infra", "Infra", Wrench, "#7FD9C5", [
      s("af-nginx", "Nginx", SiNginx, "#009639"),
      s("af-linux", "Linux / Bash", SiLinux, "#FCC624"),
      s("af-terraform", "Terraform", SiTerraform, "#7B42BC"),
    ]),
  ],
};

// =====================================================
// CATEGORIES (pentagon layout, 72° apart)
// =====================================================
export const skillCategories: SkillCategory[] = [
  {
    id: "illusionist",
    label: "Illusionist",
    english: "Frontend",
    kanji: "幻術",
    sigil: "✦",
    color: "#F47AA0",
    colorSoft: "rgba(244, 122, 160, 0.2)",
    icon: Palette,
    angle: 0,
    tagline: "weaves pixels into living art",
    root: illusionistRoot,
  },
  {
    id: "architect",
    label: "Architect",
    english: "Backend",
    kanji: "構築",
    sigil: "⚜",
    color: "#5A96EE",
    colorSoft: "rgba(90, 150, 238, 0.2)",
    icon: Wrench,
    angle: 72,
    tagline: "forges unseen foundations",
    root: architectRoot,
  },
  {
    id: "archivist",
    label: "Archivist",
    english: "Database",
    kanji: "書記",
    sigil: "☸",
    color: "#C8B6FF",
    colorSoft: "rgba(200, 182, 255, 0.2)",
    icon: Database,
    angle: 144,
    tagline: "keeper of all stored lore",
    root: archivistRoot,
  },
  {
    id: "summoner",
    label: "Summoner",
    english: "AI / ML",
    kanji: "召喚",
    sigil: "✧",
    color: "#F5C06F",
    colorSoft: "rgba(245, 192, 111, 0.22)",
    icon: Brain,
    angle: 216,
    tagline: "calls intelligence from data",
    root: summonerRoot,
  },
  {
    id: "artificer",
    label: "Artificer",
    english: "DevOps",
    kanji: "工匠",
    sigil: "⚙",
    color: "#7FD9C5",
    colorSoft: "rgba(127, 217, 197, 0.22)",
    icon: Wrench,
    angle: 288,
    tagline: "machinist of deploys & pipelines",
    root: artificerRoot,
  },
];

// =====================================================
// RADIAL TREE LAYOUT
// Computes (x, y) positions for every skill node so the
// tree radiates outward from the root in the center.
// =====================================================
export type PositionedNode = {
  skill: Skill;
  x: number;
  y: number;
  depth: number;
  parentId: string | null;
};

export type TreeLayout = {
  nodes: PositionedNode[];
  edges: Array<{
    from: { x: number; y: number };
    to: { x: number; y: number };
    depth: number;
    parentId: string;
    childId: string;
  }>;
};

// Count total leaf descendants (for arc allocation)
function countLeaves(skill: Skill): number {
  if (!skill.children || skill.children.length === 0) return 1;
  return skill.children.reduce((a, c) => a + countLeaves(c), 0);
}

// Radii per depth level (root=0)
const RADII = [0, 170, 130, 100];

// Smaller radii used by the constellation view, where each class is a wedge
const CONSTELLATION_RADII = [0, 80, 62, 48];

export function layoutRadialTree(
  root: Skill,
  cx = 0,
  cy = 0,
  arcStart = 0,
  arcEnd = Math.PI * 2,
  radii: number[] = RADII,
): TreeLayout {
  const nodes: PositionedNode[] = [];
  const edges: TreeLayout["edges"] = [];

  function place(
    skill: Skill,
    x: number,
    y: number,
    a0: number,
    a1: number,
    depth: number,
    parentId: string | null,
  ) {
    nodes.push({ skill, x, y, depth, parentId });

    if (!skill.children || skill.children.length === 0) return;

    const totalLeaves = skill.children.reduce((a, c) => a + countLeaves(c), 0);
    const r = radii[depth + 1] ?? radii[radii.length - 1] ?? 80;

    let current = a0;
    for (const child of skill.children) {
      const childLeaves = countLeaves(child);
      const arc = (a1 - a0) * (childLeaves / totalLeaves);
      const midAngle = current + arc / 2;

      const childX = x + r * Math.cos(midAngle);
      const childY = y + r * Math.sin(midAngle);

      edges.push({
        from: { x, y },
        to: { x: childX, y: childY },
        depth: depth + 1,
        parentId: skill.id,
        childId: child.id,
      });

      // shrink the arc a bit so deeper levels don't overlap siblings of uncles
      const shrink = 0.85;
      const subArcStart = current + (arc * (1 - shrink)) / 2;
      const subArcEnd = current + (arc * (1 + shrink)) / 2;
      place(child, childX, childY, subArcStart, subArcEnd, depth + 1, skill.id);

      current += arc;
    }
  }

  place(root, cx, cy, arcStart, arcEnd, 0, null);

  return { nodes, edges };
}

// =====================================================
// CONSTELLATION — all 5 class trees fused, plus
// curated cross-class bridges revealing the
// "multi-class build" of the developer.
// =====================================================

export type SkillBridge = {
  fromId: string;
  toId: string;
  label: string;
  // optional — biases the curve so two bridges between the same
  // pair of clusters don't perfectly overlap
  curvature?: number;
};

export const skillBridges: SkillBridge[] = [
  // Same language, different domains
  { fromId: "ar-python", toId: "su-pycore", label: "Python", curvature: 0.18 },
  // Full-stack TypeScript
  { fromId: "il-ts", toId: "ar-node", label: "TypeScript", curvature: 0.22 },
  // Next.js ↔ Vercel — perfect host pair
  { fromId: "il-next", toId: "af-vercel", label: "Deploys", curvature: 0.16 },
  // FastAPI talks to SQL via SQLAlchemy
  {
    fromId: "ar-fastapi",
    toId: "av-sqlalchemy",
    label: "API ↔ DB",
    curvature: 0.2,
  },
  // ML deployed in containers
  {
    fromId: "su-pytorch",
    toId: "af-docker",
    label: "ML deploy",
    curvature: 0.24,
  },
  // Next.js apps love Postgres via Prisma
  { fromId: "il-next", toId: "av-prisma", label: "ORM", curvature: 0.14 },
  // GraphQL bridges Frontend & Backend
  { fromId: "il-react", toId: "ar-graphql", label: "GraphQL", curvature: 0.2 },
  // Supabase — DB-as-a-service used from the web
  { fromId: "il-react", toId: "av-supabase", label: "BaaS", curvature: 0.18 },
];

// Constellation positions every skill from every class on a single canvas.
// Each class root sits on a pentagon vertex around (0,0); its sub-tree
// fans outward into a 72° wedge.
export type ConstellationLayout = {
  nodes: PositionedNode[]; // every skill, including the 5 class roots
  edges: TreeLayout["edges"]; // intra-class parent → child
  bridges: Array<{
    fromNode: PositionedNode;
    toNode: PositionedNode;
    label: string;
    curvature: number;
    fromColor: string;
    toColor: string;
  }>;
  classRoots: Array<{
    catId: SkillCategory["id"];
    nodeId: string;
    x: number;
    y: number;
    color: string;
    colorSoft: string;
    angle: number;
  }>;
};

// Distance from canvas center to each class-root gem
const CLUSTER_ROOT_RADIUS = 220;
// Wedge width (radians) per class; pentagon sectors are 2π/5
const CLUSTER_ARC = ((Math.PI * 2) / 5) * 0.92;

export function layoutConstellation(): ConstellationLayout {
  const nodes: PositionedNode[] = [];
  const edges: TreeLayout["edges"] = [];
  const classRoots: ConstellationLayout["classRoots"] = [];

  for (const cat of skillCategories) {
    // 0° = top, CW. Convert to standard math angle (0 = +x, CCW).
    const rootMathAngle = ((cat.angle - 90) * Math.PI) / 180;
    const rx = CLUSTER_ROOT_RADIUS * Math.cos(rootMathAngle);
    const ry = CLUSTER_ROOT_RADIUS * Math.sin(rootMathAngle);

    // Tree grows outward from canvas center → centerAngle = rootMathAngle
    const arcStart = rootMathAngle - CLUSTER_ARC / 2;
    const arcEnd = rootMathAngle + CLUSTER_ARC / 2;

    const sub = layoutRadialTree(
      cat.root,
      rx,
      ry,
      arcStart,
      arcEnd,
      CONSTELLATION_RADII,
    );

    nodes.push(...sub.nodes);
    edges.push(...sub.edges);

    classRoots.push({
      catId: cat.id,
      nodeId: cat.root.id,
      x: rx,
      y: ry,
      color: cat.color,
      colorSoft: cat.colorSoft,
      angle: cat.angle,
    });
  }

  // Build a quick id → node map for bridge resolution
  const byId = new Map<string, PositionedNode>();
  for (const n of nodes) byId.set(n.skill.id, n);

  const bridges: ConstellationLayout["bridges"] = [];
  for (const b of skillBridges) {
    const fromNode = byId.get(b.fromId);
    const toNode = byId.get(b.toId);
    if (!fromNode || !toNode) continue;
    bridges.push({
      fromNode,
      toNode,
      label: b.label,
      curvature: b.curvature ?? 0.18,
      fromColor: fromNode.skill.color,
      toColor: toNode.skill.color,
    });
  }

  return { nodes, edges, bridges, classRoots };
}
