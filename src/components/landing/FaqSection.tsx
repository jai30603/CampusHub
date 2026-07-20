import React, { useState } from 'react';
import { Container } from '@/components/common/Container';
import { Badge } from '@/components/ui/Badge';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Is CampusHub free to use?',
    answer:
      'Yes! CampusHub is 100% free for college students to browse, list, and trade. We do not charge listing fees or commission on peer-to-peer campus sales.',
  },
  {
    question: 'Can I sell electronics and dorm furniture?',
    answer:
      'Absolutely. In addition to textbooks and study notes, you can list laptops, calculators, audio gear, dorm desks, lamps, mini-fridges, and campus merchandise.',
  },
  {
    question: 'Is campus verification required to register?',
    answer:
      'Yes. To maintain a safe environment, all users must register and verify their account using an official university (.edu) email address.',
  },
  {
    question: 'Can I donate books or items for free?',
    answer:
      'Yes! We have a dedicated "Free Donations" category where you can give away textbooks, notes, and supplies to fellow students who need them.',
  },
  {
    question: 'Which colleges and universities are supported?',
    answer:
      'CampusHub supports students at over 35+ partner universities across the country, with new campus hubs added regularly.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 border-b border-border bg-card/30">
      <Container className="max-w-3xl space-y-12">
        <div className="text-center space-y-3">
          <Badge variant="default">Frequently Asked Questions</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Got Questions? We Have Answers.
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            Everything you need to know about trading safely on CampusHub.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-border bg-card overflow-hidden transition-colors"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex items-center justify-between font-bold text-sm sm:text-base text-foreground hover:text-primary transition-colors gap-4"
                >
                  <span>{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? 'rotate-180 text-primary' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/50 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};
