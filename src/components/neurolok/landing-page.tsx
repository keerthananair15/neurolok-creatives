import { Link } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowRight,
  Boxes,
  Check,
  Clapperboard,
  Film,
  FolderKanban,
  Image as ImageIcon,
  Layers3,
  MoveUpRight,
  Play,
  Sparkles,
  WandSparkles,
} from "lucide-react";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import neuralImage from "@/assets/landing-neural.jpg";
import fashionImage from "@/assets/landing-fashion.jpg";
import productImage from "@/assets/landing-product.jpg";
import characterImage from "@/assets/landing-character.jpg";
import sample1 from "@/assets/sample-1.jpg";
import sample3 from "@/assets/sample-3.jpg";
import sample4 from "@/assets/sample-4.jpg";
import sample5 from "@/assets/sample-5.jpg";
import sample6 from "@/assets/sample-6.jpg";

const authSearch = (mode: "signin" | "signup") => ({ mode });

function AuthLink({
  mode = "signup",
  children,
  className,
}: {
  mode?: "signin" | "signup";
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Button asChild className={className}>
      <Link to="/auth" search={authSearch(mode)}>
        {children}
      </Link>
    </Button>
  );
}

function Eyebrow({ children, inverse = false }: { children: React.ReactNode; inverse?: boolean }) {
  return (
    <p className={inverse ? "landing-eyebrow text-landing-dark-muted" : "landing-eyebrow text-landing-accent"}>
      {children}
    </p>
  );
}

function NeuralLine({ dark = false }: { dark?: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 900 80"
      className={dark ? "neural-line text-landing-dark-muted" : "neural-line text-landing-accent"}
      preserveAspectRatio="none"
    >
      <path d="M2 45 C130 45, 116 15, 230 25 S340 75, 455 44 S610 5, 690 34 S790 70, 898 30" />
      <circle cx="230" cy="25" r="4" />
      <circle cx="455" cy="44" r="4" />
      <circle cx="690" cy="34" r="4" />
    </svg>
  );
}

function Hero() {
  return (
    <section className="landing-hero relative min-h-[760px] overflow-hidden px-5 pb-20 pt-36 sm:px-8 lg:pb-28 lg:pt-44">
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
        <div className="relative z-10 max-w-2xl">
          <Eyebrow>AI creative intelligence</Eyebrow>
          <h1 className="mt-7 font-display text-[clamp(4rem,9vw,8.8rem)] font-medium leading-[0.82] text-landing-ink">
            Create
            <br />
            anything.
          </h1>
          <p className="mt-8 max-w-lg text-lg leading-relaxed text-landing-muted sm:text-xl">
            From a simple idea to stunning images, videos and complete campaigns.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <AuthLink className="landing-primary h-12 rounded-full px-7 text-sm">
              Start creating <ArrowRight />
            </AuthLink>
            <Button asChild variant="ghost" className="h-12 rounded-full px-6 text-landing-ink hover:bg-landing-soft">
              <a href="#idea">Explore Neurolok <ArrowDown /></a>
            </Button>
          </div>
        </div>

        <div className="hero-art relative mx-auto h-[470px] w-full max-w-[720px] sm:h-[590px]">
          <div className="liquid-frame absolute inset-[8%_10%_10%_8%] overflow-hidden rounded-[3rem]">
            <img
              src={neuralImage}
              alt="A flowing glass neural form representing an idea becoming a creative"
              width={1600}
              height={1200}
              fetchPriority="high"
              className="size-full object-cover"
            />
            <div className="absolute inset-x-6 bottom-6 flex items-center justify-between rounded-2xl border border-landing-glass-border bg-landing-glass px-4 py-3 backdrop-blur-xl">
              <span className="text-xs font-medium text-landing-ink">Idea understood</span>
              <span className="inline-flex items-center gap-2 text-xs text-landing-accent"><Sparkles /> Creative ready</span>
            </div>
          </div>
          <figure className="hero-float hero-float-one absolute left-0 top-0 w-[28%] overflow-hidden rounded-2xl border-4 border-landing-bg shadow-landing-media">
            <img src={productImage} alt="Luxury product visual generated with Neurolok" width={1408} height={1056} className="aspect-[4/5] w-full object-cover" />
          </figure>
          <figure className="hero-float hero-float-two absolute bottom-0 right-0 w-[31%] overflow-hidden rounded-2xl border-4 border-landing-bg shadow-landing-media">
            <img src={fashionImage} alt="Editorial footwear image generated with Neurolok" width={1200} height={1504} className="aspect-[4/5] w-full object-cover" />
          </figure>
          <div className="hero-float hero-float-three absolute right-1 top-[8%] inline-flex items-center gap-2 rounded-full border border-landing-glass-border bg-landing-glass px-4 py-2 text-xs font-medium text-landing-ink shadow-landing-soft backdrop-blur-xl">
            <Play className="fill-landing-accent text-landing-accent" /> Video ready
          </div>
        </div>
      </div>
    </section>
  );
}

