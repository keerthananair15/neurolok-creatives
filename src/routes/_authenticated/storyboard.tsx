import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { EmptyState, Page, SectionHeading } from "@/components/neurolok/media";
import { GenerationStages, useSimulatedRun } from "@/components/neurolok/generation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { sampleFor } from "@/lib/studio";
import { supabase } from "@/integrations/supabase/client";
import { useStoryboards } from "@/lib/db";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/_authenticated/storyboard")({
  head: () => ({
    meta: [
      { title: "Storyboard — Neurolok Studio" },
      { name: "description", content: "Turn one concept into a scene-by-scene storyboard with a prompt per shot." },
      { property: "og:title", content: "Storyboard — Neurolok Studio" },
      { property: "og:description", content: "Plan every shot before you generate a frame." },
    ],
  }),
  component: StoryboardPage,
});

type Scene = { title: string; description: string; prompt: string; image: string };

function buildScenes(concept: string): Scene[] {
  const beats = [
    ["Opening", "Establish the world and mood"],
    ["Build", "Introduce the subject in motion"],
    ["Turn", "The moment that grabs attention"],
    ["Payoff", "Hero shot with the product or face"],
    ["Close", "Final frame that lingers"],
  ];
  return beats.map(([title, description], i) => ({
    title: title!,
    description: description!,
    prompt: `${description!.toLowerCase()} for "${concept}", cinematic framing, consistent lighting and color grade across shots`,
    image: sampleFor(concept, i),
  }));
}

function StoryboardPage() {
  const [concept, setConcept] = useState("");
  const [scenes, setScenes] = useState<Scene[]>([]);
  const { running, run } = useSimulatedRun(3200);
  const { data: saved } = useStoryboards();
  const qc = useQueryClient();

  async function generate() {
    if (!concept.trim()) return;
    const built = buildScenes(concept.trim());
    await run(async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("storyboards").insert({
          user_id: data.user.id,
          title: concept.trim().slice(0, 60),
          concept: concept.trim(),
          scenes: built as unknown as never,
        });
      }
    });
    setScenes(built);
    qc.invalidateQueries({ queryKey: ["storyboards"] });
    toast.success("Storyboard ready");
  }

  return (
    <Page>
      <SectionHeading
        title="Storyboard"
        subtitle="Describe the film once. Neurolok breaks it into shots, each with its own ready-to-use prompt."
      />

      <div className="glass-strong rounded-3xl p-4">
        <Textarea
          value={concept}
          onChange={(e) => setConcept(e.target.value)}
          placeholder="A 30-second ad for a cold coffee brand set in a rainy city at night…"
          className="min-h-24 resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
        />
        <div className="flex justify-end">
          <Button onClick={generate} disabled={running || !concept.trim()}>
            Build storyboard
          </Button>
        </div>
      </div>

      <div className="mt-10">
        {running && <GenerationStages label="Breaking your film into shots" />}

        {!running && !scenes.length && !saved?.length && (
          <EmptyState
            title="No storyboards yet"
            hint="Write your concept above and Neurolok will lay out the shots for you."
          />
        )}

        {!running && !!scenes.length && (
          <div className="space-y-4">
            {scenes.map((s, i) => (
              <div key={s.title} className="glass flex flex-col gap-4 rounded-2xl p-4 sm:flex-row">
                <img
                  src={s.image}
                  alt={s.title}
                  className="h-40 w-full rounded-xl object-cover sm:w-56"
                />
                <div className="min-w-0">
                  <p className="text-xs text-primary">Shot {i + 1}</p>
                  <p className="font-display text-lg text-foreground">{s.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
                  <p className="mt-3 rounded-xl bg-secondary/40 p-3 text-xs leading-relaxed text-muted-foreground">
                    {s.prompt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!running && !scenes.length && !!saved?.length && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Earlier storyboards</p>
            {saved.map((s) => (
              <button
                key={s.id}
                onClick={() => setScenes((s.scenes as unknown as Scene[]) ?? [])}
                className="glass block w-full rounded-2xl p-4 text-left transition-colors hover:border-primary/30"
              >
                <p className="text-sm text-foreground">{s.concept}</p>
              </button>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
