import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EmptyState, Page, SectionHeading } from "@/components/neurolok/media";
import { useSimulatedRun } from "@/components/neurolok/generation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { sampleFor } from "@/lib/studio";
import { useCharacters, useDeleteCharacter, useSaveCharacter } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/characters")({
  head: () => ({
    meta: [
      { title: "Characters — Neurolok Studio" },
      { name: "description", content: "Save a person, mascot or product once and reuse the exact same look everywhere." },
      { property: "og:title", content: "Characters — Neurolok Studio" },
      { property: "og:description", content: "Consistent faces and products across every creation." },
    ],
  }),
  component: CharactersPage,
});

const ANGLES = ["Front", "Three-quarter", "Profile", "Close-up"];

function CharactersPage() {
  const { data: characters } = useCharacters();
  const save = useSaveCharacter();
  const del = useDeleteCharacter();
  const { running, run } = useSimulatedRun(2800);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [folder, setFolder] = useState("People");
  const [description, setDescription] = useState("");

  const folders = Array.from(new Set((characters ?? []).map((c) => c.folder)));

  async function create() {
    if (!name.trim()) return;
    const seed = `${name}${description}`;
    await run(() =>
      save.mutateAsync({
        name: name.trim(),
        folder,
        description: description.trim(),
        image_url: sampleFor(seed),
        sheet: ANGLES.map((angle, i) => ({ angle, image: sampleFor(seed, i + 1) })) as unknown as never,
      }),
    );
    setOpen(false);
    setName("");
    setDescription("");
    toast.success("Character sheet saved");
  }

  return (
    <Page>
      <SectionHeading
        title="Characters"
        subtitle="Lock in a face, mascot or product once — every future creation keeps it identical."
        right={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="size-4" /> New character
              </Button>
            </DialogTrigger>
            <DialogContent className="glass-strong">
              <DialogHeader>
                <DialogTitle>Create a character</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="c-name">Name</Label>
                  <Input id="c-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-folder">Folder</Label>
                  <Input
                    id="c-folder"
                    value={folder}
                    onChange={(e) => setFolder(e.target.value)}
                    placeholder="People, Products, Mascots…"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="c-desc">Describe them</Label>
                  <Textarea
                    id="c-desc"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="A woman in her 30s, short dark hair, calm expression, olive jacket…"
                    className="min-h-24 resize-none"
                  />
                </div>
                <Button onClick={create} disabled={running || !name.trim()} className="w-full">
                  {running ? "Building character sheet…" : "Create character sheet"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        }
      />

      {!characters?.length ? (
        <EmptyState
          title="No characters yet"
          hint="Add one and Neurolok generates a full sheet of angles you can reuse in any image or video."
        />
      ) : (
        <div className="space-y-10">
          {folders.map((f) => (
            <div key={f}>
              <p className="mb-3 text-xs uppercase tracking-wider text-muted-foreground">{f}</p>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {characters
                  .filter((c) => c.folder === f)
                  .map((c) => (
                    <div key={c.id} className="glass overflow-hidden rounded-2xl">
                      {c.image_url && (
                        <img src={c.image_url} alt={c.name} className="aspect-[4/3] w-full object-cover" />
                      )}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-display text-base text-foreground">{c.name}</p>
                          <button
                            onClick={() => del.mutate(c.id)}
                            aria-label={`Delete ${c.name}`}
                            className="text-muted-foreground transition-colors hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                        {c.description && (
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{c.description}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          {(Array.isArray(c.sheet) ? c.sheet : []).map((s, i) => {
                            const img = (s as { image?: string }).image;
                            return img ? (
                              <img key={i} src={img} alt="" className="size-11 rounded-lg object-cover" />
                            ) : null;
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}
