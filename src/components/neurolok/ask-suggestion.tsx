import { useState } from "react";
import { MessageCircleHeart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { supabase } from "@/integrations/supabase/client";

export function AskSuggestion() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function send() {
    if (!message.trim()) return;
    setBusy(true);
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      await supabase.from("suggestions").insert({ user_id: data.user.id, message: message.trim() });
    }
    setBusy(false);
    setMessage("");
    setOpen(false);
    toast.success("Thank you — your idea reached the Neurolok team.");
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-muted-foreground transition-colors hover:text-foreground">
          <MessageCircleHeart className="size-[18px] shrink-0" strokeWidth={1.6} />
          <span className="truncate">Ask suggestion</span>
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" className="glass-strong w-80 rounded-2xl p-4">
        <p className="text-sm font-medium text-foreground">
          What should we add to make Neurolok better?
        </p>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Your idea…"
          className="mt-3 min-h-24 resize-none border-border/60 bg-background/40"
        />
        <Button onClick={send} disabled={busy || !message.trim()} className="mt-3 w-full">
          Send
        </Button>
      </PopoverContent>
    </Popover>
  );
}
