import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowRight, Clapperboard, ImageIcon, Megaphone, Play, TrendingUp, Users, Video } from "lucide-react";
import { useState } from "react";
import { Composer, emptyComposer } from "@/components/neurolok/composer";
import { MediaGrid, MediaTile, Page, SectionHeading } from "@/components/neurolok/media";
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

const QUICK = [
  {
    to: "/create",
    label: "Create Image",
    hint: "Stunning visuals from your ideas.",
    icon: ImageIcon,
    art: 0,
  },
  { to: "/create", label: "Create Video", hint: "Cinematic videos in seconds.", icon: Video, art: 1 },
  {
    to: "/campaigns",
    label: "Create Campaign",
    hint: "One product. A complete campaign.",
    icon: Megaphone,
    art: 2,
  },
  {
    to: "/storyboard",
    label: "Create Storyboard",
    hint: "Turn your concept into a visual story.",
    icon: Clapperboard,
    art: 3,
  },
] as const;

const MORE = [
  { to: "/characters", label: "Reusable characters", icon: Users },
  { to: "/trends", label: "Recreate a trend", icon: TrendingUp },
] as const;

function HeroStack() {
  return (
    <div className="relative hidden h-[420px] lg:block" aria-hidden>
      <div className="pointer-events-none absolute -right-10 top-4 size-[420px] rounded-full bg-[radial-gradient(closest-side,var(--glow),transparent)] blur-2xl" />

      <figure className="absolute left-0 top-6 w-[44%] rotate-[-4deg] overflow-hidden rounded-3xl border border-white/10 opacity-70 shadow-[0_30px_80px_-40px_oklch(0_0_0/80%)] transition-transform duration-700 hover:rotate-[-2deg]">
        <img src={SAMPLE_MEDIA[2]} alt="" className="aspect-[3/4] w-full object-cover" loading="lazy" />
      </figure>

      <figure className="absolute right-0 top-0 w-[56%] overflow-hidden rounded-[2rem] border border-white/12 shadow-[0_50px_120px_-50px_oklch(0.84_0.21_150/45%)]">
        <img src={SAMPLE_MEDIA[1]} alt="" className="aspect-[4/5] w-full object-cover" loading="lazy" />
        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-5 pt-16">
          <p className="font-display text-xs uppercase leading-5 tracking-[0.32em] text-foreground/90">
            Visions without limits
          </p>
        </figcaption>
      </figure>

      <figure className="glass absolute bottom-2 left-2 w-[46%] overflow-hidden rounded-3xl p-1.5">
        <img
          src={SAMPLE_MEDIA[4]}
          alt=""
          className="aspect-[16/10] w-full rounded-[1.35rem] object-cover"
          loading="lazy"
        />
        <span className="absolute bottom-4 left-4 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[11px] text-foreground backdrop-blur-md">
          <Play className="size-3 fill-primary text-primary" /> 0:08
        </span>
      </figure>

    </div>
  );
}

function HomePage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(emptyComposer);
  const { data: profile } = useProfile();
  const { data: recent } = useAssets({ limit: 8 });

  const first = profile?.display_name?.split(" ")[0];

  function start(kind?: "image" | "video") {
    navigate({
      to: "/create",
      search: { idea: value.idea, kind: kind ?? value.kind, mode: value.mode },
    });
  }

  return (
    <Page>
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
            Turn your ideas into stunning images, videos and campaigns. No complex prompts — just
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

        <HeroStack />
      </section>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {QUICK.map(({ to, label, hint, icon: Icon, art }) => (
          <Link key={label} to={to} className="card-premium edge-light group overflow-hidden">
            <div className="flex items-stretch">
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <Icon className="size-[18px] text-primary" strokeWidth={1.6} />
                  <p className="mt-3 whitespace-nowrap font-display text-[0.95rem] text-foreground">
                    {label}
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{hint}</p>
                </div>
                <span className="mt-5 inline-flex size-8 items-center justify-center rounded-full border border-border/70 text-muted-foreground transition-all duration-300 group-hover:border-primary/50 group-hover:text-primary">
                  <ArrowRight className="size-4" />
                </span>
              </div>
              <div className="relative w-[32%] shrink-0 overflow-hidden">
                <img
                  src={SAMPLE_MEDIA[art]}
                  alt=""
                  aria-hidden
                  loading="lazy"
                  className="h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90"
                />
                <span className="absolute inset-0 bg-gradient-to-r from-card via-card/40 to-transparent" />
              </div>
            </div>

          </Link>
        ))}
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

      {!!recent?.length && (
        <>
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
            {recent.map((a) => (
              <MediaTile
                key={a.id}
                asset={a}
                onClick={() => navigate({ to: "/asset/$assetId", params: { assetId: a.id } })}
              />
            ))}
          </MediaGrid>
        </>
      )}

      <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-border/50 pt-6 text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
        <span>Create · Explore · Evolve</span>
        <span>For creators who see more</span>
      </footer>
    </Page>
  );
}
