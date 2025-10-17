import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, BarChart3, Sparkles, Home } from 'lucide-react';
import { Footer } from '@/components/Footer';

type StripeBuyButtonProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
  'buy-button-id': string;
  'publishable-key': string;
  className?: string;
};

const StripeBuyButton: React.FC<StripeBuyButtonProps> = (props) =>
  React.createElement('stripe-buy-button', props as any);

const getMimeType = (filename: string) => {
  const extension = filename.split('.').pop()?.toLowerCase();

  switch (extension) {
    case 'mov':
      return undefined;
    case 'webm':
      return 'video/webm';
    case 'mp4':
    default:
      return 'video/mp4';
  }
};

const testimonialVideos = [
  {
    title: 'Bobby Han',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Bobby%20Han.MOV',
    type: getMimeType('Bobby Han.MOV')
  },
  {
    title: 'Brandon',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Brandon%20-%20(1).mp4',
    type: getMimeType('Brandon - (1).mp4')
  },
  {
    title: 'Colten',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Colten%20(1).mov',
    type: getMimeType('Colten (1).mov')
  },
  {
    title: 'Drew',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Drew%20(1).mp4',
    type: getMimeType('Drew (1).mp4')
  },
  {
    title: 'Elena',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Elena%20(1).mp4',
    type: getMimeType('Elena (1).mp4')
  },
  {
    title: 'Emmanuel',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Emmanuel%201.mp4',
    type: getMimeType('Emmanuel 1.mp4')
  },
  {
    title: 'Liz Garcia',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Liz%20Garcia.mp4',
    type: getMimeType('Liz Garcia.mp4')
  },
  {
    title: 'Mahmoud',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Mahmoud%20(1).mp4',
    type: getMimeType('Mahmoud (1).mp4')
  },
  {
    title: 'Maria Allie Forte-Charette',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Maria%20allie%20Forte-Charette%20(1).mp4',
    type: getMimeType('Maria allie Forte-Charette (1).mp4')
  },
  {
    title: 'Ryan',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/Ryan.MOV',
    type: getMimeType('Ryan.MOV')
  },
  {
    title: 'Bishoi',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/bISHOI%20(1)%20(1).mp4',
    type: getMimeType('bISHOI (1) (1).mp4')
  },
  {
    title: 'Shante',
    src: 'https://pub-187e14117d624770a9f8a5b04835d33c.r2.dev/testimonials/shante%20(1).mp4',
    type: getMimeType('shante (1).mp4')
  }
];

const proFeatures = [
  'Weekly Live Training & Invited Experts',
  'Rentalizer.ai™ Student Portal & Deal Analyzer',
  'Done-For-You Market Research',
  'Personalized Roadmap & Accountability',
  'Train & Deploy Your Virtual Assistant',
  'Close Your First Six Cash-Flowing Properties'
];


