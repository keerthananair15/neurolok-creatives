import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Clapperboard, Megaphone, TrendingUp, Users } from "lucide-react";
import { useState } from "react";
import { Composer, emptyComposer } from "@/components/neurolok/composer";
import { MediaGrid, MediaTile, Page, SectionHeading } from "@/components/neurolok/media";
import { EXAMPLE_IDEAS } from "@/lib/studio";
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
  { to: "/campaigns", label: "Full ad campaign", hint: "From one product photo", icon: Megaphone },
  { to: "/storyboard", label: "Storyboard a film", hint: "Scene by scene", icon: Clapperboard },
  { to: "/characters", label: "Reusable character", hint: "Same face every time", icon: Users },
  { to: "/trends", label: "Recreate a trend", hint: "Match a viral video", icon: TrendingUp },
] as const;

function HomePage() {
  const navigate = useNavigate();
  const [value, setValue] = useState(emptyComposer);
  const { data: profile } = useProfile();
  const { data: recent } = useAssets({ limit: 8 });

  const first = profile?.display_name?.split(" ")[0];

  function start() {
    navigate({
      to: "/create",
      search: { idea: value.idea, kind: value.kind, mode: value.mode },
    });
  }

  return (
    <Page>
      <div className="ambient-glow mb-10">
        <h1 className="font-display text-3xl leading-tight text-foreground sm:text-4xl">
          {first ? `What are we making, ${first}?` : "What are we making today?"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Describe it in your own words. Neurolok handles the rest.
        </p>

        <div className="mt-6">
          <Composer value={value} onChange={setValue} onSubmit={start} />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {EXAMPLE_IDEAS.map((idea) => (
            <button
              key={idea}
              onClick={() => setValue({ ...value, idea })}
              className="rounded-full border border-border/60 px-3.5 py-1.5 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map(({ to, label, hint, icon: Icon }) => (
          <Link
            key={to}
            to={to}
            className="glass group rounded-2xl p-4 transition-colors hover:border-primary/30"
          >
            <Icon className="size-5 text-primary" strokeWidth={1.6} />
            <p className="mt-3 text-sm text-foreground">{label}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">{hint}</p>
          </Link>
        ))}
      </div>

      {!!recent?.length && (
        <>
          <SectionHeading
            title="Recent work"
            right={
              <Link to="/library" className="text-sm text-primary hover:underline">
                View library
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
    </Page>
  );
}
