import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Asset } from "@/lib/db";

export function MediaTile({
  asset,
  onClick,
  className,
}: {
  asset: Pick<Asset, "media_url" | "prompt" | "kind">;
  onClick?: () => void;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative w-full overflow-hidden rounded-2xl border border-border/50 bg-card text-left transition-all duration-300 hover:border-primary/40 hover:glow-ring",
        className,
      )}
    >
      <img
        src={asset.media_url}
        alt={asset.prompt ?? "Generated media"}
        loading="lazy"
        className="aspect-[4/5] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
      />
      {asset.kind === "video" && (
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1 text-[11px] text-foreground backdrop-blur-md">
          <Play className="size-3 fill-primary text-primary" /> Video
        </span>
      )}
      <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-background/95 to-transparent p-3 pt-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
        <span className="line-clamp-2 text-xs text-muted-foreground">{asset.prompt}</span>
      </span>
    </button>
  );
}

export function MediaGrid({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4", className)}>
      {children}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  action,
}: {
  title: string;
  hint: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="glass flex flex-col items-center rounded-3xl px-6 py-16 text-center">
      <p className="font-display text-lg text-foreground">{title}</p>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">{hint}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function SectionHeading({
  title,
  subtitle,
  right,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-2xl text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      {right}
    </div>
  );
}

export function Page({ children }: { children: React.ReactNode }) {
  return <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8 sm:py-12">{children}</div>;
}