function BigIdea() {
  const outputs = [
    { icon: ImageIcon, label: "Image" },
    { icon: Film, label: "Video" },
    { icon: Layers3, label: "Campaign" },
  ];
  return (
    <section id="idea" className="landing-section border-y border-landing-line bg-landing-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-3xl">
          <Eyebrow>One idea is all it takes</Eyebrow>
          <h2 className="landing-title mt-6">Your idea is enough.</h2>
          <p className="landing-copy mt-6 max-w-2xl">
            You don’t need complicated prompting or a list of AI models. Describe what you want.
            Neurolok handles the creative intelligence behind it.
          </p>
        </div>
        <div className="relative mt-20 grid gap-6 md:grid-cols-[1fr_0.8fr_1.35fr] md:items-center">
          <div className="landing-process-block">
            <span className="text-xs text-landing-muted">Your idea</span>
            <p className="mt-4 font-display text-2xl text-landing-ink">“A cinematic launch for my new product.”</p>
          </div>
          <div className="flex items-center justify-center py-5">
            <div className="landing-orbit"><Logo size={42} withWordmark={false} /></div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {outputs.map(({ icon: Icon, label }) => (
              <div key={label} className="landing-output">
                <Icon className="text-landing-accent" />
                <span>{label}</span>
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 hidden -translate-y-1/2 md:block"><NeuralLine /></div>
        </div>
      </div>
    </section>
  );
}

const OUTPUTS = [
  { number: "01", title: "Images", copy: "Create high-quality visuals from simple ideas.", image: productImage, alt: "Luxury perfume campaign image", shape: "aspect-[16/10]" },
  { number: "02", title: "Videos", copy: "Turn concepts into cinematic videos.", image: sample5, alt: "Cinematic motorcycle sequence", shape: "aspect-[16/9]" },
  { number: "03", title: "Campaigns", copy: "Transform one product or idea into a complete creative campaign.", image: fashionImage, alt: "Editorial footwear campaign", shape: "aspect-[16/10]" },
];

function CoreOutputs() {
  return (
    <section id="product" className="landing-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>From thought to finished work</Eyebrow>
        <div className="mt-16 space-y-24 lg:space-y-32">
          {OUTPUTS.map((item, index) => (
            <article key={item.title} className="reveal-group grid items-end gap-8 lg:grid-cols-[0.7fr_1.3fr]">
              <div className={index % 2 ? "lg:order-2 lg:pl-12" : ""}>
                <span className="text-sm text-landing-accent">{item.number}</span>
                <h2 className="mt-4 font-display text-5xl text-landing-ink sm:text-7xl">{item.title}</h2>
                <p className="mt-5 max-w-sm text-lg leading-relaxed text-landing-muted">{item.copy}</p>
              </div>
              <figure className={`landing-editorial-media ${item.shape} ${index % 2 ? "lg:order-1" : ""}`}>
                <img src={item.image} alt={item.alt} loading="lazy" className="size-full object-cover" />
                {item.title === "Videos" && <span className="landing-play"><Play className="fill-current" /></span>}
              </figure>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  { label: "Pilot", title: "Simple by default.", copy: "Tell Neurolok what you want. Pilot chooses the right model, settings and generation path for you.", image: neuralImage, tag: "Auto assist" },
  { label: "Director", title: "Control when you want it.", copy: "Open up camera, lighting, motion, duration and quality controls without leaving the same creative flow.", image: sample1, tag: "Manual control" },
  { label: "Characters", title: "Consistency, creation after creation.", copy: "Create digital characters once, keep them organized and reuse them across images, videos and stories.", image: characterImage, tag: "Reusable identity" },
  { label: "Storyboards", title: "See the story before it moves.", copy: "Turn a concept into a structured shot-by-shot visual story, then refine every scene before generation.", image: sample4, tag: "Shot by shot" },
  { label: "Campaign Engine", title: "One input. A complete campaign.", copy: "Build image variants, ad concepts, product posters and videos from one product or idea.", image: sample6, tag: "Multiple outputs" },
  { label: "Trend Creation", title: "A reference, made your own.", copy: "Bring a reference or trending video and create original variations side by side.", image: sample5, tag: "Reference to variation" },
];

function FeatureStory() {
  return (
    <section id="features" className="landing-section bg-landing-ink text-landing-dark-text">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow inverse>One interface. Two modes. Zero confusion.</Eyebrow>
        <h2 className="mt-6 max-w-4xl font-display text-5xl leading-[0.95] sm:text-7xl lg:text-8xl">Power that meets you where you are.</h2>
        <div className="mt-24 space-y-24">
          {FEATURES.map((feature, index) => (
            <article key={feature.label} className="feature-row grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
              <figure className={`feature-visual ${index % 2 ? "lg:order-2" : ""}`}>
                <img src={feature.image} alt={`${feature.label} creative example`} loading="lazy" className="size-full object-cover" />
                <span className="absolute left-5 top-5 rounded-full border border-landing-dark-line bg-landing-dark-glass px-3 py-1.5 text-xs text-landing-dark-text backdrop-blur-xl">{feature.tag}</span>
              </figure>
              <div className={index % 2 ? "lg:order-1" : ""}>
                <p className="text-sm text-landing-accent-bright">{String(index + 1).padStart(2, "0")} — {feature.label}</p>
                <h3 className="mt-5 font-display text-4xl leading-tight sm:text-6xl">{feature.title}</h3>
                <p className="mt-6 max-w-lg text-lg leading-relaxed text-landing-dark-muted">{feature.copy}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Spaces() {
  return (
    <section className="landing-section overflow-hidden bg-landing-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[0.75fr_1.25fr]">
          <div>
            <Eyebrow>Spaces</Eyebrow>
            <h2 className="landing-title mt-6">Everything for your project. One Space.</h2>
            <p className="landing-copy mt-6">References, characters, generated work and full campaigns stay together, ready whenever your next idea needs them.</p>
          </div>
          <div className="space-workspace">
            <div className="space-sidebar">
              <div className="mb-6 flex items-center gap-2 text-sm font-medium"><FolderKanban className="text-landing-accent" /> Aster launch</div>
              {['Overview', 'References', 'Characters', 'Creations', 'Campaign'].map((item, i) => <div key={item} className={i === 0 ? "space-nav-active" : "space-nav"}>{item}</div>)}
            </div>
            <div className="space-canvas">
              <div className="flex items-center justify-between"><span className="font-display text-xl">Aster launch</span><span className="text-xs text-landing-muted">12 assets</span></div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {[productImage, fashionImage, sample3, characterImage, sample6, neuralImage].map((image, i) => (
                  <figure key={image} className={`overflow-hidden rounded-xl bg-landing-bg ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                    <img src={image} alt="Creative organized inside a Neurolok Space" loading="lazy" className="aspect-square size-full object-cover" />
                  </figure>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const SHOWCASE = [
  { image: productImage, label: "Product photography", className: "md:col-span-2 md:row-span-2" },
  { image: fashionImage, label: "Fashion visuals", className: "md:row-span-2" },
  { image: sample6, label: "Posters", className: "" },
  { image: characterImage, label: "Characters", className: "md:col-span-2" },
  { image: sample5, label: "Cinematic videos", className: "md:col-span-2" },
  { image: sample3, label: "AI images", className: "" },
];

function Showcase() {
  return (
    <section className="landing-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>Selected creative</Eyebrow>
        <h2 className="landing-title mt-6">Made with Neurolok.</h2>
        <div className="mt-14 grid auto-rows-[230px] grid-cols-1 gap-4 md:grid-cols-3">
          {SHOWCASE.map((item) => (
            <figure key={item.label} className={`showcase-tile group ${item.className}`}>
              <img src={item.image} alt={item.label} loading="lazy" className="size-full object-cover" />
              <figcaption>{item.label}<MoveUpRight /></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

const STEPS = [
  ["01", "Describe", "Tell Neurolok your idea."],
  ["02", "Generate", "Neurolok turns your idea into creative."],
  ["03", "Refine", "Remix, recreate or upscale."],
  ["04", "Create more", "Turn the result into campaigns, videos and more."],
] as const;

function HowItWorks() {
  return (
    <section className="landing-section border-y border-landing-line bg-landing-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <Eyebrow>How it works</Eyebrow>
        <h2 className="landing-title mt-6">Creative, without the complexity.</h2>
        <div className="relative mt-20 grid gap-10 md:grid-cols-4">
          {STEPS.map(([number, title, copy]) => (
            <div key={number} className="relative z-10">
              <span className="inline-flex size-11 items-center justify-center rounded-full bg-landing-ink text-xs text-landing-dark-text">{number}</span>
              <h3 className="mt-6 font-display text-2xl text-landing-ink">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-landing-muted">{copy}</p>
            </div>
          ))}
          <div className="pointer-events-none absolute left-0 right-0 top-1 hidden md:block"><NeuralLine /></div>
        </div>
      </div>
    </section>
  );
}

const PLANS = [
  { name: "Starter", price: "₹0", hint: "Explore Neurolok", features: ["Daily creative credits", "Image generation", "Personal library"] },
  { name: "Creator", price: "₹999", hint: "For active creators", featured: true, features: ["More monthly credits", "Images and videos", "Pilot and Director", "Characters and storyboards"] },
  { name: "Studio", price: "₹2,499", hint: "For brands and teams", features: ["High-volume credits", "Campaign Engine", "Trend creation", "Priority generations"] },
];

function Pricing() {
  return (
    <section id="pricing" className="landing-section">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="max-w-2xl"><Eyebrow>Simple INR pricing</Eyebrow><h2 className="landing-title mt-6">Choose how far your ideas go.</h2></div>
        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {PLANS.map((plan) => (
            <article key={plan.name} className={plan.featured ? "price-card price-card-featured" : "price-card"}>
              <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-2xl text-landing-ink">{plan.name}</h3><p className="mt-1 text-sm text-landing-muted">{plan.hint}</p></div>{plan.featured && <span className="rounded-full bg-landing-accent px-3 py-1 text-xs text-landing-accent-contrast">Recommended</span>}</div>
              <p className="mt-10 font-display text-5xl text-landing-ink">{plan.price}<span className="text-sm font-normal text-landing-muted">{plan.price !== "₹0" ? "/month" : ""}</span></p>
              <ul className="mt-8 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-3 text-sm text-landing-muted"><Check className="text-landing-accent" /> {feature}</li>)}</ul>
              <AuthLink className={plan.featured ? "landing-primary mt-10 h-11 w-full rounded-full" : "mt-10 h-11 w-full rounded-full bg-landing-ink text-landing-dark-text hover:bg-landing-ink-soft"}>Start creating <ArrowRight /></AuthLink>
            </article>
          ))}
        </div>
        <p className="mt-5 text-center text-xs text-landing-muted">Proposed launch plans. Billing is not active yet.</p>
      </div>
    </section>
  );
}

function FinalCta() {
  return (
    <section className="px-4 pb-4 sm:px-6 sm:pb-6">
      <div className="final-cta relative mx-auto max-w-[1500px] overflow-hidden rounded-[2rem] px-6 py-24 text-center sm:py-32">
        <div className="relative z-10 mx-auto max-w-3xl">
          <Eyebrow inverse>Your creative starts here</Eyebrow>
          <h2 className="mt-6 font-display text-5xl leading-[0.95] text-landing-dark-text sm:text-7xl lg:text-8xl">Your next idea is waiting.</h2>
          <p className="mx-auto mt-6 max-w-xl text-lg text-landing-dark-muted">Bring the idea. Neurolok will take it from there.</p>
          <AuthLink className="mt-10 h-12 rounded-full bg-landing-dark-text px-7 text-landing-ink hover:bg-landing-dark-muted">Start creating <ArrowRight /></AuthLink>
        </div>
        <div className="absolute inset-x-8 bottom-5 opacity-40"><NeuralLine dark /></div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-landing-bg px-5 pb-10 pt-20 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <Logo size={54} />
        <div className="mt-12 flex flex-col justify-between gap-10 border-t border-landing-line pt-8 md:flex-row md:items-end">
          <p className="max-w-xl font-display text-3xl leading-tight text-landing-ink sm:text-5xl">Ideas in. Extraordinary creative out.</p>
          <nav aria-label="Footer" className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-landing-muted">
            <a href="#product">Product</a><a href="#features">Features</a><a href="#pricing">Pricing</a><Link to="/auth" search={authSearch("signin")}>Login</Link>
          </nav>
        </div>
        <div className="mt-12"><NeuralLine /></div>
      </div>
    </footer>
  );
}

export function LandingPage() {
  return (
    <div className="landing min-h-screen bg-landing-bg text-landing-ink">
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 sm:px-6">
        <nav className="landing-nav mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 sm:px-5" aria-label="Main navigation">
          <a href="#top" aria-label="Neurolok home"><Logo size={32} /></a>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" className="rounded-full px-4 text-landing-ink hover:bg-landing-soft"><Link to="/auth" search={authSearch("signin")}>Login</Link></Button>
            <Button asChild className="landing-primary rounded-full px-5"><Link to="/auth" search={authSearch("signup")}>Sign Up</Link></Button>
          </div>
        </nav>
      </header>
      <main id="top">
        <Hero />
        <BigIdea />
        <CoreOutputs />
        <FeatureStory />
        <Spaces />
        <Showcase />
        <HowItWorks />
        <Pricing />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}