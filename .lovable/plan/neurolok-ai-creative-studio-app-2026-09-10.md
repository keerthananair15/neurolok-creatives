# Neurolok — AI Creative Studio App

Build the real Neurolok product experience (not a marketing site): a dark, premium creative workspace where anyone can type an idea and get images, videos, storyboards and full campaigns. This first build ships every screen and flow with sample media in place of live generation, plus sign-in so work is saved per account.

## Look and feel

- Deep black workspace, emerald/neon green accent used sparingly — Generate, active states, progress.
- Soft green ambient glow behind panels; frosted glass only on floating surfaces (composer, control drawers, overlays).
- Off-white text, cool grey-green muted text, medium-large rounded corners, restrained motion.
- The uploaded Neurolok logo becomes the brand mark in the sidebar, sign-in screen and browser icon.
- Media always dominates: results are big, chrome is quiet.

## Screens

1. **Sign in / sign up** — email + password, quiet branded screen, session persists.
2. **Onboarding** — one example idea and a "Try it" path; teaches by doing, no tutorial wall.
3. **Home** — "What are you creating today?" with a large idea composer, quick starts (Image, Video, Campaign, Storyboard), and recent work as a visual media grid.
4. **Create workspace** — the core screen.
   - Top: project name, Image/Video context, Pilot/Director toggle, credits.
   - Left: references, characters, project folders — the active creative context, always visible.
   - Center: the idea composer before generating; media results after.
   - Right: Pilot keeps it near-empty; Director reveals grouped controls.
   - Switching modes never clears the idea, references or results.
5. **Pilot mode** — default. Just the idea, context and one obvious Generate. Neurolok picks model, duration and quality; credit impact shown quietly; model override tucked behind a link.
6. **Director mode** — same screen, collapsible groups: Generation (model, duration, quality, aspect ratio), Camera (camera, angle, motion), Look (style, lighting), Advanced (negative prompt, seed, FPS).
7. **Generating** — calm human stages: Understanding idea → Enhancing creative direction → Selecting model → Generating. No technical logs.
8. **Results** — media-first grid; hover reveals Upscale, Remix, Recreate, More.
9. **Result detail** — large viewer, original idea and settings preserved, version history, same actions.
10. **Storyboard** — concept in, shot-by-shot scenes out, each scene refinable, primary next action Generate Video.
11. **Characters** — character sheets saved as reusable digital characters in folders; one-click "Add to creation".
12. **Campaign Engine** — one product image in, a campaign board out: 4 image variants, 4 ad concepts, 2 videos, product posters, grouped side by side.
13. **Trends** — upload a reference video, preview it, get variations shown side by side with the reference still visible.
14. **Projects / Library** — visual grids with filters (Images, Videos, Posters, Projects, Characters, Campaigns) and search.
15. **Settings** — profile, credits in ₹, preferences.
16. **Ask Suggestion** — a quiet always-available "What should we add to make Neurolok better?" field with one Send action.

## Behaviour in this build

Generation is simulated: pressing Generate runs the real progress stages and then returns curated sample images/videos, saved into the library like real results. Remix, Recreate and Upscale create new saved versions the same way. Every screen, action and saved record is real — only the model call is stubbed, so swapping in live generation later touches one layer.

## Technical notes

- TanStack Start + Tailwind v4; tokens (black, emerald, glass, gradients, radius, motion) defined in `src/styles.css`.
- Lovable Cloud enabled for accounts and storage: tables for profiles, projects, assets, characters, campaigns, storyboards, trends, credits and suggestions, each with row-level security so a user only sees their own work.
- Generation goes through a single server-side service module returning sample media, so the real model router drops in without UI changes.
- Sample cinematic media generated as project assets.
- Mobile: composer first, full-width media, controls in bottom sheets.

## Not in this build

- Live AI image/video generation and real credit billing (added on request).
- Payments / plan purchase.
