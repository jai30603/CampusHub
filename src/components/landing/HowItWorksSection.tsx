import React from 'react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/ui/Badge';
import { UserCheck, Search, MessageSquare, ShieldCheck, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    step: '01',
    icon: UserCheck,
    title: 'Register Account',
    description: 'Sign up using your university .edu email to unlock campus buyer & seller privileges.',
  },
  {
    step: '02',
    icon: Search,
    title: 'Browse Marketplace',
    description: 'Filter by your college, course code, professor notes, or item category.',
  },
  {
    step: '03',
    icon: MessageSquare,
    title: 'Connect with Seller',
    description: 'Chat directly in-app to negotiate prices, ask questions, and arrange meetups.',
  },
  {
    step: '04',
    icon: ShieldCheck,
    title: 'Reserve / Buy Item',
    description: 'Lock in your reservation with seller confirmation before campus meetup.',
  },
  {
    step: '05',
    icon: CheckCircle2,
    title: 'Complete Handoff',
    description: 'Meet at a safe campus location, verify item condition, and complete the trade.',
  },
];

export const HowItWorksSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border bg-background">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Simple 5-Step Process</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            How CampusHub Works
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            A seamless, stress-free experience from listing discovery to campus pickup.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {STEPS.map((s, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all duration-300 relative flex flex-col justify-between space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-extrabold text-primary bg-primary/10 px-2 py-1 rounded-md">
                  STEP {s.step}
                </span>
                <div className="p-2 rounded-lg bg-accent text-foreground">
                  <s.icon className="w-4 h-4" />
                </div>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-foreground">{s.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{s.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
