import { useEffect, useRef, useState } from "react";
import { NeuralAnimation } from "./neural-animation";

/** Premium Neurolok neural processing animation while results are being produced. */
export function GenerationStages({ label = "Creating" }: { label?: string }) {
  return <NeuralAnimation label={label} />;
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
