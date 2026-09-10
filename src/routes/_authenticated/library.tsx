import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { MediaGrid, MediaTile, Page, SectionHeading, EmptyState } from "@/components/neurolok/media";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAssets } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/library")({
  head: () => ({
    meta: [
      { title: "Library — Neurolok Studio" },
      { name: "description", content: "Every image, video and campaign you have made, searchable and reusable." },
      { property: "og:title", content: "Library — Neurolok Studio" },
      { property: "og:description", content: "All your saved creative work in one place." },
    ],
  }),
  component: LibraryPage,
});

function LibraryPage() {
  const navigate = useNavigate();
  const [kind, setKind] = useState<string>("all");
  const [search, setSearch] = useState("");
  const { data: assets, isLoading } = useAssets({
    ...(kind === "all" ? {} : { kind }),
    ...(search ? { search } : {}),
  });

  return (
    <Page>
      <SectionHeading
        title="Library"
        subtitle="Everything you've created, ready to reuse as a reference or start a new version."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Tabs value={kind} onValueChange={setKind}>
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="image">Images</TabsTrigger>
            <TabsTrigger value="video">Videos</TabsTrigger>
            <TabsTrigger value="poster">Posters</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative ml-auto w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search your work"
            className="pl-9"
          />
        </div>
      </div>

      {isLoading ? (
        <MediaGrid>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[4/5] animate-pulse rounded-2xl bg-card" />
          ))}
        </MediaGrid>
      ) : assets?.length ? (
        <MediaGrid>
          {assets.map((a) => (
            <MediaTile
              key={a.id}
              asset={a}
              onClick={() => navigate({ to: "/asset/$assetId", params: { assetId: a.id } })}
            />
          ))}
        </MediaGrid>
      ) : (
        <EmptyState
          title="Nothing here yet"
          hint="Your creations are saved automatically. Make your first one and it will show up here."
          action={<Button onClick={() => navigate({ to: "/create" })}>Start creating</Button>}
        />
      )}
    </Page>
  );
}
