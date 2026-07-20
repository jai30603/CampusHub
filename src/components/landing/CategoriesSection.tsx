import React from 'react';
import { Container } from '@/components/common/Container';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import {
  BookOpen,
  FileText,
  FileSpreadsheet,
  TestTube2,
  Laptop,
  Calculator,
  Backpack,
  GraduationCap,
  HeartHandshake,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const CATEGORIES = [
  {
    icon: BookOpen,
    title: 'Books & Textbooks',
    description: 'Course textbooks, reference guides, and literature required for classes.',
    badge: '1,200+ Listed',
    color: 'text-blue-500 bg-blue-500/10',
  },
  {
    icon: FileText,
    title: 'Study Notes',
    description: 'Handwritten and digital lecture summaries, semester cheat sheets.',
    badge: '850+ Listed',
    color: 'text-purple-500 bg-purple-500/10',
  },
  {
    icon: FileSpreadsheet,
    title: 'Previous Year Papers',
    description: 'Midterm and final exam question banks with solution sets.',
    badge: '600+ Listed',
    color: 'text-amber-500 bg-amber-500/10',
  },
  {
    icon: TestTube2,
    title: 'Lab Manuals & Kits',
    description: 'Physics, Chemistry, and Engineering practical lab manuals.',
    badge: '400+ Listed',
    color: 'text-emerald-500 bg-emerald-500/10',
  },
  {
    icon: Laptop,
    title: 'Electronics & Gear',
    description: 'Laptops, monitors, chargers, headphones, and computer peripherals.',
    badge: '950+ Listed',
    color: 'text-cyan-500 bg-cyan-500/10',
  },
  {
    icon: Calculator,
    title: 'Scientific Calculators',
    description: 'TI-84, Casio FX, and graphing calculators for math & engineering.',
    badge: '300+ Listed',
    color: 'text-rose-500 bg-rose-500/10',
  },
  {
    icon: Backpack,
    title: 'Stationery & Accessories',
    description: 'Backpacks, organizers, drafting sets, and study supplies.',
    badge: '500+ Listed',
    color: 'text-orange-500 bg-orange-500/10',
  },
  {
    icon: GraduationCap,
    title: 'Campus Merchandise',
    description: 'Official university hoodies, jackets, tees, and spirit gear.',
    badge: '450+ Listed',
    color: 'text-indigo-500 bg-indigo-500/10',
  },
  {
    icon: HeartHandshake,
    title: 'Free Donations',
    description: 'Give back to fellow students—free books, desk items, and supplies.',
    badge: 'Free Giveaways',
    color: 'text-teal-500 bg-teal-500/10',
  },
];

export const CategoriesSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border bg-background">
      <Container className="space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <Badge variant="secondary">Browse Categories</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Explore Campus Marketplace Categories
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground">
            From required course literature to dorm essentials, find everything organized by student needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link key={idx} to={ROUTES.MARKETPLACE}>
              <Card className="group h-full cursor-pointer hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg relative overflow-hidden">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className={`p-3 rounded-xl ${cat.color} group-hover:scale-110 transition-transform`}>
                      <cat.icon className="w-6 h-6" />
                    </div>
                    <Badge variant="outline" className="text-[11px]">
                      {cat.badge}
                    </Badge>
                  </div>
                  <div>
                    <CardTitle className="text-base font-bold group-hover:text-primary transition-colors flex items-center justify-between">
                      {cat.title}
                      <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity text-primary" />
                    </CardTitle>
                    <CardDescription className="text-xs mt-1.5 leading-relaxed">
                      {cat.description}
                    </CardDescription>
                  </div>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
};
