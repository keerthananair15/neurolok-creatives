# Neurolok Public Landing Page

Build a single, public storytelling page at `/` that introduces Neurolok and funnels visitors into the existing authentication and creation experience. The existing studio, generation tools, saved work, and authenticated pages remain intact.

## Public experience

- Replace the current root redirect with a responsive, single-page Neurolok landing page.
- Add a minimal floating navbar with the Neurolok logo, Login, and Sign Up. Both actions open the existing `/auth` experience; Sign Up will open it in sign-up mode.
- Build the requested narrative in one continuous flow:
  1. **Hero:** “Create anything.” with the supplied supporting copy, primary and secondary actions, layered product/media previews, and a restrained neural liquid-glass centerpiece.
  2. **The big idea:** “Your idea is enough.” with an animated Idea → Neurolok → Image / Video / Campaign pathway.
  3. **Core outputs:** large editorial treatments for Images, Videos, and Campaigns rather than small feature cards.
  4. **Product story:** alternating visual sections for Pilot, Director, Characters, Storyboards, Campaign Engine, and Trend Creation, using terminology confirmed in the Product Blueprint.
  5. **Spaces:** a workspace-style composition showing references, characters, generated assets, campaigns, and project organization together.
  6. **Made with Neurolok:** a media-led masonry showcase covering AI imagery, product photography, fashion, posters, characters, and cinematic video.
  7. **How it works:** Describe, Generate, Refine, Create more, connected by one continuous neural/liquid line.
  8. **Pricing:** Starter ₹0, Creator ₹999/month, and Studio ₹2,499/month; Creator receives the restrained emerald recommended treatment. Benefits will be concise and presented as proposed launch positioning rather than wired billing.
  9. **Final CTA and footer:** a dark visual climax with “Your next idea is waiting.”, direct authentication CTA, large logo, tagline, and minimal in-page links.

## Visual direction

- Give the public page its own light palette: off-white surfaces, black/charcoal typography, and restrained emerald accents, without changing the dark studio theme.
- Use Helvetica/system sans for interface copy and the existing Outfit font selectively for large display moments; keep the uploaded Neurolok logo as the brand identity.
- Use liquid glass only for the floating navigation, hero centerpiece, selected overlays, and pricing emphasis.
- Create a cohesive set of new product-focused, cinematic media assets with no portrait photography; use existing app imagery where it fits.
- Add refined scroll reveals, floating depth, image hover movement, and neural-line animation with full reduced-motion support.
- Ensure mobile layouts retain the story order, readable type, stable media framing, and accessible controls.

## App handoff

- Keep all CTAs connected to the existing `/auth` page; preserve email/password and Google authentication.
- Allow the auth page to read whether the visitor chose Login or Sign Up without creating another authentication screen.
- Change successful email, sign-up, Google, and already-authenticated handoffs to the existing `/create` workspace, including the OAuth return path.
- Do not rebuild, embed, or duplicate any generation or dashboard interface on the landing page.

## Technical details

- Implement the public page as focused landing components plus landing-specific semantic design tokens, keeping the existing authenticated design tokens authoritative for the app.
- Use semantic links and in-page anchors for Explore Neurolok, Product, Features, and Pricing; all account actions use the existing typed `/auth` route.
- Add unique landing-page metadata, social metadata, one H1, semantic sections, useful image alt text, and lazy loading below the fold.
- Validate the public page and the full landing → auth → create flow at desktop and mobile sizes, including reduced-motion behavior and browser errors.

## Not included

- No second generator, dashboard, authentication system, or duplicate creation workflow.
- No payment checkout or live subscription billing; pricing actions lead to authentication.
- No changes to generation logic, saved-work behavior, or the authenticated studio feature set beyond the requested post-auth destination.
