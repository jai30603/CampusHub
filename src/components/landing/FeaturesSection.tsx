import React from 'react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/ui/Badge';
import {
  ShieldCheck,
  Lock,
  Sparkles,
  PlusCircle,
  Heart,
  MessageSquare,
  Zap,
  Layout,
} from 'lucide-react';

const FEATURES = [
  {
    icon: ShieldCheck,
    title: 'Verified Student Profiles',
    description: 'Every user is authenticated using their official university (.edu) email address for total trust.',
    badge: 'Security',
  },
  {
    icon: Lock,
    title: 'Safe Campus Marketplace',
    description: 'Meet safely at campus hotspots, student union centers, or libraries for physical exchanges.',
    badge: 'Trust',
  },
  {
    icon: Sparkles,
    title: 'AI Smart Search',
    description: 'Filter items instantly by course codes, professor requirements, or ISBN textbook numbers.',
    badge: 'AI Tech',
  },
  {
    icon: PlusCircle,
    title: '60-Second Easy Listing',
    description: 'Snap photos, set your price, and post your textbook or gear in under a minute with zero fees.',
    badge: 'Speed',
  },
  {
    icon: Heart,
    title: 'Instant Wishlists',
    description: 'Save items to your wishlist and get notified when sellers drop prices or accept offers.',
    badge: 'Convenience',
  },
  {
    icon: MessageSquare,
    title: 'Real-time In-App Chat',
    description: 'Negotiate price and set up pickup times securely without exposing personal phone numbers.',
    badge: 'Communication',
  },
  {
    icon: Zap,
    title: 'Fast Discovery Engine',
    description: 'Hyper-local search prioritizes listings located directly on your specific college campus.',
    badge: 'Local',
  },
  {
    icon: Layout,
    title: 'Premium SaaS UI/UX',
    description: 'Enjoy a sleek, distraction-free interface built for mobile and desktop with dark mode support.',
    badge: 'Design',
  },
];

export const FeaturesSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border bg-card/30">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="default">Why CampusHub?</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Built Specifically for University Communities
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            We removed the friction, high fees, and safety concerns of generic marketplaces.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((feat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 hover:-translate-y-1 shadow-xs space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <feat.icon className="w-5 h-5" />
                </div>
                <Badge variant="secondary" className="text-[10px]">
                  {feat.badge}
                </Badge>
              </div>
              <h3 className="text-base font-bold text-foreground">{feat.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{feat.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
