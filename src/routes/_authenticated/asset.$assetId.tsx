import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Download, Maximize2, RefreshCw, Sparkles, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Page } from "@/components/neurolok/media";
import { Button } from "@/components/ui/button";
import { useSimulatedRun } from "@/components/neurolok/generation";
import { sampleFor } from "@/lib/studio";
import { useAsset, useAssetVersions, useCreateAssets, useDeleteAsset } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/asset/$assetId")({
  head: () => ({
    meta: [
      { title: "Result — Neurolok Studio" },
      { name: "description", content: "View a result full-screen and upscale, remix or recreate it." },
      { property: "og:title", content: "Result — Neurolok Studio" },
      { property: "og:description", content: "Upscale, remix or recreate any Neurolok result." },
    ],
  }),
  component: AssetPage,
});

function AssetPage() {
  const { assetId } = Route.useParams();
  const navigate = useNavigate();
  const { data: asset, isLoading } = useAsset(assetId);
  const { data: versions } = useAssetVersions(assetId);
  const createAssets = useCreateAssets();
  const del = useDeleteAsset();
  const { running, run } = useSimulatedRun(2600);

  async function derive(action: "Upscaled" | "Remixed" | "Recreated") {
    if (!asset) return;
    const created = await run(() =>
      createAssets.mutateAsync([
        {
          kind: asset.kind,
          media_url: sampleFor(`${asset.id}${action}${Date.now()}`),
          prompt: `${action.toLowerCase()}: ${asset.prompt ?? ""}`.trim(),
          enhanced_prompt: asset.enhanced_prompt,
          mode: asset.mode,
          model: asset.model,
          settings: asset.settings,
          credits_used: 8,
          source: action.toLowerCase(),
          parent_id: asset.id,
        },
      ]),
    );
    toast.success(`${action} version saved`);
    const first = created[0];
    if (first) navigate({ to: "/asset/$assetId", params: { assetId: first.id } });
  }

  if (isLoading) return <Page><div className="h-96 animate-pulse rounded-3xl bg-card" /></Page>;
  if (!asset) return <Page><p className="text-muted-foreground">This result no longer exists.</p></Page>;

  return (
    <Page>
      <Button variant="ghost" size="sm" className="mb-5 gap-2" onClick={() => navigate({ to: "/library" })}>
        <ArrowLeft className="size-4" /> Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="overflow-hidden rounded-3xl border border-border/50 bg-card">
          <img src={asset.media_url} alt={asset.prompt ?? "Result"} className="w-full object-contain" />
        </div>

        <div>
          <p className="font-display text-xl text-foreground">Your result</p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{asset.prompt}</p>

          <div className="mt-6 grid grid-cols-2 gap-2">
            <Button variant="secondary" className="gap-2" disabled={running} onClick={() => derive("Upscaled")}>
              <Maximize2 className="size-4" /> Upscale
            </Button>
            <Button variant="secondary" className="gap-2" disabled={running} onClick={() => derive("Remixed")}>
              <Sparkles className="size-4" /> Remix
            </Button>
            <Button variant="secondary" className="gap-2" disabled={running} onClick={() => derive("Recreated")}>
              <RefreshCw className="size-4" /> Recreate
            </Button>
            <Button variant="secondary" className="gap-2" asChild>
              <a href={asset.media_url} download>
                <Download className="size-4" /> Download
              </a>
            </Button>
          </div>

          {running && <p className="mt-4 text-xs text-primary">Working on the new version…</p>}

          <details className="glass mt-6 rounded-2xl px-4 py-3">
            <summary className="cursor-pointer text-xs text-muted-foreground">Creation details</summary>
            <dl className="mt-3 space-y-2 text-xs">
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Mode</dt>
                <dd className="text-foreground">{asset.mode ?? "Pilot"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Model</dt>
                <dd className="text-foreground">{asset.model ?? "Neurolok Auto"}</dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt className="text-muted-foreground">Credits</dt>
                <dd className="text-foreground">{asset.credits_used ?? 0}</dd>
              </div>
              {asset.enhanced_prompt && (
                <div>
                  <dt className="text-muted-foreground">Interpreted as</dt>
                  <dd className="mt-1 text-foreground">{asset.enhanced_prompt}</dd>
                </div>
              )}
            </dl>
          </details>

          {!!versions?.length && (
            <div className="mt-6">
              <p className="mb-2 text-xs text-muted-foreground">Versions from this result</p>
              <div className="flex flex-wrap gap-2">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => navigate({ to: "/asset/$assetId", params: { assetId: v.id } })}
                  >
                    <img src={v.media_url} alt="" className="size-14 rounded-xl object-cover" />
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            size="sm"
            className="mt-8 gap-2 text-muted-foreground"
            onClick={async () => {
              await del.mutateAsync(asset.id);
              toast.success("Deleted");
              navigate({ to: "/library" });
            }}
          >
            <Trash2 className="size-4" /> Delete
          </Button>
        </div>
      </div>
    </Page>
  );
}
