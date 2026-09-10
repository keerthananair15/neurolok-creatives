import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Sparkles, Wand2, X } from "lucide-react";
import { toast } from "sonner";
import { Composer, emptyComposer, type ComposerValue } from "@/components/neurolok/composer";
import { GenerationStages, useSimulatedRun } from "@/components/neurolok/generation";
import { MediaGrid, MediaTile, Page } from "@/components/neurolok/media";
import { Button } from "@/components/ui/button";
import { COSTS, enhancePrompt, sampleFor, suggestModel, type CreationKind, type Mode } from "@/lib/studio";
import { spendCredits, useCharacters, useCreateAssets, useProfile, type Asset } from "@/lib/db";

type Search = {
  idea?: string | undefined;
  kind?: CreationKind | undefined;
  mode?: Mode | undefined;
};

export const Route = createFileRoute("/_authenticated/create")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    idea: typeof search["idea"] === "string" ? search["idea"] : undefined,
    kind: search["kind"] === "video" ? "video" : search["kind"] === "image" ? "image" : undefined,
    mode: search["mode"] === "director" ? "director" : search["mode"] === "pilot" ? "pilot" : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Create — Neurolok Studio" },
      { name: "description", content: "One workspace to create images and videos from plain language." },
      { property: "og:title", content: "Create — Neurolok Studio" },
      { property: "og:description", content: "Describe it once. Refine as you go." },
    ],
  }),
  component: CreatePage,
});

function CreatePage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [value, setValue] = useState<ComposerValue>({
    ...emptyComposer,
    idea: search.idea ?? "",
    kind: search.kind ?? "image",
    mode: search.mode ?? "pilot",
  });
  const [results, setResults] = useState<Asset[]>([]);
  const [refs, setRefs] = useState<string[]>([]);
  const { running, run } = useSimulatedRun();
  const createAssets = useCreateAssets();
  const { data: profile } = useProfile();
  const { data: characters } = useCharacters();

  const cost = COSTS[value.kind as CreationKind];
  const enhanced = enhancePrompt(value.idea, value.kind, value.settings);
  const model = suggestModel(value.kind, value.idea);
  const autoStart = !!search.idea;

  async function generate(prompt = value.idea) {
    if (!prompt.trim()) return;
    const seed = `${prompt}|${Date.now()}`;
    const created = await run(async () => {
      const rows = Array.from({ length: value.kind === "video" ? 2 : 4 }, (_, i) => ({
        kind: value.kind,
        media_url: sampleFor(seed, i),
        prompt,
        enhanced_prompt: enhancePrompt(prompt, value.kind, value.settings),
        mode: value.mode,
        model,
        settings: value.settings,
        credits_used: cost,
        source: "create",
      }));
      const inserted = await createAssets.mutateAsync(rows);
      await spendCredits(cost);
      return inserted;
    });
    setResults(created);
    toast.success(`${created.length} results ready`);
  }

  useEffect(() => {
    if (autoStart && !results.length && !running) {
      void generate(search.idea!);
      navigate({ to: "/create", search: {}, replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Page>
      <div className="mb-6 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
        <span className="glass rounded-full px-3 py-1.5">
          {profile?.credits ?? 0} credits left
        </span>
        <span className="glass rounded-full px-3 py-1.5">
          This {value.kind} costs {cost}
        </span>
        <span className="glass rounded-full px-3 py-1.5">Model: {model}</span>
      </div>

      {!!refs.length && (
        <div className="mb-4 flex flex-wrap gap-2">
          {refs.map((r) => (
            <span
              key={r}
              className="inline-flex items-center gap-2 rounded-full bg-secondary/70 py-1 pl-1 pr-3 text-xs text-foreground"
            >
              <img src={r} alt="" className="size-6 rounded-full object-cover" />
              Reference
              <button onClick={() => setRefs(refs.filter((x) => x !== r))} aria-label="Remove reference">
                <X className="size-3.5 text-muted-foreground" />
              </button>
            </span>
          ))}
        </div>
      )}

      <Composer value={value} onChange={setValue} onSubmit={() => generate()} busy={running} />

      {value.idea.trim() && (
        <details className="glass mt-3 rounded-2xl px-4 py-3">
          <summary className="cursor-pointer text-xs text-muted-foreground">
            See how Neurolok is reading your idea
          </summary>
          <p className="mt-3 text-sm leading-relaxed text-foreground">{enhanced}</p>
        </details>
      )}

      {!!characters?.length && (
        <div className="mt-4">
          <p className="mb-2 text-xs text-muted-foreground">Use a saved character</p>
          <div className="flex flex-wrap gap-2">
            {characters.slice(0, 8).map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  if (c.image_url && !refs.includes(c.image_url)) setRefs([...refs, c.image_url]);
                  setValue({ ...value, idea: `${value.idea} featuring ${c.name}`.trim() });
                }}
                className="inline-flex items-center gap-2 rounded-full border border-border/60 py-1 pl-1 pr-3 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                {c.image_url && <img src={c.image_url} alt="" className="size-6 rounded-full object-cover" />}
                {c.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10">
        {running && <GenerationStages label={`Creating your ${value.kind}`} />}

        {!running && !results.length && (
          <div className="flex flex-col items-center py-20 text-center">
            <Sparkles className="size-6 text-primary" strokeWidth={1.5} />
            <p className="mt-4 font-display text-lg text-foreground">Your results appear here</p>
            <p className="mt-1.5 max-w-sm text-sm text-muted-foreground">
              Write one sentence above. You can refine it after seeing the first attempt.
            </p>
          </div>
        )}

        {!running && !!results.length && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="font-display text-lg text-foreground">Your results</p>
              <Button variant="ghost" size="sm" onClick={() => generate()} className="gap-2">
                <Wand2 className="size-4" /> Try again
              </Button>
            </div>
            <MediaGrid>
              {results.map((a) => (
                <MediaTile
                  key={a.id}
                  asset={a}
                  onClick={() => navigate({ to: "/asset/$assetId", params: { assetId: a.id } })}
                />
              ))}
            </MediaGrid>
            <p className="mt-6 text-center text-xs text-muted-foreground">
              Not quite right? Just tell Neurolok what to change above — it keeps this result as context.
            </p>
          </>
        )}
      </div>
    </Page>
  );
}
