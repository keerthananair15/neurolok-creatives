import { useState } from "react";
import { ArrowUp, ChevronDown, ImageIcon, Sliders, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DIRECTOR_CONTROLS, type CreationKind, type Mode } from "@/lib/studio";

export type ComposerValue = {
  idea: string;
  kind: CreationKind;
  mode: Mode;
  settings: Record<string, string>;
};

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full px-3 py-1.5 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "bg-secondary/60 text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

export function Composer({
  value,
  onChange,
  onSubmit,
  busy,
  placeholder = "Describe what you want to create…",
  compact,
}: {
  value: ComposerValue;
  onChange: (v: ComposerValue) => void;
  onSubmit: () => void;
  busy?: boolean;
  placeholder?: string;
  compact?: boolean;
}) {
  const [openDirector, setOpenDirector] = useState(false);
  const set = (patch: Partial<ComposerValue>) => onChange({ ...value, ...patch });
  const setting = (key: string, v: string) =>
    onChange({ ...value, settings: { ...value.settings, [key]: v } });

  const controls = Object.entries(DIRECTOR_CONTROLS).filter(
    ([key]) => value.kind === "video" || !["duration", "camera", "motion"].includes(key),
  );

  return (
    <div className="glass-strong edge-light rounded-2xl p-3 transition-all duration-500 focus-within:border-primary/25 focus-within:glow-ring sm:p-4">
      <Textarea
        value={value.idea}
        onChange={(e) => set({ idea: e.target.value })}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) onSubmit();
        }}
        className={cn(
          "resize-none border-0 bg-transparent px-2 text-base shadow-none focus-visible:ring-0",
          compact ? "min-h-14" : "min-h-24",
        )}
      />

      <div className="mt-2 flex flex-wrap items-center gap-2 px-1">
        <div className="flex rounded-full bg-secondary/60 p-1">
          <button
            type="button"
            onClick={() => set({ kind: "image" })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors",
              value.kind === "image" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <ImageIcon className="size-3.5" /> Image
          </button>
          <button
            type="button"
            onClick={() => set({ kind: "video" })}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition-colors",
              value.kind === "video" ? "bg-primary text-primary-foreground" : "text-muted-foreground",
            )}
          >
            <Video className="size-3.5" /> Video
          </button>
        </div>

        <Chip active={value.mode === "pilot"} onClick={() => set({ mode: "pilot" })}>
          Pilot · we handle it
        </Chip>
        <Chip
          active={value.mode === "director"}
          onClick={() => {
            set({ mode: "director" });
            setOpenDirector(true);
          }}
        >
          Director · full control
        </Chip>

        <Button
          size="icon"
          onClick={onSubmit}
          disabled={busy || !value.idea.trim()}
          className="ml-auto size-10 rounded-full"
          aria-label="Create"
        >
          <ArrowUp className="size-4" />
        </Button>
      </div>

      {value.mode === "director" && (
        <Collapsible open={openDirector} onOpenChange={setOpenDirector} className="mt-3">
          <CollapsibleTrigger className="flex w-full items-center gap-2 rounded-xl px-2 py-2 text-xs text-muted-foreground transition-colors hover:text-foreground">
            <Sliders className="size-3.5" />
            Director controls
            <ChevronDown
              className={cn("ml-auto size-3.5 transition-transform", openDirector && "rotate-180")}
            />
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 px-2 pb-1 pt-3">
            {controls.map(([key, options]) => (
              <div key={key}>
                <p className="mb-1.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                  {key}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {(options as readonly string[]).map((opt) => (
                    <Chip
                      key={opt}
                      active={value.settings[key] === opt}
                      onClick={() => setting(key, opt)}
                    >
                      {opt}
                    </Chip>
                  ))}
                </div>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>
      )}
    </div>
  );
}

export const emptyComposer: ComposerValue = {
  idea: "",
  kind: "image",
  mode: "pilot",
  settings: {},
};
