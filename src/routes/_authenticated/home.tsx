import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, ImageIcon, Megaphone, Play, TrendingUp, Users, Video, Wand2, Sparkles } from "lucide-react";
import { useState } from "react";
import { Composer, emptyComposer } from "@/components/neurolok/composer";
import { MediaGrid, MediaTile, Page, SectionHeading } from "@/components/neurolok/media";
import { InteractiveNeuralSphere } from "@/components/neurolok/interactive-neural-sphere";
import { EXAMPLE_IDEAS, SAMPLE_MEDIA } from "@/lib/studio";
import { useAssets, useProfile } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/home")({
  head: () => ({
    meta: [
      { title: "Home — Neurolok Studio" },
      { name: "description", content: "Start a new creation, revisit recent work and jump into campaigns." },
      { property: "og:title", content: "Home — Neurolok Studio" },
      { property: "og:description", content: "Your creative launchpad." },
    ],
  }),
  component: HomePage,
});

const MAJOR_CREATION_CARDS = [
  {
    to: "/create",
    label: "Create Image",
    hint: "Generate ultra-high definition photorealistic visual stills, portraits, and concept art from plain language.",
    icon: ImageIcon,
    badge: "Image Studio",
    cta: "Start Image",
    art: 0,
  },
  {
    to: "/create",
    label: "Create Video",
    hint: "Synthesize cinematic motion sequences and camera moves with state-of-the-art video rendering.",
    icon: Video,
    badge: "Cinematic Motion",
    cta: "Start Video",
    art: 1,
  },
  {
    to: "/campaigns",
    label: "Create Campaign",
    hint: "Transform one product concept into a complete multi-channel advertisement package and asset suite.",
    icon: Megaphone,
    badge: "Multi-Asset Suite",
    cta: "Launch Campaign",
    art: 2,
  },
  {
    to: "/storyboard",
    label: "Create Storyboard",
    hint: "Turn script concepts and narrative ideas into scene-by-scene visual storyboards.",
    icon: Clapperboard,
    badge: "Narrative Flow",
    cta: "Build Storyboard",
    art: 3,
  },
] as const;

const MORE = [
  { to: "/characters", label: "Reusable characters", icon: Users },
  { to: "/trends", label: "Recreate a trend", icon: TrendingUp },
] as const;

function HomePage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(emptyComposer);
  const { data: profile } = useProfile();
  const { data: recent } = useAssets({ limit: 8 });
  const recentCreations = recent?.length
    ? recent
    : SAMPLE_MEDIA.slice(0, 4).map((media_url, index) => ({
      id: `sample-${index}`,
      media_url,
      prompt: "Neurolok sample creation",
      kind: index === 0 ? ("video" as const) : ("image" as const),
    }));

  const first = profile?.display_name?.split(" ")[0];

  function start(kind?: "image" | "video") {
    navigate({
      to: "/create",
      search: { idea: value.idea, kind: kind ?? value.kind, mode: value.mode },
    });
  }

  return (
    <Page>
      {/* HERO SECTION WITH INTERACTIVE 3D NEURAL SPHERE */}
      <section className="ambient-glow mb-14 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-muted-foreground">
            Ideas into reality
          </p>
          <h1 className="mt-5 font-display text-[2.6rem] leading-[1.03] tracking-tight text-foreground sm:text-6xl">
            What are you
            <br />
            <span className="text-gradient-green">creating</span>{" "}
            {first ? `today, ${first}?` : "today?"}
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
            Turn your ideas into finished images, videos and campaigns. No complex prompts — just
            describe it.
          </p>

          <div className="mt-7">
            <Composer value={value} onChange={setValue} onSubmit={() => start()} />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {EXAMPLE_IDEAS.map((idea) => (
              <button
                key={idea}
                onClick={() => setValue({ ...value, idea })}
                className="rounded-full border border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-all duration-300 hover:border-primary/40 hover:text-foreground"
              >
                {idea}
              </button>
            ))}
          </div>
        </div>

        {/* Replaced static collage with Interactive 3D Neural Sphere */}
        <InteractiveNeuralSphere />
      </section>

      {/* 2 x 2 GRID OF LARGE PREMIUM CREATION CARDS */}
      <div className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Creation Tools</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {MAJOR_CREATION_CARDS.map(({ to, label, hint, icon: Icon, badge, cta, art }) => (
            <Link
              key={label}
              to={to}
              className="card-premium liquid-hover group relative overflow-hidden rounded-[2rem] border border-border/80 bg-card p-6 shadow-md shadow-slate-200/50 dark:border-primary/20 dark:bg-surface/60 dark:shadow-none sm:p-7"
            >
              {/* Background Art Preview Overlay */}
              <div className="absolute top-0 right-0 h-full w-[45%] overflow-hidden opacity-20 transition-all duration-700 group-hover:scale-105 group-hover:opacity-40 dark:opacity-30 dark:group-hover:opacity-50">
                <img src={SAMPLE_MEDIA[art]} alt="" className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/80 to-transparent" />
              </div>

              <div className="relative z-10 flex flex-col justify-between h-full min-h-[160px]">
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex size-11 items-center justify-center rounded-2xl border border-primary/40 bg-primary/10 text-primary shadow-sm">
                      <Icon className="size-5" />
                    </div>
                    <span className="rounded-full border border-border bg-secondary/90 px-3 py-1 text-[10px] font-medium text-foreground backdrop-blur-md">
                      {badge}
                    </span>
                  </div>

                  <h3 className="mt-5 font-display text-xl font-medium text-foreground">{label}</h3>
                  <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground font-normal">{hint}</p>
                </div>

                <div className="mt-6 flex items-center justify-between pt-2">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-primary transition-transform group-hover:translate-x-1">
                    {cta} <ArrowRight className="size-4" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mb-14 flex flex-wrap gap-3">
        {MORE.map(({ to, label, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="hover-lift inline-flex items-center gap-2 rounded-full border border-border/60 px-4 py-2 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <Icon className="size-4 text-primary" strokeWidth={1.6} /> {label}
          </Link>
        ))}
      </div>

      <section className="creation-reveal">
        <SectionHeading
          title="Recent creations"
          right={
            <Link
              to="/library"
              className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          }
        />
        <MediaGrid>
          {recentCreations.map((asset) => {
            const isSample = asset.id.startsWith("sample-");
            return (
              <div key={asset.id} className="creation-item">
                <MediaTile
                  asset={asset}
                  onClick={
                    isSample
                      ? () => navigate({ to: "/create" })
                      : () => navigate({ to: "/asset/$assetId", params: { assetId: asset.id } })
                  }
                />
              </div>
            );
          })}
        </MediaGrid>
      </section>

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Create · Explore · Evolve</span>
        <span>For creators who see more</span>
      </footer>
    </Page>
  );
}
