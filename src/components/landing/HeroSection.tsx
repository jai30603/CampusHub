import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Search, ShieldCheck, BookOpen, Laptop, Tag, PlusCircle } from 'lucide-react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ROUTES } from '@/constants/routes';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden pt-12 md:pt-20 pb-16 md:pb-24 border-b border-border bg-gradient-to-b from-primary/5 via-background to-background">
      {/* Background Subtle Gradient Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

      <Container className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Text Content */}
        <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
          <Badge variant="default" className="inline-flex items-center gap-1.5 py-1 px-3.5 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
            <Sparkles className="w-3.5 h-3.5" /> Next-Gen Campus Peer-to-Peer Platform
          </Badge>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            Everything a College Student Needs, <span className="bg-gradient-to-r from-primary via-blue-500 to-purple-600 bg-clip-text text-transparent">All in One Place.</span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
            The safe, verified marketplace for university students. <strong className="text-foreground font-semibold">Buy</strong> textbooks, <strong className="text-foreground font-semibold">Sell</strong> unused gear, <strong className="text-foreground font-semibold">Exchange</strong> course notes, or <strong className="text-foreground font-semibold">Donate</strong> dorm supplies directly on campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
            <Link to={ROUTES.MARKETPLACE} className="w-full sm:w-auto">
              <Button size="lg" variant="primary" className="w-full sm:w-auto shadow-md hover:shadow-lg transition-all" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Explore Marketplace
              </Button>
            </Link>
            <Link to={ROUTES.SELL} className="w-full sm:w-auto">
              <Button size="lg" variant="outline" className="w-full sm:w-auto" leftIcon={<PlusCircle className="w-4 h-4" />}>
                Sell an Item
              </Button>
            </Link>
          </div>

          <div className="flex items-center justify-center lg:justify-start gap-6 pt-4 text-xs text-muted-foreground border-t border-border/60">
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-4 h-4 text-emerald-500" /> Verified .edu Emails
            </span>
            <span className="flex items-center gap-1.5 font-medium text-foreground">
              <Tag className="w-4 h-4 text-primary" /> Zero Listing Fees
            </span>
          </div>
        </div>

        {/* Right Column: Floating SaaS Product Showcase Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="relative mx-auto max-w-md lg:max-w-none rounded-2xl border border-border bg-card/80 p-5 shadow-2xl backdrop-blur-xl space-y-4">
            {/* Search Bar Visual Mockup */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-accent/60 border border-border text-xs text-muted-foreground">
              <Search className="w-4 h-4 text-primary shrink-0" />
              <span>Search "CS101 Textbook", "MacBook Air", "Dorm Lamp"...</span>
              <kbd className="ml-auto px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘K</kbd>
            </div>

            {/* Mock Item Card 1 */}
            <div className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Algorithms 4th Edition</h4>
                  <p className="text-[11px] text-muted-foreground">IIT Delhi • Computer Science</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-primary">₹350</span>
                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-medium">Save 70%</span>
              </div>
            </div>

            {/* Mock Item Card 2 */}
            <div className="p-3.5 rounded-xl border border-border bg-background flex items-center justify-between gap-3 shadow-xs hover:border-primary/40 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-lg bg-purple-500/10 text-purple-500 shrink-0">
                  <Laptop className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">TI-84 Plus CE Calculator</h4>
                  <p className="text-[11px] text-muted-foreground">NIT Trichy • Hostel 4</p>
                </div>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-bold text-primary">₹4,500</span>
                <span className="block text-[10px] text-muted-foreground">Local Pickup</span>
              </div>
            </div>

            {/* Floating Verified Badge Floating Tag */}
            <div className="absolute -bottom-4 -left-4 rounded-xl bg-card border border-border p-3 shadow-xl flex items-center gap-2 text-xs font-semibold animate-bounce duration-1000">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-foreground">Campus Verified Sellers</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
