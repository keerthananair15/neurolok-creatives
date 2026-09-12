import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Sparkles,
  User,
  UserCheck,
} from "lucide-react";
import { Logo } from "@/components/neurolok/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import bgImage from "@/assets/auth-liquid-ribbon-bg.png";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Log In — Neurolok AI Creative Studio" },
      {
        name: "description",
        content: "Sign in to Neurolok to create images, videos, storyboards and campaigns from a plain idea.",
      },
      { property: "og:title", content: "Log In — Neurolok" },
      { property: "og:description", content: "Your AI creative studio. Bring an idea, leave with finished work." },
    ],
  }),
  component: AuthPage,
});

const DEMO_EMAIL = "demo@neurolok.com";
const DEMO_PASSWORD = "NeurolokDemo2026!";

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/home", replace: true });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
        });
        setBusy(false);
        if (error) return toast.error(error.message);
        if (!data.session) return setSent(true);
        toast.success("Account created successfully!");
        navigate({ to: "/home" });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) return toast.error(error.message);
        toast.success("Welcome back!");
        navigate({ to: "/home" });
      }
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Authentication error");
    }
  }

  async function handleDemoLogin() {
    setDemoBusy(true);
    try {
      let { error } = await supabase.auth.signInWithPassword({
        email: DEMO_EMAIL,
        password: DEMO_PASSWORD,
      });

      if (error && (error.message.includes("Invalid login credentials") || error.status === 400)) {
        const signUpRes = await supabase.auth.signUp({
          email: DEMO_EMAIL,
          password: DEMO_PASSWORD,
          options: { data: { display_name: "Demo Creator" } },
        });
        if (!signUpRes.error) {
          const signInRes = await supabase.auth.signInWithPassword({
            email: DEMO_EMAIL,
            password: DEMO_PASSWORD,
          });
          error = signInRes.error;
        }
      }

      setDemoBusy(false);
      if (error) {
        toast.error(`Demo login failed: ${error.message}`);
        return;
      }
      toast.success("Signed in as Demo Creator");
      navigate({ to: "/home" });
    } catch (err) {
      setDemoBusy(false);
      toast.error("Unable to start demo session");
    }
  }

  function handleForgotPassword() {
    if (!email.trim()) {
      toast.error("Please enter your e-mail address first.");
      return;
    }
    toast.success(`Password reset instructions sent to ${email}`);
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#060c09] px-6 py-6 font-sans text-foreground selection:bg-emerald-500/30 selection:text-white sm:px-10 sm:py-8 lg:px-14">
      {/* Full-bleed Cinematic Background Image & Lighting Overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src={bgImage}
          alt=""
          className="h-full w-full object-cover object-center brightness-95 contrast-125 filter"
        />
        {/* Dark Vignette & Radial Glow overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#040907] via-[#060c09]/60 to-[#040907]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.18),transparent_70%)]" />
      </div>

      {/* Top Navigation Row */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo size={28} />
          <span className="font-display text-xs font-bold uppercase tracking-[0.3em] text-white/90">
            Neurolok
          </span>
        </div>
        <div className="hidden text-[10px] uppercase tracking-[0.25em] text-white/40 sm:block">
          Intelligence for a brighter tomorrow —
        </div>
      </header>

      {/* Vertical Decorative Typography (Far Left Edge) */}
      <aside
        aria-hidden
        className="pointer-events-none absolute left-6 top-1/2 -translate-y-1/2 hidden -rotate-90 text-[9px] uppercase tracking-[0.4em] text-white/20 xl:block"
      >
        Healthier minds. Brighter tomorrows.
      </aside>

      {/* Center Frosted Glass Login Card */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-[430px] py-6">
        <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-black/40 p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.9),0_0_60px_-15px_rgba(16,185,129,0.2)] backdrop-blur-3xl transition-all duration-500 sm:p-10">
          {/* Subtle Glass Surface Shimmer Line */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          />

          {/* Card Top Sub-Header */}
          <div className="mb-8 flex items-center justify-between text-[11px] font-medium text-white/60">

            <button
              type="button"
              onClick={() => toast.info("Neurolok AI Studio v2.4 — Plain language creative engine.")}
              className="transition-colors hover:text-emerald-400"
            >

            </button>
          </div>

          {sent ? (
            <div className="space-y-6 py-4 text-center">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.3)]">
                <CheckCircle2 className="size-7" />
              </div>
              <div>
                <h2 className="font-display text-2xl font-light text-white">Check your email</h2>
                <p className="mt-2 text-xs leading-relaxed text-white/70">
                  We sent a confirmation link to <span className="font-medium text-white">{email}</span>. Open it to complete registration.
                </p>
              </div>
              <Button
                variant="outline"
                className="w-full rounded-full border-white/20 bg-white/5 text-xs text-white hover:bg-white/10"
                onClick={() => setSent(false)}
              >
                Back to Sign In
              </Button>
            </div>
          ) : (
            <>
              {/* Headline */}
              <div className="text-center">
                <h1 className="font-display text-3xl font-normal tracking-tight text-white sm:text-4xl">
                  {mode === "signin" ? "Welcome Back" : "Log In"}
                </h1>
                <p className="mt-2 text-xs font-light text-white/70">
                  {mode === "signin"
                    ? "Please log in to your account."
                    : "Welcome back. Please log in to your account."}
                </p>
              </div>

              {/* Login / Signup Form */}
              <form onSubmit={submit} className="mt-8 space-y-4">
                {mode === "signup" && (
                  <div className="relative flex items-center rounded-2xl border border-white/12 bg-white/[0.05] p-1 transition-all focus-within:border-emerald-500/50 focus-within:bg-black/30 focus-within:shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]">
                    <User className="ml-3.5 size-4 text-white/50" />
                    <Input
                      type="text"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      className="h-11 border-0 bg-transparent px-3 text-xs text-white placeholder:text-white/40 focus-visible:ring-0"
                    />
                  </div>
                )}

                <div className="relative flex items-center rounded-2xl border border-white/12 bg-white/[0.05] p-1 transition-all focus-within:border-emerald-500/50 focus-within:bg-black/30 focus-within:shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]">
                  <Mail className="ml-3.5 size-4 text-white/50" />
                  <Input
                    type="email"
                    placeholder="E-mail address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border-0 bg-transparent px-3 text-xs text-white placeholder:text-white/40 focus-visible:ring-0"
                  />
                </div>

                <div className="relative flex items-center rounded-2xl border border-white/12 bg-white/[0.05] p-1 transition-all focus-within:border-emerald-500/50 focus-within:bg-black/30 focus-within:shadow-[0_0_20px_-3px_rgba(16,185,129,0.25)]">
                  <Lock className="ml-3.5 size-4 text-white/50" />
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    value={password}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 border-0 bg-transparent px-3 text-xs text-white placeholder:text-white/40 focus-visible:ring-0"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="mr-3 text-white/40 transition-colors hover:text-white"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>

                {/* Options Row (Remember me & Forgot password) */}
                <div className="flex items-center justify-between px-1 text-xs text-white/70">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-[11px]">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="size-3.5 rounded border-white/20 bg-white/10 accent-emerald-500 focus:ring-0"
                    />
                    <span>Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[11px] text-white/70 underline underline-offset-4 transition-colors hover:text-emerald-400"
                  >
                    Forgot password?
                  </button>
                </div>

                {/* Primary Log In Button */}
                <button
                  type="submit"
                  disabled={busy || demoBusy}
                  className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full border border-emerald-400/40 bg-gradient-to-r from-emerald-950 via-emerald-600/90 to-emerald-950 px-6 text-xs font-medium text-white shadow-[0_0_30px_rgba(16,185,129,0.35)] transition-all duration-300 hover:shadow-[0_0_45px_rgba(16,185,129,0.6)] active:scale-[0.98] disabled:opacity-50"
                >
                  {busy ? (
                    <span className="inline-flex items-center gap-2">
                      <Loader2 className="size-4 animate-spin text-white" />
                      {mode === "signin" ? "Logging in…" : "Creating account…"}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-2">
                      {mode === "signin" ? "Log In" : "Create Account"}
                      <ArrowRight className="size-4 text-emerald-300" />
                    </span>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-5 flex items-center gap-3 text-[10px] uppercase tracking-widest text-white/30">
                <span className="h-px flex-1 bg-white/10" /> or <span className="h-px flex-1 bg-white/10" />
              </div>

              {/* Secondary Demo Login Button */}
              <button
                type="button"
                disabled={busy || demoBusy}
                onClick={handleDemoLogin}
                className="flex h-12 w-full items-center justify-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-6 text-xs font-medium text-white/90 shadow-sm backdrop-blur-md transition-all duration-300 hover:border-emerald-500/40 hover:bg-emerald-500/10 hover:text-white active:scale-[0.98] disabled:opacity-50"
              >
                {demoBusy ? (
                  <span className="inline-flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin text-emerald-400" />
                    Connecting Demo…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <UserCheck className="size-4 text-emerald-400" />
                    <span>Continue as Demo</span>
                    <ArrowRight className="size-4 text-white/50" />
                  </span>
                )}
              </button>

              {/* Bottom Mode Switch Link */}
              <p className="mt-6 text-center text-xs text-white/70">
                {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
                <button
                  type="button"
                  onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                  className="font-medium text-white underline underline-offset-4 transition-colors hover:text-emerald-400"
                >
                  {mode === "signin" ? "Sign up" : "Log in"}
                </button>
              </p>
            </>
          )}
        </div>
      </main>

      {/* Bottom Footer Row */}
      <footer className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
        <span>Science · People · Possibilities</span>
        <span>Neurolok © 2026</span>
      </footer>
    </div>
  );
}
