import React from 'react';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { ArrowRight, Sparkles } from 'lucide-react';

export const CtaSection: React.FC = () => {
  return (
    <section className="py-20 bg-background relative overflow-hidden">
      <Container className="relative">
        <div className="rounded-3xl bg-gradient-to-r from-primary via-blue-600 to-purple-600 p-8 sm:p-12 lg:p-16 text-center text-primary-foreground space-y-6 shadow-2xl relative overflow-hidden">
          {/* Background Decorative Blur */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-xs pointer-events-none" />

          <div className="relative z-10 space-y-4 max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" /> Start Saving & Trading Today
            </span>

            <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
              Ready to Join CampusHub?
            </h2>

            <p className="text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto leading-relaxed">
              Create your verified student account in under 60 seconds and start trading textbooks, electronics, and dorm gear with fellow students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link to={ROUTES.REGISTER} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 shadow-lg font-bold"
                  rightIcon={<ArrowRight className="w-4 h-4 text-primary" />}
                >
                  Register Account
                </Button>
              </Link>
              <Link to={ROUTES.MARKETPLACE} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10"
                >
                  Explore Marketplace
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};
