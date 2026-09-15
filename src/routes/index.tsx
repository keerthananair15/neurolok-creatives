import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/neurolok/landing-page";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Neurolok — Create Images, Videos & Campaigns" },
      {
        name: "description",
        content:
          "Turn a simple idea into stunning images, cinematic videos and complete campaigns with Neurolok's AI creative intelligence.",
      },
      { property: "og:title", content: "Neurolok — AI Creative Studio" },
      { property: "og:description", content: "Bring the idea. Neurolok turns it into extraordinary creative." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});
