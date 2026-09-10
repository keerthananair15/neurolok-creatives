import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState, Page, SectionHeading } from "@/components/neurolok/media";
import { GenerationStages, useSimulatedRun } from "@/components/neurolok/generation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sampleFor } from "@/lib/studio";
import { supabase } from "@/integrations/supabase/client";
import { useTrends } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/trends")({
  head: () => ({
    meta: [
      { title: "Trends — Neurolok Studio" },
      { name: "description", content: "Recreate a viral video with your own product and compare it side by side." },
      { property: "og:title", content: "Trends — Neurolok Studio" },
      { property: "og:description", content: "Match a trend, keep your own brand." },
    ],
  }),
  component: TrendsPage,
});

type Variation = { label: string; image: string; note: string };

function TrendsPage() {
  const [title, setTitle] = useState("");
  const [reference, setReference] = useState("");
  const [variations, setVariations] = useState<Variation[]>([]);
  const { running, run } = useSimulatedRun(3400);
  const { data: saved } = useTrends();
  const qc = useQueryClient();

  async function recreate() {
    if (!title.trim()) return;
    const seed = title.trim();
    const built: Variation[] = [
      { label: "Closest match", image: sampleFor(seed, 0), note: "Same pacing and framing as the reference" },
      { label: "Your brand look", image: sampleFor(seed, 1), note: "Trend structure, your colours and product" },
      { label: "Bolder take", image: sampleFor(seed, 2), note: "Faster cuts and stronger contrast" },
    ];
    await run(async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        await supabase.from("trends").insert({
          user_id: data.user.id,
          title: seed,
          reference_name: reference.trim() || null,
          variations: built as unknown as never,
        });
      }
    });
    setVariations(built);
    qc.invalidateQueries({ queryKey: ["trends"] });
    toast.success("Three variations ready");
  }

  return (
    <Page>
      <SectionHeading
        title="Trends"
        subtitle="Point at a trending video, describe your product, and compare recreations side by side."
      />

      <div className="glass-strong space-y-4 rounded-3xl p-4">
        <div className="space-y-2">
          <Label htmlFor="t-ref">Reference video or trend name</Label>
          <Input
            id="t-ref"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Paste a link or name the trend"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="t-idea">What should it show instead?</Label>
          <Textarea
            id="t-idea"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="My cold coffee bottle, same energy, rainy street at night…"
            className="min-h-24 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={recreate} disabled={running || !title.trim()}>
            Recreate trend
          </Button>
        </div>
      </div>

      <div className="mt-10">
        {running && <GenerationStages label="Matching the trend" />}

        {!running && !variations.length && !saved?.length && (
          <EmptyState title="No trend recreations yet" hint="Name a trend above to see three takes side by side." />
        )}

        {!running && !!variations.length && (
          <div className="grid gap-4 sm:grid-cols-3">
            {variations.map((v) => (
              <div key={v.label} className="glass overflow-hidden rounded-2xl">
                <img src={v.image} alt={v.label} className="aspect-[9/16] w-full object-cover" />
                <div className="p-4">
                  <p className="text-sm text-foreground">{v.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{v.note}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {!running && !variations.length && !!saved?.length && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Earlier recreations</p>
            {saved.map((t) => (
              <button
                key={t.id}
                onClick={() => setVariations((t.variations as unknown as Variation[]) ?? [])}
                className="glass block w-full rounded-2xl p-4 text-left transition-colors hover:border-primary/30"
              >
                <p className="text-sm text-foreground">{t.title}</p>
                {t.reference_name && (
                  <p className="mt-0.5 text-xs text-muted-foreground">Ref: {t.reference_name}</p>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Page>
  );
}
