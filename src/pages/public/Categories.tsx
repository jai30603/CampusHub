import React from 'react';
import { Container } from '@/components/common/Container';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { BookOpen, Laptop, Sofa, Shirt, Bike, Headphones } from 'lucide-react';

const CATEGORIES = [
  { icon: BookOpen, name: 'Textbooks & Study Notes', count: '120+ items' },
  { icon: Laptop, name: 'Laptops & Computers', count: '45+ items' },
  { icon: Sofa, name: 'Dorm & Apartment Furniture', count: '80+ items' },
  { icon: Headphones, name: 'Audio & Gadgets', count: '60+ items' },
  { icon: Bike, name: 'Bicycles & Campus Transport', count: '25+ items' },
  { icon: Shirt, name: 'Clothing & Campus Gear', count: '90+ items' },
];

export const Categories: React.FC = () => {
  return (
    <Container className="py-8 space-y-6">
      <PageHeader
        title="Browse by Category"
        description="Find items quickly organized by student interest and course needs"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <Card key={idx} className="group cursor-pointer hover:border-primary/50 transition-colors">
            <CardHeader className="flex flex-row items-center gap-4 space-y-0">
              <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <cat.icon className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-base">{cat.name}</CardTitle>
                <CardDescription className="text-xs">{cat.count}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </Container>
  );
};
