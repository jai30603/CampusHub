import React from 'react';
import { HeroSection } from '@/components/landing/HeroSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { CategoriesSection } from '@/components/landing/CategoriesSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorksSection } from '@/components/landing/HowItWorksSection';
import { FeaturedPreviewSection } from '@/components/landing/FeaturedPreviewSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { FaqSection } from '@/components/landing/FaqSection';
import { CtaSection } from '@/components/landing/CtaSection';

export const Home: React.FC = () => {
  return (
    <div className="space-y-0">
      <HeroSection />
      <StatsSection />
      <CategoriesSection />
      <FeaturesSection />
      <HowItWorksSection />
      <FeaturedPreviewSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
    </div>
  );
};
