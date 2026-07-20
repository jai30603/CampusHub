import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { GraduationCap, ShieldCheck, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground antialiased selection:bg-primary selection:text-primary-foreground">
      {/* Left Column: Branding Showcase & Value Propositions (Desktop Only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary/10 via-primary/5 to-background border-r border-border p-12 flex-col justify-between relative overflow-hidden">
        {/* Background Subtle Ambient Blob */}
        <div className="absolute top-1/3 left-1/3 w-[450px] h-[450px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Top Logo */}
        <div>
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="p-2.5 rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform shadow-md">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="font-bold text-xl tracking-tight text-foreground">
              Campus<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        {/* Center Marketing Copy & Feature Highlights */}
        <div className="space-y-8 max-w-lg">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold border border-primary/20">
              <Sparkles className="w-3.5 h-3.5" /> University Student Platform
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight text-foreground">
              Empowering Students to Trade & Save on Campus.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Join thousands of verified university students buying textbooks, selling dorm gear, and sharing academic resources.
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Simple Account Setup</h4>
                <p className="text-[11px] text-muted-foreground">Create an account with any valid email address and start trading.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3.5 rounded-xl bg-card border border-border/60 shadow-2xs">
              <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-foreground">Zero Seller Commission</h4>
                <p className="text-[11px] text-muted-foreground">Keep 100% of your earnings on every transaction.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Quote */}
        <div className="pt-6 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5 font-medium text-foreground">
            <CheckCircle2 className="w-4 h-4 text-primary" /> Trusted by 35+ Partner Campuses
          </span>
          <span>© {new Date().getFullYear()} CampusHub Inc.</span>
        </div>
      </div>

      {/* Right Column: Form Container (Responsive) */}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 relative">
        {/* Mobile Header Logo */}
        <div className="lg:hidden mb-8 text-center">
          <Link to={ROUTES.HOME} className="inline-flex items-center gap-2 group">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Campus<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>

        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
