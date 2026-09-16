import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { toast } from "sonner";
import { Logo } from "@/components/neurolok/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import sample from "@/assets/sample-1.jpg";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — Neurolok AI Creative Studio" },
      {
        name: "description",
        content: "Sign in to Neurolok to create images, videos, storyboards and campaigns from a plain idea.",
      },
      { property: "og:title", content: "Sign in — Neurolok" },
      { property: "og:description", content: "Your AI creative studio. Bring an idea, leave with finished work." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate({ to: "/home" });
    });
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: window.location.origin, data: { display_name: name } },
      });
      setBusy(false);
      if (error) return toast.error(error.message);
      if (!data.session) return setSent(true);
      navigate({ to: "/home" });
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return toast.error(error.message);
      navigate({ to: "/home" });
    }
  }

  async function google() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Try email instead.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/home" });
  }

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden lg:block">
        <img src={sample} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/15 to-transparent" />
        <div className="absolute bottom-12 left-12 right-12">
          <p className="font-display text-3xl font-medium leading-tight text-primary-foreground">
            Bring an idea.
            <br />
            Leave with finished work.
          </p>
          <p className="mt-3 max-w-sm text-sm text-primary-foreground/80">
            Images, videos, storyboards and full ad campaigns — written in plain language, no prompt
            skills needed.
          </p>
        </div>
      </div>

      <div className="ambient-glow flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Logo size={40} />
          <h1 className="mt-10 font-display text-2xl text-foreground">
            {sent ? "Check your email" : mode === "signin" ? "Welcome back" : "Create your account"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {sent
              ? `We sent a confirmation link to ${email}. Open it to finish signing up.`
              : "Your work, characters and campaigns stay saved to your account."}
          </p>

          {!sent && (
            <>
              <form onSubmit={submit} className="mt-8 space-y-4">
                {mode === "signup" && (
                  <div className="space-y-2">
                    <Label htmlFor="name">Your name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" disabled={busy} className="w-full">
                  {mode === "signin" ? "Sign in" : "Create account"}
                </Button>
              </form>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" /> or <span className="h-px flex-1 bg-border" />
              </div>

              <Button variant="outline" className="w-full" onClick={google}>
                Continue with Google
              </Button>

              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="mt-6 w-full text-center text-sm text-muted-foreground transition-colors hover:text-primary"
              >
                {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
