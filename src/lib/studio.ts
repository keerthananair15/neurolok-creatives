import sample1 from "@/assets/sample-1.jpg";
import sample2 from "@/assets/sample-2.jpg";
import sample3 from "@/assets/sample-3.jpg";
import sample4 from "@/assets/sample-4.jpg";
import sample5 from "@/assets/sample-5.jpg";
import sample6 from "@/assets/sample-6.jpg";

/**
 * Sample media stands in for real model output in this build.
 * Everything else (records, actions, history) is real, so swapping this
 * module for live generation does not touch any screen.
 */
export const SAMPLE_MEDIA = [sample1, sample2, sample3, sample4, sample5, sample6];

export type CreationKind = "image" | "video" | "poster";
export type Mode = "pilot" | "director";

export const MODELS = [
  { id: "auto", label: "Neurolok Auto", hint: "Best fit chosen for you" },
  { id: "seedance", label: "Seedance", hint: "Motion-rich video" },
  { id: "kling", label: "Kling", hint: "Cinematic video" },
  { id: "aurora", label: "Aurora Image", hint: "High-detail stills" },
];

export const DIRECTOR_CONTROLS = {
  duration: ["4s", "6s", "8s", "10s"],
  quality: ["Standard", "High", "Ultra"],
  aspect: ["1:1", "16:9", "9:16", "4:5"],
  camera: ["Static", "Handheld", "Drone", "Gimbal"],
  angle: ["Eye level", "Low angle", "High angle", "Top down"],
  motion: ["Subtle", "Medium", "Dynamic"],
  style: ["Cinematic", "Documentary", "Editorial", "Anime", "Product"],
  lighting: ["Natural", "Studio", "Neon", "Golden hour", "Low key"],
} as const;

export const STAGES = [
  "Understanding your idea",
  "Enhancing creative direction",
  "Choosing the right model",
  "Generating your result",
] as const;

export const COSTS: Record<CreationKind, number> = { image: 12, video: 60, poster: 18 };

function hash(text: string): number {
  let h = 0;
  for (let i = 0; i < text.length; i++) h = (h * 31 + text.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic sample pick — safe at module and render time. */
export function sampleFor(seed: string, index = 0): string {
  return SAMPLE_MEDIA[(hash(seed) + index * 3) % SAMPLE_MEDIA.length] ?? SAMPLE_MEDIA[0]!;
}

/** The "prompt enhancement layer" preview shown behind Details. */
export function enhancePrompt(idea: string, kind: CreationKind, settings: Record<string, string> = {}) {
  const trimmed = idea.trim() || "a striking creative visual";
  const style = settings["style"];
  const lighting = settings["lighting"];
  const look = style ? `${style.toLowerCase()} treatment` : "cinematic treatment";
  const light = lighting ? `${lighting.toLowerCase()} lighting` : "controlled lighting";
  const framing = kind === "video" ? "smooth camera movement, 24fps film cadence" : "sharp focus, editorial framing";
  return `${trimmed} — ${look}, ${light}, ${framing}, premium color grade, rich contrast, high detail.`;
}

export function suggestModel(kind: CreationKind, idea: string) {
  if (kind === "video") return hash(idea) % 2 === 0 ? "Seedance" : "Kling";
  return "Aurora Image";
}

export const EXAMPLE_IDEAS = [
  "A cold coffee bottle on wet stone, cinematic morning light",
  "A 7-second cinematic shot of a bike on an empty highway",
  "Festive Diwali sale poster for a jewellery brand",
  "Portrait of a founder for a magazine cover",
];

export function inr(credits: number) {
  return `₹${(credits * 0.4).toFixed(0)}`;
}
