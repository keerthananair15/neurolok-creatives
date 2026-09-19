import { useEffect, useState } from "react";
import { Sparkles, Cpu } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { STAGES } from "@/lib/studio";

interface NodePos {
  x: number;
  y: number;
  r: number;
  pulseDelay: number;
}

const NODES: NodePos[] = [
  { x: 50, y: 50, r: 8, pulseDelay: 0 },
  { x: 25, y: 30, r: 5, pulseDelay: 0.4 },
  { x: 75, y: 30, r: 5, pulseDelay: 0.8 },
  { x: 20, y: 70, r: 6, pulseDelay: 1.2 },
  { x: 80, y: 70, r: 6, pulseDelay: 1.6 },
  { x: 35, y: 85, r: 4, pulseDelay: 0.2 },
  { x: 65, y: 85, r: 4, pulseDelay: 1.0 },
  { x: 15, y: 50, r: 4, pulseDelay: 1.4 },
  { x: 85, y: 50, r: 4, pulseDelay: 0.6 },
];

const CONNECTIONS: [number, number][] = [
  [0, 1],
  [0, 2],
  [0, 3],
  [0, 4],
  [0, 5],
  [0, 6],
  [1, 7],
  [2, 8],
  [1, 3],
  [2, 4],
  [3, 5],
  [4, 6],
];

export function NeuralAnimation({ label = "Synthesizing" }: { label?: string }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STAGES.length - 1)), 900);
    return () => clearInterval(t);
  }, []);

  const pct = ((step + 1) / STAGES.length) * 100;

  return (
    <div className="relative mx-auto w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-emerald-500/30 bg-black/60 p-8 shadow-[0_20px_80px_-20px_rgba(16,185,129,0.3)] backdrop-blur-3xl">
      {/* Background Soft Glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-10 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.2),transparent_70%)] blur-2xl"
      />

      {/* Top Header */}
      <div className="relative z-10 flex items-center justify-between text-xs text-emerald-400">
        <span className="flex items-center gap-2 font-medium tracking-wide">
          <Cpu className="size-4 animate-spin text-emerald-400" />
          Neurolok Neural Matrix
        </span>
        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px]">
          Processing
        </span>
      </div>

      {/* NEURAL SVG NETWORK CANVAS */}
      <div className="relative z-10 my-6 flex h-48 w-full items-center justify-center">
        <svg className="h-full w-full overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          <defs>
            {/* Emerald Gradient Lines */}
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#34d399" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#059669" stopOpacity="0.8" />
            </linearGradient>

            {/* Glowing Nucleus Filter */}
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Synaptic Connecting Lines */}
          {CONNECTIONS.map(([startIdx, endIdx], i) => {
            const start = NODES[startIdx]!;
            const end = NODES[endIdx]!;
            return (
              <g key={`conn-${i}`}>
                {/* Static line */}
                <line
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke="url(#lineGrad)"
                  strokeWidth="0.8"
                  strokeOpacity="0.4"
                />
                {/* Firing Energy Pulse along line */}
                <circle r="1" fill="#6ee7b7" filter="url(#glow)">
                  <animateMotion
                    path={`M ${start.x} ${start.y} L ${end.x} ${end.y}`}
                    dur={`${1.8 + (i % 3) * 0.4}s`}
                    repeatCount="indefinite"
                    begin={`${(i * 0.25) % 1.5}s`}
                  />
                </circle>
              </g>
            );
          })}

          {/* Floating Neural Particles */}
          {[...Array(6)].map((_, pIdx) => (
            <circle
              key={`part-${pIdx}`}
              r={0.8 + (pIdx % 3) * 0.4}
              fill="#a7f3d0"
              opacity="0.9"
              filter="url(#glow)"
            >
              <animate
                attributeName="cx"
                values={`${30 + pIdx * 8};${40 + pIdx * 6};${30 + pIdx * 8}`}
                dur={`${2.5 + pIdx * 0.5}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="cy"
                values={`${30 + (pIdx % 4) * 12};${20 + (pIdx % 4) * 12};${30 + (pIdx % 4) * 12}`}
                dur={`${3 + pIdx * 0.4}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.2;1;0.2"
                dur={`${2 + pIdx * 0.3}s`}
                repeatCount="indefinite"
              />
            </circle>
          ))}

          {/* Neuron Nodes */}
          {NODES.map((node, idx) => (
            <g key={`node-${idx}`}>
              {/* Outer pulsing ring for central nucleus */}
              {idx === 0 && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="14"
                  fill="none"
                  stroke="#10b981"
                  strokeWidth="0.5"
                  strokeOpacity="0.5"
                  className="animate-ping"
                  style={{ transformOrigin: "50px 50px", animationDuration: "3s" }}
                />
              )}
              {/* Core Node Circle */}
              <circle
                cx={node.x}
                cy={node.y}
                r={node.r}
                fill={idx === 0 ? "#10b981" : "#059669"}
                filter="url(#glow)"
                opacity={idx === 0 ? "1" : "0.85"}
              >
                <animate
                  attributeName="r"
                  values={`${node.r};${node.r + 1.5};${node.r}`}
                  dur="2s"
                  begin={`${node.pulseDelay}s`}
                  repeatCount="indefinite"
                />
              </circle>
            </g>
          ))}
        </svg>
      </div>

      {/* Real-time Stage Progress Text */}
      <div className="relative z-10 text-center">
        <p className="font-display text-base font-medium text-white">{label}…</p>
        <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-emerald-400 font-mono">
          <Sparkles className="size-3.5 animate-pulse" />
          <span>{STAGES[step]}</span>
        </p>

        <Progress value={pct} className="mt-5 h-1.5 bg-white/10" />

        <p className="mt-4 text-[11px] text-white/50">
          Neural model is processing latents. Your results will appear shortly.
        </p>
      </div>
    </div>
  );
}
