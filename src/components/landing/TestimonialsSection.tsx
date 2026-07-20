import React from 'react';
import { Container } from '@/components/common/Container';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    name: 'Shreya Iyer',
    role: 'Biology Senior',
    college: 'Delhi University',
    initials: 'SI',
    quote:
      'CampusHub saved me over ₹4,000 on organic chemistry and microbiology textbooks this semester alone! I met the seller at our college center—super smooth.',
    rating: 5,
  },
  {
    name: 'Mohan Kumar',
    role: 'Computer Science Sophomore',
    college: 'BITS Pilani',
    initials: 'MK',
    quote:
      'I listed my old graphing calculator and got 3 buyer inquiries within 20 minutes. Sold it on college campus before my next class with zero listing fees!',
    rating: 5,
  },
  {
    name: 'Ananya Patel',
    role: 'Business Major',
    college: 'IIT Madras',
    initials: 'AP',
    quote:
      'Knowing that everyone on CampusHub is verified with a college/university email gives me complete peace of mind. It’s way safer than sketchy public forums.',
    rating: 5,
  },
];

export const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border bg-background">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Student Reviews</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Loved by Students Across Campuses
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Hear how CampusHub helps students save money and trade safely every semester.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((rev, idx) => (
            <Card key={idx} className="flex flex-col justify-between p-2 hover:border-primary/40 transition-colors">
              <CardHeader className="space-y-3 pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-500" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-muted-foreground/30" />
                </div>
                <p className="text-xs sm:text-sm text-foreground leading-relaxed italic">
                  "{rev.quote}"
                </p>
              </CardHeader>
              <CardContent className="pt-4 border-t border-border flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center shrink-0">
                  {rev.initials}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">{rev.name}</h4>
                  <p className="text-[11px] text-muted-foreground">
                    {rev.role} • <span className="text-primary font-medium">{rev.college}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
