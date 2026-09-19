import mark from "@/assets/neurolok-mark.png";
import { cn } from "@/lib/utils";

export function Logo({
  size = 32,
  withWordmark = true,
  variant = "auto",
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  variant?: "auto" | "white" | "light" | "dark";
  className?: string;
}) {
  const textClass =
    variant === "white"
      ? "text-white"
      : variant === "light"
      ? "text-slate-900"
      : variant === "dark"
      ? "text-white"
      : "text-foreground";

  return (
    <span className={cn("inline-flex items-center gap-2.5 select-none", className)}>
      <img
        src={mark}
        alt="Neurolok"
        width={size}
        height={size}
        className="rounded-lg object-cover shadow-sm"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span
          className={cn("font-display font-bold tracking-[0.32em]", textClass)}
          style={{ fontSize: size * 0.42 }}
        >
          NEURO<span className="text-emerald-500 font-extrabold drop-shadow-[0_0_10px_rgba(16,185,129,0.3)]">LOK</span>
        </span>
      )}
    </span>
  );
}
