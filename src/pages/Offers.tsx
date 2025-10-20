import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, BarChart3, Home } from 'lucide-react';
import { Footer } from '@/components/Footer';

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
  'Weekly Live Training',
  'Invited Expert Panelists',
  'Video & Documents Library',
  'Rentalizer.ai™ Student Portal',
  'Private Community Membership',
  'Personalized Roadmap',
  'Done For You Market Research',
  'Close Your 1st 6 Properties',
  'Train Your Virtual Assistant'
];


export default function Offers() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 via-slate-900 to-slate-800">
      {/* Hero Section */}
      <section className="relative py-10 px-4 text-center">
        <div className="absolute top-4 left-4 hidden md:block">
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
            <Link
              to="/"
              className="inline-flex items-center gap-3 rounded-md px-3 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/80 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <BarChart3 className="h-12 w-12 text-primary neon-text" />
              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Rentalizer
              </h1>
            </Link>
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
      <section className="py-6 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="mx-auto w-full sm:max-w-xl bg-slate-900/80 backdrop-blur-md border-2 border-primary/70 hover:border-primary/80 transition-all shadow-2xl shadow-primary/25 hover:shadow-primary/35 relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-bl-lg">
              POPULAR
            </div>
            <CardHeader className="pb-4 pt-6 space-y-3 text-center">
              <CardTitle className="text-3xl font-bold text-foreground">Accelerator Pro</CardTitle>
              <div className="space-y-1">
                <div className="text-5xl font-bold text-primary">$10,000</div>
                <p className="text-muted-foreground text-sm">12-Months</p>
              </div>
            </CardHeader>
            <CardContent className="px-8 pb-8 space-y-4 text-left">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground text-base leading-relaxed">{feature}</span>
                </div>
              ))}
              <p className="text-xs text-muted-foreground mt-4 pt-4 border-t border-border italic leading-relaxed">
                Accelerator Pro is for individuals aiming for turnkey comprehensive personalized guidance from Richie--to achieve their dream outcome.
              </p>
              <div className="pt-4 text-center">
                <Button
                  variant="ghost"
                  onClick={() => window.open('https://buy.stripe.com/8x200jgCd0QG7JW6Ep3AY05', '_blank')}
                  className="mx-auto w-full max-w-xs rounded-full border border-primary/60 bg-slate-950/80 px-6 py-3 text-sm font-semibold text-primary shadow-lg shadow-primary/40 hover:bg-primary hover:text-primary-foreground transition-all"
                >
                  Get Started
                </Button>
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
