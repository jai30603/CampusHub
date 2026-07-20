import React from 'react';
import { Container } from '@/components/common/Container';
import { Users, BookOpen, ShoppingBag, Landmark } from 'lucide-react';

const STATS = [
  {
    icon: Users,
    value: '15,000+',
    label: 'Verified Students',
    description: 'Active buyers and sellers across campuses',
  },
  {
    icon: BookOpen,
    value: '6,000+',
    label: 'Books & Items Listed',
    description: 'Textbooks, lab manuals, and dorm gear',
  },
  {
    icon: ShoppingBag,
    value: '2,500+',
    label: 'Successful Deals',
    description: 'Safe peer-to-peer campus exchanges',
  },
  {
    icon: Landmark,
    value: '35+',
    label: 'Partner Colleges',
    description: 'Supported university campuses',
  },
];

export const StatsSection: React.FC = () => {
  return (
    <section className="py-12 border-b border-border bg-card/40">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl border border-border bg-card hover:border-primary/40 transition-all hover:-translate-y-1 shadow-xs"
            >
              <div className="p-3 w-fit rounded-xl bg-primary/10 text-primary mb-3">
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-3xl font-extrabold tracking-tight text-foreground">{stat.value}</div>
              <div className="text-sm font-semibold text-foreground mt-1">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-0.5">{stat.description}</div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};
