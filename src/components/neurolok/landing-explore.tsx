import { useState, useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  ArrowRight,
  Sparkles,
  Play,
  Zap,
  Layers,
  Users,
  Wand2,
  ChevronRight,
  ImageIcon,
  Video,
  Megaphone,
  Cpu,
  Check,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { SAMPLE_MEDIA } from "@/lib/studio";
import { supabase } from "@/integrations/supabase/client";

type ExploreCategory = "images" | "videos" | "campaigns" | "characters";

interface ExploreItem {
  id: string;
  category: ExploreCategory;
  title: string;
  prompt: string;
  mediaUrl: string;
  badge: string;
  model: string;
  aspectRatio: string;
  isVideo?: boolean;
  duration?: string;
}

const EXPLORE_ITEMS: ExploreItem[] = [
  {
    id: "ex-1",
    category: "images",
    title: "Editorial Cold Brew Commercial",
    prompt: "Cold coffee bottle resting on wet black marble, golden morning sunlight, condensation droplets, cinematic depth of field.",
    mediaUrl: SAMPLE_MEDIA[0]!,
    badge: "Image Studio",
    model: "Aurora Image v2",
    aspectRatio: "4:5",
  },
  {
    id: "ex-2",
    category: "videos",
    title: "High-Speed Highway Sequence",
    prompt: "Cinematic 8-second tracking shot of a matte-black electric superbike gliding along an ocean highway at twilight.",
    mediaUrl: SAMPLE_MEDIA[1]!,
    badge: "Cinematic Video",
    model: "Seedance Motion",
    aspectRatio: "16:9",
    isVideo: true,
    duration: "0:08",
  },
  {
    id: "ex-3",
    category: "campaigns",
    title: "Diwali Luxury Jewelry Suite",
    prompt: "A complete 6-piece festive luxury advertisement package for royal gold emerald neckwear set with ambient warm bokeh.",
    mediaUrl: SAMPLE_MEDIA[2]!,
    badge: "Ad Campaign",
    model: "Neurolok Multi-Suite",
    aspectRatio: "1:1",
  },
  {
    id: "ex-4",
    category: "characters",
    title: "Consistent Cyberpunk Protagonist",
    prompt: "Keyframe study of character 'Elena Vance' in emerald cyber jacket, three-quarter portrait, consistent facial geometry.",
    mediaUrl: SAMPLE_MEDIA[3]!,
    badge: "Avatar Model",
    model: "Character Lock v3",
    aspectRatio: "3:4",
  },
  {
    id: "ex-5",
    category: "images",
    title: "Minimalist Architectural Sanctuary",
    prompt: "Brutalist glass villa surrounded by dense rain-forested misty mountains, interior warm ambient glow, 8K ultra detail.",
    mediaUrl: SAMPLE_MEDIA[4]!,
    badge: "Architecture",
    model: "Aurora Image v2",
    aspectRatio: "16:9",
  },
  {
    id: "ex-6",
    category: "videos",
    title: "Neon Cybernetic Pulse",
    prompt: "Slow-motion close up of emerald energy flowing through liquid glass neural pathways, soft volumetric smoke overlay.",
    mediaUrl: SAMPLE_MEDIA[5]!,
    badge: "Visual Motion",
    model: "Kling Cinematic",
    aspectRatio: "9:16",
    isVideo: true,
    duration: "0:06",
  },
];

const EDITORIAL_SPREADS = [
  {
    title: "Architectural Sanctuary & Volumetric Light",
    category: "High-Detail Image",
    prompt: "Brutalist glass sanctuary nestled inside rain-forested misty mountains, golden hour interior ambient glow, ultra-photorealistic render.",
    image: SAMPLE_MEDIA[4]!,
    aspect: "21/9",
    tag: "Aurora Image v2",
  },
  {
    title: "Matte Black Superbike Twilight Glide",
    category: "Cinematic Motion",
    prompt: "8-second smooth camera tracking shot of electric superbike on empty coastal highway, volumetric twilight fog, 4K 60fps film cadence.",
    image: SAMPLE_MEDIA[1]!,
    aspect: "16/9",
    tag: "Seedance Motion v2.4",
  },
];

const FEATURES_LIST = [
  {
    icon: Wand2,
    title: "Plain Language Engine",
    description: "No complex prompt engineering or hidden tokens. Describe what you want in everyday conversation.",
  },
  {
    icon: Zap,
    title: "Real-Time Latent Render",
    description: "Watch glowing emerald neural matrix map intent into photorealistic rendering in real time.",
  },
  {
    icon: Users,
    title: "Reusable Characters",
    description: "Lock facial features and styling to generate consistent character keyframes across any scene.",
  },
  {
    icon: Layers,
    title: "Multi-Modal Campaign Suites",
    description: "Turn one single prompt into a cohesive multi-channel campaign with matched look and feel.",
  },
];

const PRICING_TIERS = [
  {
    name: "Creator",
    price: "₹499",
    period: "/month",
    description: "Ideal for individual designers and solo marketers.",
    credits: "200 credits/mo",
    features: [
      "Image Studio (Aurora v2)",
      "Standard Video Generation",
      "Export up to 4K resolution",
      "Community Support",
    ],
    highlight: false,
    cta: "Start Free Trial",
  },
  {
    name: "Pro Studio",
    price: "₹1,499",
    period: "/month",
    description: "For professional teams building full campaigns and videos.",
    credits: "800 credits/mo",
    features: [
      "Everything in Creator",
      "Reusable Character Engine",
      "Cinematic Video (Seedance & Kling)",
      "Multi-Asset Campaign Suites",
      "Priority Queue Rendering",
    ],
    highlight: true,
    cta: "Get Started with Pro",
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "Dedicated GPU clusters and custom model fine-tuning.",
    credits: "Custom credits",
    features: [
      "Unlimited Team Members",
      "Custom Brand Fine-Tuning",
      "Dedicated API & Webhooks",
      "SLA & Account Manager",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
];

export function LandingExplorePage() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState<ExploreCategory | "all">("all");
  const [promptInput, setPromptInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ExploreItem | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    });
  }, []);

  const filteredItems = activeCategory === "all"
    ? EXPLORE_ITEMS
    : EXPLORE_ITEMS.filter((item) => item.category === activeCategory);

  function handleStartCreating(idea?: string) {
    const targetIdea = idea || promptInput;
    if (isAuthenticated) {
      navigate({
        to: "/create",
        search: targetIdea ? { idea: targetIdea } : {},
      });
    } else {
      navigate({
        to: "/auth",
        search: targetIdea ? { demo: "true" } : { mode: "signup" },
      });
    }
  }

  function scrollToSection(id: string) {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <div className="relative min-h-screen bg-[#fafcfb] font-sans text-slate-900 selection:bg-emerald-500/20 selection:text-emerald-900">
      {/* SOFT EMERALD AMBIENT LIGHTING BACKGROUND */}
      <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-[15%] left-1/2 h-[700px] w-[1000px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.12),transparent_70%)] blur-3xl" />
        <div className="absolute top-[35%] -left-[10%] h-[600px] w-[600px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.08),transparent_70%)] blur-3xl" />
        <div className="absolute top-[65%] -right-[10%] h-[700px] w-[700px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.1),transparent_70%)] blur-3xl" />
      </div>

      {/* MINIMAL NAVBAR WITH HIGH CONTRAST LOGO */}
      <header className="sticky top-0 z-50 border-b border-emerald-500/10 bg-[#fafcfb]/90 backdrop-blur-2xl transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 sm:px-8">
          <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
            <Logo size={34} variant="light" />
          </Link>

          <nav className="hidden items-center gap-8 text-xs font-medium text-slate-700 md:flex">
            <button onClick={() => scrollToSection("about")} className="transition-colors hover:text-emerald-600">
              About
            </button>
            <button onClick={() => scrollToSection("features")} className="transition-colors hover:text-emerald-600">
              Features
            </button>
            <button onClick={() => scrollToSection("editorial")} className="transition-colors hover:text-emerald-600">
              Editorial
            </button>
            <button onClick={() => scrollToSection("explore")} className="transition-colors hover:text-emerald-600">
              Explore
            </button>
            <button onClick={() => scrollToSection("pricing")} className="transition-colors hover:text-emerald-600">
              Pricing
            </button>
          </nav>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <Button
                onClick={() => navigate({ to: "/create" })}
                className="h-10 rounded-full bg-emerald-600 px-5 text-xs font-medium text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700"
              >
                Go to Studio <ArrowRight className="ml-2 size-3.5" />
              </Button>
            ) : (
              <>
                <Link
                  to="/auth"
                  search={{ mode: "signin" }}
                  className="rounded-full px-4 py-2 text-xs font-medium text-slate-800 transition-colors hover:text-emerald-600"
                >
                  Log In
                </Link>
                <Link
                  to="/auth"
                  search={{ mode: "signup" }}
                  className="inline-flex h-9 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 text-xs font-medium text-emerald-800 shadow-sm transition-all hover:bg-emerald-600 hover:text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative z-10 mx-auto max-w-6xl px-6 pt-16 pb-20 text-center sm:px-8 sm:pt-24 sm:pb-24">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-medium text-emerald-800 backdrop-blur-md">
          <Sparkles className="size-3.5 text-emerald-600 animate-pulse" />
          <span>Neurolok AI Creative Engine v2.4</span>
        </div>

        <h1 className="mt-8 font-display text-5xl font-normal tracking-tight text-slate-900 sm:text-7xl md:text-8xl">
          Create <span className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-600 bg-clip-text text-transparent font-medium">Anything.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Turn your ideas into finished creative images, videos, ad campaigns and reusable characters.
          No complex prompt engineering — just describe your vision.
        </p>

        {/* Action CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => handleStartCreating()}
            className="flex h-12 items-center gap-2.5 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-8 text-xs font-medium text-white shadow-lg shadow-emerald-600/30 transition-all hover:shadow-xl hover:shadow-emerald-600/40 active:scale-[0.98]"
          >
            <span>Start Creating</span>
            <ArrowRight className="size-4" />
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("editorial")}
            className="flex h-12 items-center gap-2 rounded-full border border-emerald-500/30 bg-white/80 px-7 text-xs font-medium text-slate-800 shadow-sm backdrop-blur-md transition-all hover:bg-white hover:border-emerald-500/50"
          >
            <span>Explore Editorial Spread</span>
          </button>
        </div>

        {/* Interactive Trial Prompt Box */}
        <div className="mx-auto mt-12 max-w-2xl">
          <div className="relative flex flex-col items-center rounded-3xl border border-emerald-500/20 bg-white p-2 shadow-xl shadow-emerald-950/[0.05] backdrop-blur-2xl transition-all focus-within:border-emerald-500 focus-within:ring-4 focus-within:ring-emerald-500/10 sm:flex-row">
            <input
              type="text"
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder="e.g. Cold brew coffee bottle on wet black marble, golden morning light..."
              className="h-12 w-full bg-transparent px-4 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none sm:text-sm"
              onKeyDown={(e) => e.key === "Enter" && handleStartCreating()}
            />
            <button
              type="button"
              onClick={() => handleStartCreating()}
              className="flex h-11 w-full items-center justify-center gap-2 whitespace-nowrap rounded-2xl bg-slate-900 px-6 text-xs font-medium text-white shadow-md transition-all hover:bg-emerald-600 sm:w-auto"
            >
              <span>Try Prompt</span>
              <Wand2 className="size-3.5 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* EDITORIAL SPREAD SECTION WITH LARGE FULL-WIDTH IMAGE BANNERS */}
      <section id="editorial" className="relative z-10 border-t border-emerald-500/10 bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <div>
              <p className="text-[11px] uppercase tracking-[0.4em] text-emerald-400 font-semibold">
                Editorial Showcase
              </p>
              <h2 className="mt-3 font-display text-4xl font-normal text-white sm:text-6xl">
                Visions without limits
              </h2>
            </div>
            <p className="max-w-md text-xs leading-relaxed text-slate-400">
              Photorealistic stills, cinema movement, and character keyframe continuity rendered directly from plain language ideas.
            </p>
          </div>

          {/* Large Width 21:9 Hero Banner */}
          <div className="relative mt-16 overflow-hidden rounded-[2.5rem] border border-white/15 bg-slate-900 shadow-2xl">
            <div className="relative aspect-[21/9] w-full overflow-hidden">
              <img
                src={EDITORIAL_SPREADS[0]!.image}
                alt=""
                className="h-full w-full object-cover transition-transform duration-1000 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute top-6 left-6 flex items-center gap-3">
                <span className="rounded-full border border-emerald-400/40 bg-emerald-950/90 px-3.5 py-1 text-xs font-medium text-emerald-300 backdrop-blur-md">
                  {EDITORIAL_SPREADS[0]!.tag}
                </span>
                <span className="rounded-full border border-white/20 bg-black/60 px-3.5 py-1 text-xs text-white backdrop-blur-md">
                  21:9 Wide Editorial
                </span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 max-w-2xl text-left">
                <p className="text-xs uppercase tracking-widest text-emerald-400 font-medium">Editorial Feature</p>
                <h3 className="mt-2 font-display text-2xl font-normal text-white sm:text-4xl">
                  {EDITORIAL_SPREADS[0]!.title}
                </h3>
                <p className="mt-3 text-xs leading-relaxed text-slate-300 font-light">
                  "{EDITORIAL_SPREADS[0]!.prompt}"
                </p>
              </div>
            </div>
          </div>

          {/* Dual Large Format Showcase Spread */}
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            {EDITORIAL_SPREADS.map((item, idx) => (
              <div
                key={idx}
                className="group relative overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 p-3 shadow-xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-500/50"
              >
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[1.5rem]">
                  <img
                    src={item.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-950/80 px-3 py-1 text-[11px] text-emerald-300 backdrop-blur-md">
                      {item.category}
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5 right-5 text-left">
                    <h4 className="font-display text-xl font-normal text-white">{item.title}</h4>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-300">{item.prompt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 1: ABOUT NEUROLOK */}
      <section id="about" className="relative z-10 border-t border-emerald-500/10 bg-white/60 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600 font-semibold">About Neurolok</p>
              <h2 className="mt-3 font-display text-3xl font-normal text-slate-900 sm:text-5xl">
                Intelligence built for pure creative expression.
              </h2>
              <p className="mt-6 text-sm leading-relaxed text-slate-600 sm:text-base">
                Neurolok bridges human creativity with artificial intelligence. No complex prompt syntax, negative prompt lists, or seed math. Simply speak your idea in plain language and let our neural matrix translate it into high-frequency visuals, motion clips, and full multi-channel ad campaigns.
              </p>
              <div className="mt-8 grid grid-cols-2 gap-6 border-t border-slate-200/80 pt-6">
                <div>
                  <p className="font-display text-3xl font-light text-emerald-600">4.8x</p>
                  <p className="mt-1 text-xs text-slate-500">Faster Campaign Output</p>
                </div>
                <div>
                  <p className="font-display text-3xl font-light text-emerald-600">100%</p>
                  <p className="mt-1 text-xs text-slate-500">Plain Language Accuracy</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/10 via-white to-emerald-500/5 p-8 shadow-xl backdrop-blur-xl">
                <div className="flex items-center gap-4">
                  <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md shadow-emerald-600/30">
                    <Cpu className="size-6" />
                  </div>
                  <div>
                    <h4 className="font-display text-lg font-medium text-slate-900">Neural Latent Matrix</h4>
                    <p className="text-xs text-slate-500">Autonomous concept mapping</p>
                  </div>
                </div>
                <p className="mt-6 text-xs leading-relaxed text-slate-600">
                  Our custom multi-modal model automatically enhances framing, lighting balance, color grading, and texture depth while preserving your original artistic intent.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURES */}
      <section id="features" className="relative z-10 py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600 font-semibold">Core Capabilities</p>
            <h2 className="mt-3 font-display text-3xl font-normal text-slate-900 sm:text-5xl">
              Everything you need to create
            </h2>
          </div>

          <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES_LIST.map((feat, idx) => (
              <div
                key={idx}
                className="group rounded-3xl border border-emerald-500/15 bg-white p-7 shadow-lg shadow-emerald-950/[0.03] backdrop-blur-md transition-all duration-300 hover:-translate-y-1.5 hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-600/10"
              >
                <div className="flex size-12 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 shadow-sm">
                  <feat.icon className="size-6" />
                </div>
                <h3 className="mt-6 font-display text-lg font-medium text-slate-900">{feat.title}</h3>
                <p className="mt-2 text-xs leading-relaxed text-slate-600">{feat.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3: SHOWCASE / EXPLORE MATRIX */}
      <section id="explore" className="relative z-10 border-t border-emerald-500/10 bg-white/60 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600 font-semibold">
                Explore Formats
              </p>
              <h2 className="mt-2 font-display text-3xl font-normal text-slate-900 sm:text-4xl">
                What Neurolok creates
              </h2>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 shadow-sm">
              {[
                { id: "all", label: "All Formats" },
                { id: "images", label: "Images", icon: ImageIcon },
                { id: "videos", label: "Videos", icon: Video },
                { id: "campaigns", label: "Campaigns", icon: Megaphone },
                { id: "characters", label: "Characters", icon: Users },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id as ExploreCategory | "all")}
                  className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                    activeCategory === tab.id
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab.icon && <tab.icon className="size-3.5" />}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Grid Preview Cards */}
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelectedItem(item)}
                className="group relative cursor-pointer overflow-hidden rounded-3xl border border-slate-200/80 bg-white p-3 shadow-md transition-all duration-500 hover:-translate-y-1.5 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-600/10"
              >
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-950">
                  <img
                    src={item.mediaUrl}
                    alt={item.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80 transition-opacity group-hover:opacity-90" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="rounded-full border border-emerald-400/40 bg-emerald-950/80 px-2.5 py-1 text-[10px] font-medium text-emerald-300 backdrop-blur-md">
                      {item.badge}
                    </span>
                    <span className="rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] text-white/80 backdrop-blur-md">
                      {item.aspectRatio}
                    </span>
                  </div>

                  {item.isVideo && (
                    <span className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                      <Play className="size-3 fill-emerald-400 text-emerald-400" />
                      {item.duration}
                    </span>
                  )}

                  {/* Bottom Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 text-left">
                    <h3 className="font-display text-base font-medium text-white">{item.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-white/70">{item.prompt}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] text-emerald-400">
                      <span>{item.model}</span>
                      <span className="flex items-center gap-1 font-medium transition-transform group-hover:translate-x-1">
                        Try prompt <ChevronRight className="size-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5: SAMPLE PRICING */}
      <section id="pricing" className="relative z-10 border-t border-emerald-500/10 bg-white/60 py-24 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="text-center">
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-600 font-semibold">Simple Pricing</p>
            <h2 className="mt-3 font-display text-3xl font-normal text-slate-900 sm:text-5xl">
              Transparent credit plans
            </h2>
          </div>

          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {PRICING_TIERS.map((tier, idx) => (
              <div
                key={idx}
                className={`relative flex flex-col justify-between rounded-3xl p-8 transition-all ${
                  tier.highlight
                    ? "border-2 border-emerald-600 bg-white shadow-xl shadow-emerald-600/15"
                    : "border border-slate-200 bg-white/80 shadow-md"
                }`}
              >
                {tier.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-1 text-[10px] font-semibold text-white uppercase tracking-wider">
                    Most Popular
                  </span>
                )}
                <div>
                  <h3 className="font-display text-xl font-medium text-slate-900">{tier.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{tier.description}</p>

                  <div className="mt-6 flex items-baseline">
                    <span className="font-display text-4xl font-normal text-slate-900">{tier.price}</span>
                    <span className="text-xs text-slate-500">{tier.period}</span>
                  </div>
                  <p className="mt-1 text-xs font-semibold text-emerald-600">{tier.credits}</p>

                  <ul className="mt-8 space-y-3 text-xs text-slate-600">
                    {tier.features.map((f, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-2.5">
                        <Check className="size-4 text-emerald-600 shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartCreating()}
                  className={`mt-10 h-11 w-full rounded-full text-xs font-medium transition-all ${
                    tier.highlight
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/30 hover:bg-emerald-700"
                      : "border border-slate-300 bg-slate-50 text-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {tier.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6: CREATE WITH NEUROLOK CTA BANNER */}
      <section className="relative z-10 py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <div className="relative overflow-hidden rounded-[3rem] border border-emerald-500/30 bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 p-12 text-center shadow-2xl text-white">
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.3),transparent_70%)] blur-2xl"
            />
            <div className="relative z-10">
              <h2 className="font-display text-4xl font-normal sm:text-5xl">
                Create with <span className="text-emerald-400">Neurolok.</span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
                Bring an idea. Leave with finished work. Start turning your concepts into stunning creative assets now.
              </p>
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleStartCreating()}
                  className="flex h-12 items-center gap-2 rounded-full bg-emerald-500 px-8 text-xs font-medium text-slate-950 shadow-lg shadow-emerald-500/40 transition-all hover:bg-emerald-400 active:scale-[0.98]"
                >
                  <span>Start Creating Now</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative z-10 border-t border-slate-200 bg-white py-10">
        <div className="mx-auto max-w-7xl px-6 text-center text-xs text-slate-600 sm:px-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Logo size={28} variant="light" />
            <span>Neurolok AI Studio © 2026 — Plain language creative engine.</span>
            <span>Science · People · Possibilities</span>
          </div>
        </div>
      </footer>

      {/* Media Detail Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-emerald-500/30 bg-slate-900 p-6 text-white shadow-2xl">
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              ✕
            </button>
            <img src={selectedItem.mediaUrl} alt="" className="aspect-video w-full rounded-2xl object-cover" />
            <h3 className="mt-4 font-display text-xl text-white">{selectedItem.title}</h3>
            <p className="mt-2 text-xs leading-relaxed text-slate-300">{selectedItem.prompt}</p>
            <div className="mt-6 flex justify-end gap-3">
              <Button
                onClick={() => {
                  setSelectedItem(null);
                  handleStartCreating(selectedItem.prompt);
                }}
                className="rounded-full bg-emerald-500 text-xs font-medium text-slate-950 hover:bg-emerald-400"
              >
                Use prompt in Studio <ArrowRight className="ml-2 size-3.5" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
