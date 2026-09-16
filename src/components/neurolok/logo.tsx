import mark from "@/assets/neurolok-mark.png";
import { cn } from "@/lib/utils";

export function Logo({
  size = 32,
  withWordmark = true,
  className,
}: {
  size?: number;
  withWordmark?: boolean;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <img
        src={mark}
        alt="Neurolok"
        width={size}
        height={size}
        className="rounded-md object-cover"
        style={{ width: size, height: size }}
      />
      {withWordmark && (
        <span
          className="font-display text-[0.95rem] font-semibold tracking-[0.28em] text-foreground"
          style={{ fontSize: size * 0.42 }}
        >
          NEUROL<span className="text-primary">OK</span>
        </span>
      )}
    </span>
  );
}
