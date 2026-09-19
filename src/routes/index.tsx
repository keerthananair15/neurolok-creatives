import { createFileRoute } from "@tanstack/react-router";
import { LandingExplorePage } from "@/components/neurolok/landing-explore";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Neurolok — Create Anything with AI" },
      {
        name: "description",
        content:
          "Neurolok is an AI creative studio for images, videos, storyboards, characters and ad campaigns — described in plain language.",
      },
      { property: "og:title", content: "Neurolok — AI Creative Studio" },
      { property: "og:description", content: "Bring an idea. Leave with finished work." },
    ],
  }),
  component: LandingExplorePage,
});

