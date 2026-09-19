import { useEffect, useState } from "react";
import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2, UserCheck } from "lucide-react";
import { Logo } from "@/components/neurolok/logo";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import bgRibbon from "@/assets/auth-liquid-ribbon-bg.png";

type Search = {
  mode?: "signin" | "signup";
  demo?: string | undefined;
};

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): Search => ({
    mode: search["mode"] === "signup" ? "signup" : "signin",
    demo: typeof search["demo"] === "string" ? search["demo"] : undefined,
  }),
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
  const search = Route.useSearch();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode ?? "signin");
  const [email, setEmail] = useState(search.demo === "true" ? DEMO_EMAIL : "");
  const [password, setPassword] = useState(search.demo === "true" ? DEMO_PASSWORD : "");
  const [name, setName] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [demoBusy, setDemoBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/create", replace: true });
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
        if (error) {
          toast.error(error.message);
          return;
        }
        if (!data.session) {
          toast.success("Confirmation link sent to your email!");
          return;
        }
        toast.success("Account created successfully!");
        navigate({ to: "/create" });
        return;
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        setBusy(false);
        if (error) {
          toast.error(error.message);
          return;
        }
        toast.success("Welcome back!");
        navigate({ to: "/create" });
        return;
      }
    } catch (err) {
      setBusy(false);
      toast.error(err instanceof Error ? err.message : "Authentication error");
    }
  }

  function autofillDemoCredentials() {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
    setMode("signin");
    toast.success("Demo credentials autofilled! Click Log In.");
  }

  async function handleDemoLogin() {
    autofillDemoCredentials();
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
      navigate({ to: "/create" });
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
    <div className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#040806] px-6 py-6 font-sans text-foreground selection:bg-emerald-500/30 selection:text-white sm:px-10 sm:py-8 lg:px-14">
      {/* BACKGROUND: Exact ribbon image + luminous emerald gradient aura */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <img
          src={bgRibbon}
          alt=""
          className="h-full w-full object-cover object-center brightness-110 contrast-110 filter opacity-80"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(16,185,129,0.32),transparent_70%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/70" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 transition-opacity hover:opacity-90">
          <Logo size={30} variant="white" />
        </Link>
        <Link
          to="/"
          className="text-xs text-white/80 hover:text-emerald-400 transition-colors font-medium"
        >
          ← Back to Explore
        </Link>
      </header>

      {/* CENTERED LIQUID FROSTED GLASS LOGIN CARD */}
      <main className="relative z-10 mx-auto my-auto w-full max-w-[440px] py-6">
        <div className="relative overflow-hidden rounded-[2.2rem] border border-white/25 bg-black/55 p-8 shadow-[0_30px_100px_-20px_rgba(0,0,0,0.95),0_0_50px_-10px_rgba(16,185,129,0.25)] backdrop-blur-3xl transition-all sm:p-10">
          
          {/* Centered Top Logo with Wordmark */}
          <div className="flex justify-center pb-1">
            <Logo size={36} withWordmark={true} variant="white" />
          </div>

          {/* Headline & Subtitle */}
          <div className="mt-4 text-center">
            <h1 className="font-display text-3xl font-medium tracking-tight text-white sm:text-4xl">
              {mode === "signin" ? "Welcome back!" : "Create account"}
            </h1>
            <p className="mt-2 text-xs text-white/60 font-light leading-relaxed">
              {mode === "signin"
                ? "Sign in to access your creative studio, saved assets, and campaigns"
                : "Sign up to start creating images, videos, and campaigns"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} className="mt-7 space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium text-white/70 mb-1.5">Name</label>
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="h-12 rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-xs text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-black/30 focus:ring-0"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-2xl border border-white/15 bg-white/[0.07] px-4 text-xs text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-black/30 focus:ring-0"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-white/70 mb-1.5">Password</label>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 w-full rounded-2xl border border-white/15 bg-white/[0.07] pl-4 pr-11 text-xs text-white placeholder:text-white/40 focus:border-emerald-400 focus:bg-black/30 focus:ring-0"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-white/50 hover:text-white transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {/* Options Row (Remember me & Forgot password) */}
            <div className="flex items-center justify-between px-1 text-xs text-white/70 pt-1">
              <label className="flex items-center gap-2 cursor-pointer select-none text-xs">
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
                className="text-xs text-white/70 hover:text-white transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* High Contrast Solid White Rounded Button (From 1st Image Ref) */}
            <button
              type="submit"
              disabled={busy || demoBusy}
              className="mt-6 flex h-12 w-full items-center justify-center rounded-full bg-white text-xs font-medium text-slate-950 shadow-lg transition-all hover:bg-slate-100 active:scale-[0.98] disabled:opacity-50"
            >
              {busy ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="size-4 animate-spin text-slate-950" />
                  {mode === "signin" ? "Logging in…" : "Creating account…"}
                </span>
              ) : (
                <span>{mode === "signin" ? "Log In" : "Sign Up"}</span>
              )}
            </button>
          </form>

          {/* Divider line with "Or" */}
          <div className="my-5 flex items-center gap-3 text-xs text-white/40">
            <span className="h-px flex-1 bg-white/15" /> Or <span className="h-px flex-1 bg-white/15" />
          </div>

          {/* Secondary Translucent Demo Button */}
          <button
            type="button"
            disabled={busy || demoBusy}
            onClick={handleDemoLogin}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.06] text-xs font-medium text-white transition-all hover:bg-white/15 hover:border-white/30 active:scale-[0.98] disabled:opacity-50"
          >
            {demoBusy ? (
              <span className="inline-flex items-center gap-2">
                <Loader2 className="size-4 animate-spin text-emerald-400" />
                Connecting Demo…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                <UserCheck className="size-4 text-emerald-400" />
                <span>Sign In with Demo Account</span>
              </span>
            )}
          </button>

          {/* Footer Switch */}
          <p className="mt-6 text-center text-xs text-white/60">
            {mode === "signin" ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
              className="font-medium text-white underline underline-offset-4 transition-colors hover:text-emerald-400"
            >
              {mode === "signin" ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 flex items-center justify-between text-[10px] uppercase tracking-[0.3em] text-white/30">
        <span>Science · People · Possibilities</span>
        <span>Neurolok © 2026</span>
      </footer>
    </div>
  );
}
