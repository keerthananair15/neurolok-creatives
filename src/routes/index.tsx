import { useEffect } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/neurolok/logo";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Neurolok — Turn an idea into finished creative" },
      {
        name: "description",
        content:
          "Neurolok is an AI creative studio for images, videos, storyboards, characters and ad campaigns — described in plain language.",
      },
      { property: "og:title", content: "Neurolok — AI Creative Studio" },
      { property: "og:description", content: "Bring an idea. Leave with finished work." },
    ],
  }),
  component: Index,
});

function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      navigate({ to: data.user ? "/home" : "/auth", replace: true });
    });
  }, [navigate]);

  return (
    <div className="ambient-glow flex min-h-screen items-center justify-center bg-background">
      <Logo size={44} />
    </div>
  );
}
