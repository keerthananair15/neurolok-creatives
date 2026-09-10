import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { EmptyState, MediaGrid, MediaTile, Page, SectionHeading } from "@/components/neurolok/media";
import { GenerationStages, useSimulatedRun } from "@/components/neurolok/generation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sampleFor } from "@/lib/studio";
import { supabase } from "@/integrations/supabase/client";
import { useCampaignAssets, useCampaigns, useCreateAssets, type Asset } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/campaigns")({
  head: () => ({
    meta: [
      { title: "Campaigns — Neurolok Studio" },
      { name: "description", content: "One product photo becomes image variants, ad concepts, videos and posters." },
      { property: "og:title", content: "Campaigns — Neurolok Studio" },
      { property: "og:description", content: "A full ad campaign from a single brief." },
    ],
  }),
  component: CampaignsPage,
});

const CONCEPTS = ["Bold hero", "Lifestyle moment", "Studio product", "Festive offer"];

function CampaignsPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [brief, setBrief] = useState("");
  const [activeId, setActiveId] = useState<string | null>(null);
  const { running, run } = useSimulatedRun(4200);
  const { data: campaigns } = useCampaigns();
  const { data: assets } = useCampaignAssets(activeId);
  const createAssets = useCreateAssets();
  const qc = useQueryClient();

  async function build() {
    if (!brief.trim()) return;
    const seed = brief.trim();
    const id = await run(async () => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error("Not signed in");
      const { data: campaign, error } = await supabase
        .from("campaigns")
        .insert({
          user_id: user.user.id,
          name: name.trim() || seed.slice(0, 40),
          brief: seed,
          concepts: CONCEPTS as unknown as never,
        })
        .select()
        .single();
      if (error) throw error;

      const rows = [
        ...Array.from({ length: 4 }, (_, i) => ({
          kind: "image",
          media_url: sampleFor(`${seed}img`, i),
          prompt: `Image variant ${i + 1} — ${seed}`,
          source: "campaign",
          campaign_id: campaign.id,
        })),
        ...CONCEPTS.map((c, i) => ({
          kind: "image",
          media_url: sampleFor(`${seed}concept`, i),
          prompt: `${c} ad concept — ${seed}`,
          source: "campaign",
          campaign_id: campaign.id,
        })),
        ...Array.from({ length: 2 }, (_, i) => ({
          kind: "video",
          media_url: sampleFor(`${seed}video`, i),
          prompt: `Ad video ${i + 1} — ${seed}`,
          source: "campaign",
          campaign_id: campaign.id,
        })),
        ...Array.from({ length: 2 }, (_, i) => ({
          kind: "poster",
          media_url: sampleFor(`${seed}poster`, i),
          prompt: `Product poster ${i + 1} — ${seed}`,
          source: "campaign",
          campaign_id: campaign.id,
        })),
      ];
      await createAssets.mutateAsync(rows);
      return campaign.id as string;
    });

    setActiveId(id);
    setBrief("");
    setName("");
    qc.invalidateQueries({ queryKey: ["campaigns"] });
    toast.success("Campaign ready — 12 assets created");
  }

  const groups: [string, Asset[]][] = [
    ["Image variants", (assets ?? []).filter((a) => a.prompt.startsWith("Image variant"))],
    ["Ad concepts", (assets ?? []).filter((a) => a.prompt.includes("ad concept"))],
    ["Videos", (assets ?? []).filter((a) => a.kind === "video")],
    ["Posters", (assets ?? []).filter((a) => a.kind === "poster")],
  ];

  return (
    <Page>
      <SectionHeading
        title="Campaign engine"
        subtitle="Describe the product and the offer. Neurolok returns variants, ad concepts, videos and posters in one pass."
      />

      <div className="glass-strong space-y-4 rounded-3xl p-4">
        <div className="space-y-2">
          <Label htmlFor="cmp-name">Campaign name (optional)</Label>
          <Input id="cmp-name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cmp-brief">What are we promoting?</Label>
          <Textarea
            id="cmp-brief"
            value={brief}
            onChange={(e) => setBrief(e.target.value)}
            placeholder="A matte black skincare bottle, Diwali offer, premium and calm tone…"
            className="min-h-24 resize-none"
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={build} disabled={running || !brief.trim()}>
            Build campaign
          </Button>
        </div>
      </div>

      <div className="mt-10">
        {running && <GenerationStages label="Building your campaign" />}

        {!running && !activeId && (
          campaigns?.length ? (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">Your campaigns</p>
              {campaigns.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className="glass block w-full rounded-2xl p-4 text-left transition-colors hover:border-primary/30"
                >
                  <p className="text-sm text-foreground">{c.name}</p>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{c.brief}</p>
                </button>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No campaigns yet"
              hint="Write a short brief above and you'll get a full set of ad-ready assets."
            />
          )
        )}

        {!running && activeId && (
          <div className="space-y-10">
            <Button variant="ghost" size="sm" onClick={() => setActiveId(null)}>
              ← All campaigns
            </Button>
            {groups.map(([title, items]) =>
              items.length ? (
                <div key={title}>
                  <p className="mb-3 font-display text-lg text-foreground">{title}</p>
                  <MediaGrid>
                    {items.map((a) => (
                      <MediaTile
                        key={a.id}
                        asset={a}
                        onClick={() => navigate({ to: "/asset/$assetId", params: { assetId: a.id } })}
                      />
                    ))}
                  </MediaGrid>
                </div>
              ) : null,
            )}
          </div>
        )}
      </div>
    </Page>
  );
}
