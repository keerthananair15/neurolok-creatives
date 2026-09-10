import { useEffect, useRef, useState } from "react";
import { STAGES } from "@/lib/studio";
import { Progress } from "@/components/ui/progress";

/** Calm, human-readable progress while results are being produced. */
export function GenerationStages({ label = "Creating" }: { label?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STAGES.length - 1)), 900);
    return () => clearInterval(t);
  }, []);

  const pct = ((step + 1) / STAGES.length) * 100;

  return (
    <div className="glass mx-auto w-full max-w-md rounded-3xl p-6 text-center">
      <p className="font-display text-base text-foreground">{label}…</p>
      <p className="mt-1 text-sm text-primary">{STAGES[step]}</p>
      <Progress value={pct} className="mt-5 h-1.5" />
      <p className="mt-4 text-xs text-muted-foreground">
        This usually takes under a minute. You can keep browsing.
      </p>
    </div>
  );
}

export function useSimulatedRun(ms = 3600) {
  const [running, setRunning] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const run = async <T,>(work: () => Promise<T>): Promise<T> => {
    if (mounted.current) setRunning(true);
    const [result] = await Promise.all([work(), new Promise((r) => setTimeout(r, ms))]);
    if (mounted.current) setRunning(false);
    return result;
  };
  return { running, run };
}