export default function Sales() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptId = 'stripe-buy-button-script';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.async = true;
      script.src = 'https://js.stripe.com/v3/buy-button.js';
      document.body.appendChild(script);
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const brandButton = () => {
      const elements = Array.from(document.querySelectorAll('stripe-buy-button')) as Array<
        (HTMLElement & { shadowRoot?: ShadowRoot }) | null
      >;

      elements.forEach((element) => {
        if (!element?.shadowRoot) return;
        const button = element.shadowRoot.querySelector('button') as (HTMLButtonElement & {
          dataset: DOMStringMap;
        }) | null;
        if (!button || button.dataset.rentalizerStyled) return;

        button.dataset.rentalizerStyled = 'true';
        button.style.background = 'linear-gradient(130deg, rgba(56,189,248,1) 0%, rgba(99,102,241,1) 100%)';
        button.style.color = '#0b1120';
        button.style.borderRadius = '9999px';
        button.style.border = '1px solid rgba(56,189,248,0.65)';
        button.style.padding = '0.9rem 2.8rem';
        button.style.fontSize = '1.0625rem';
        button.style.fontWeight = '700';
        button.style.letterSpacing = '0.02em';
        button.style.width = '100%';
        button.style.boxShadow = '0 32px 60px -28px rgba(56,189,248,0.75)';
        button.style.transition = 'transform 150ms ease, box-shadow 150ms ease';

        const handleEnter = () => {
          button.style.transform = 'translateY(-1px) scale(1.01)';
          button.style.boxShadow = '0 38px 70px -30px rgba(99,102,241,0.65)';
        };

        const handleLeave = () => {
          button.style.transform = 'none';
          button.style.boxShadow = '0 32px 60px -28px rgba(56,189,248,0.75)';
        };

        button.addEventListener('mouseenter', handleEnter);
        button.addEventListener('mouseleave', handleLeave);
      });
    };

    let mutationObservers: MutationObserver[] = [];

    customElements.whenDefined('stripe-buy-button').then(() => {
      brandButton();

      const elements = Array.from(document.querySelectorAll('stripe-buy-button')) as Array<
        HTMLElement & { shadowRoot?: ShadowRoot }
      >;

      mutationObservers = elements
        .filter((element) => element.shadowRoot)
        .map((element) => {
          const observer = new MutationObserver(brandButton);
          observer.observe(element.shadowRoot as ShadowRoot, { childList: true, subtree: true });
          return observer;
        });
    });

    return () => {
      mutationObservers.forEach((observer) => observer.disconnect());
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative py-10 px-4 text-center">
        <div className="absolute top-4 left-4">
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="bg-slate-900/60 text-primary hover:text-primary-foreground hover:bg-primary/80"
          >
            <Link to="/" className="inline-flex items-center gap-2">
              <Home className="h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-3 mb-6">
            <BarChart3 className="h-12 w-12 text-primary neon-text" />
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Rentalizer
            </h1>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            The #1 Training Program To Build Rental Income Fast
          </h2>
          <p className="text-2xl md:text-3xl text-primary font-semibold">
            No Mortgage Needed
          </p>
        </div>
      </section>

      {/* Pricing Highlight */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Card className="relative overflow-hidden border-2 border-primary/70 bg-gradient-to-r from-slate-950 via-slate-900 to-primary/10 shadow-[0_35px_70px_-30px_rgba(56,189,248,0.8)]">
            <div className="absolute -top-24 -right-16 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-blue-500/20 blur-3xl" />
            <CardHeader className="pb-0">
              <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wide text-sm">
                <Sparkles className="h-4 w-4" />
                Concierge Launch Experience
              </div>
            </CardHeader>
            <CardContent className="md:flex md:items-center md:justify-between gap-10 px-8 pb-10 pt-6">
              <div className="md:w-7/12 space-y-6">
                <div>
                  <CardTitle className="text-4xl font-bold text-foreground">Accelerator Pro</CardTitle>
                  <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
                    Partner directly with Richie and the Rentalizer team for a turnkey launch. We co-build your systems,
                    line up winning properties, and hand you a business engineered to cash flow from day one.
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {proFeatures.map((feature) => (
                    <div key={feature} className="flex items-start gap-2 rounded-lg bg-slate-900/70 px-4 py-3 border border-slate-800/80">
                      <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="md:w-5/12 mt-8 md:mt-0 flex flex-col items-center md:items-end text-center md:text-right space-y-5">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-primary/80">All-In Investment</span>
                  <div className="text-5xl font-extrabold text-primary drop-shadow-lg">$10,000</div>
                  <p className="text-muted-foreground text-sm">12 months of private support • Limited Cohort</p>
                </div>
                <div className="w-full md:w-auto flex flex-col items-center md:items-end gap-4">
                  <div className="relative w-full md:w-auto max-w-sm">
                    <div className="absolute inset-0 -z-10 rounded-full bg-primary/30 blur-xl opacity-70" />
                    <div className="relative w-full rounded-full border border-primary/40 bg-slate-950/80 px-4 py-4 shadow-lg shadow-primary/30 backdrop-blur">
                      <StripeBuyButton
                        className="block w-full"
                        buy-button-id="buy_btn_1S1qNLGiyV9r2LUGhCoFgbzZ"
                        publishable-key="pk_live_51Mj9IfGiyV9r2LUGCgvUVh7w4ZBxXTco98HDuHi8n0EITVkk1imtOy4THIaglnSbNRpCWuS5wELXvKOtFXZND18r00TJXjfXuK"
                      />
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={() => window.open('https://buy.stripe.com/8x200jgCd0QG7JW6Ep3AY05', '_blank')}
                    className="w-full md:w-auto max-w-sm rounded-full border border-primary/40 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/40 hover:bg-primary hover:text-primary-foreground transition-all"
                  >
                    Prefer direct link? Open secure checkout
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
                  Ideal for operators ready to launch or scale fast without guessing. We bring the deals, the playbook, and the accountability.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
      {/* Success Story Section */}
      <section className="py-8 px-4 bg-secondary/30">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-xl md:text-2xl text-foreground leading-relaxed">
            Our live training program has been proven and replicated by hundreds of our students — without much capital, or a real estate license.
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-primary">
            Here's what your success story might look like in &lt;2 months:
          </h3>
          <div className="grid md:grid-cols-2 gap-6 text-left max-w-3xl mx-auto mt-8">
            <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-lg border-2 border-slate-600/80 hover:border-slate-500 transition-all shadow-lg">
              <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-lg text-foreground">1-4 Cash Flowing Properties</span>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-lg border-2 border-slate-600/80 hover:border-slate-500 transition-all shadow-lg">
              <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-lg text-foreground">$10K–$25K/Month Automated Income</span>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-lg border-2 border-slate-600/80 hover:border-slate-500 transition-all shadow-lg">
              <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-lg text-foreground">Hands-Off Operations System Managing Guests, Cleanings, Bookings</span>
            </div>
            <div className="flex items-start gap-3 bg-slate-900/60 p-5 rounded-lg border-2 border-slate-600/80 hover:border-slate-500 transition-all shadow-lg">
              <Check className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <span className="text-lg text-foreground">True Income Freedom — A Strategy That Doesn't Require Property Ownership</span>
            </div>
          </div>
        </div>
      </section>

      {/* Video Testimonials Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl md:text-4xl font-bold text-center text-foreground mb-12">
            Just Listen To What Our Students Say
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {testimonialVideos.map((video) => (
              <div
                key={video.title}
                className="space-y-3 bg-slate-900/60 p-4 rounded-lg border border-slate-700 hover:border-primary/50 transition-all shadow-lg"
              >
                <div className="relative aspect-video overflow-hidden rounded-md bg-black">
                  <video
                    className="h-full w-full object-cover"
                    controls
                    preload="metadata"
                  >
                    <source src={video.src} type={video.type} />
                    Your browser does not support the video tag.
                  </video>
                </div>
                <p className="text-sm text-center text-foreground font-medium">{video.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
