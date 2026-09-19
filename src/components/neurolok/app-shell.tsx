import { useState, type ReactNode } from "react";
import { Link, useRouterState, useNavigate } from "@tanstack/react-router";
import {
  Clapperboard,
  Home,
  Images,
  LogOut,
  Menu,
  Megaphone,
  Sparkles,
  TrendingUp,
  Users,
  Settings as SettingsIcon,
  Sun,
  Moon,
} from "lucide-react";
import { Logo } from "./logo";
import { AskSuggestion } from "./ask-suggestion";
import { cn } from "@/lib/utils";
import { useProfile } from "@/lib/db";
import { supabase } from "@/integrations/supabase/client";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const NAV = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/create", label: "Create", icon: Sparkles },
  { to: "/storyboard", label: "Storyboard", icon: Clapperboard },
  { to: "/characters", label: "Characters", icon: Users },
  { to: "/campaigns", label: "Campaigns", icon: Megaphone },
  { to: "/trends", label: "Trends", icon: TrendingUp },
  { to: "/library", label: "Library", icon: Images },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const path = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {NAV.map(({ to, label, icon: Icon }) => {
        const active = path === to || path.startsWith(`${to}/`);
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors",
              active
                ? "bg-sidebar-accent text-foreground font-medium shadow-sm"
                : "text-muted-foreground hover:bg-sidebar-accent/60 hover:text-foreground",
            )}
          >
            <Icon
              className={cn("size-[18px] shrink-0", active ? "text-primary" : "text-muted-foreground")}
              strokeWidth={1.6}
            />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarBody({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex h-full flex-col gap-6 px-4 py-5">
      <div className="flex items-center justify-between px-1">
        <Link to="/home" onClick={onNavigate}>
          <Logo size={34} />
        </Link>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-surface/50 text-foreground transition-all hover:border-primary/50 hover:bg-surface"
        >
          {theme === "dark" ? (
            <Sun className="size-4 text-emerald-400" />
          ) : (
            <Moon className="size-4 text-emerald-600" />
          )}
        </button>
      </div>

      <NavLinks onNavigate={onNavigate} />

      <div className="mt-auto flex flex-col gap-3">
        <div className="card-premium px-3.5 py-3">
          <p className="font-display text-lg text-foreground">
            {(profile?.credits ?? 0).toLocaleString()}
          </p>
          <p className="text-[11px] text-muted-foreground">Credits left</p>
        </div>
        <AskSuggestion />

        <div className="flex items-center gap-2">
          <Link
            to="/settings"
            onClick={onNavigate}
            className="flex flex-1 items-center gap-3 rounded-xl border border-border/60 px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:text-foreground hover:border-primary/40"
          >
            <SettingsIcon className="size-[18px]" strokeWidth={1.6} />
            <span className="truncate">
              {profile?.display_name ?? "Account"}
            </span>
          </Link>
          <button
            type="button"
            onClick={toggleTheme}
            className="flex h-10 px-3 items-center justify-center rounded-xl border border-border/60 text-xs font-medium text-muted-foreground transition-all hover:border-primary/40 hover:text-foreground"
          >
            {theme === "dark" ? "Light" : "Dark"}
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="justify-start gap-3 px-3 text-muted-foreground hover:text-foreground"
          onClick={async () => {
            await supabase.auth.signOut();
            navigate({ to: "/auth" });
          }}
        >
          <LogOut className="size-[18px]" strokeWidth={1.6} />
          Sign out
        </Button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(80%_50%_at_50%_-10%,var(--glow),transparent_65%)]"
      />

      <aside className="sidebar-liquid fixed inset-y-0 left-0 z-30 hidden w-60 overflow-hidden border-r border-sidebar-border lg:block">
        <SidebarBody />
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/60 bg-background/80 px-4 py-3 backdrop-blur-xl lg:hidden">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open menu">
              <Menu className="size-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="sidebar-liquid w-64 overflow-hidden border-sidebar-border p-0">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SidebarBody onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>
        <Logo size={28} />
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Toggle theme"
          className="flex size-9 items-center justify-center rounded-xl border border-border/60 bg-surface/50 text-foreground"
        >
          {theme === "dark" ? <Sun className="size-4 text-emerald-400" /> : <Moon className="size-4 text-emerald-600" />}
        </button>
      </header>

      <main className="lg:pl-60">
        <div key={path} className="route-enter">
          {children}
        </div>
      </main>
    </div>
  );
}
