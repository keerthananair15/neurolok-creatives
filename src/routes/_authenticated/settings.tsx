import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { toast } from "sonner";
import { Page, SectionHeading } from "@/components/neurolok/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useProfile, useUpdateProfile } from "@/lib/db";

export const Route = createFileRoute("/_authenticated/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Neurolok Studio" },
      { name: "description", content: "Manage your Neurolok profile and see your remaining credits." },
      { property: "og:title", content: "Settings — Neurolok Studio" },
      { property: "og:description", content: "Your account and credits." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { data: profile } = useProfile();
  const update = useUpdateProfile();
  const [name, setName] = useState("");

  useEffect(() => {
    if (profile?.display_name) setName(profile.display_name);
  }, [profile?.display_name]);

  const credits = profile?.credits ?? 0;

  return (
    <Page>
      <SectionHeading title="Settings" subtitle="Your profile and credit balance." />

      <div className="glass max-w-lg space-y-6 rounded-3xl p-6">
        <div>
          <p className="text-sm text-foreground">Credits</p>
          <p className="mt-1 font-display text-3xl text-primary">{credits}</p>
          <Progress value={Math.min(100, (credits / 500) * 100)} className="mt-3 h-1.5" />
          <p className="mt-2 text-xs text-muted-foreground">
            Images cost 12, videos 60. Credits refresh with your plan.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <Button
          onClick={async () => {
            await update.mutateAsync({ display_name: name });
            toast.success("Saved");
          }}
        >
          Save changes
        </Button>
      </div>
    </Page>
  );
}
