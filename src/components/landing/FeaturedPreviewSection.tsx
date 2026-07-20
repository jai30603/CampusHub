import React from 'react';
import { Container } from '@/components/common/Container';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { BookOpen, Laptop, Sofa, Calculator, MapPin, Heart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { formatINR } from '@/components/marketplace/PriceTag';

const SAMPLE_ITEMS = [
  {
    icon: BookOpen,
    title: 'Organic Chemistry (9th Ed.) + Study Guide',
    price: 450.00,
    originalPrice: 1800.00,
    category: 'Textbooks',
    college: 'IIT Bombay',
    condition: 'Like New',
    color: 'from-blue-500/20 to-cyan-500/20 text-blue-500',
  },
  {
    icon: Laptop,
    title: 'MacBook Air M1 8GB/256GB - Space Gray',
    price: 42000.00,
    originalPrice: 79000.00,
    category: 'Electronics',
    college: 'BITS Pilani',
    condition: 'Excellent',
    color: 'from-purple-500/20 to-indigo-500/20 text-purple-500',
  },
  {
    icon: Calculator,
    title: 'TI-84 Plus CE Color Graphing Calculator',
    price: 5500.00,
    originalPrice: 12000.00,
    category: 'Calculators',
    college: 'NIT Trichy',
    condition: 'Mint',
    color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500',
  },
  {
    icon: Sofa,
    title: 'Ergonomic Desk Chair + Adjustable LED Lamp',
    price: 2500.00,
    originalPrice: 8000.00,
    category: 'Dorm Furniture',
    college: 'Delhi University',
    condition: 'Good',
    color: 'from-amber-500/20 to-orange-500/20 text-amber-500',
  },
];

export const FeaturedPreviewSection: React.FC = () => {
  return (
    <section className="py-16 border-b border-border bg-card/40">
      <Container className="space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <Badge variant="default">Live Campus Listings</Badge>
            <h2 className="text-3xl font-extrabold text-foreground tracking-tight">
              Featured Items Recently Listed
            </h2>
            <p className="text-sm text-muted-foreground">
              Discover real deals posted by verified students this week.
            </p>
          </div>
          <Link to={ROUTES.MARKETPLACE}>
            <Button variant="outline" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Explore Full Marketplace
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {SAMPLE_ITEMS.map((item, idx) => (
            <Card key={idx} className="group overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
              {/* Product Visual Box */}
              <div className={`h-40 bg-gradient-to-br ${item.color} flex items-center justify-center relative`}>
                <item.icon className="w-12 h-12 group-hover:scale-110 transition-transform" />
                <button
                  aria-label="Add to wishlist"
                  className="absolute top-3 right-3 p-2 rounded-full bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-danger hover:bg-background transition-colors"
                >
                  <Heart className="w-4 h-4" />
                </button>
                <span className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-background/90 backdrop-blur-xs text-[10px] font-semibold text-foreground">
                  {item.condition}
                </span>
              </div>

              <CardHeader className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-[10px]">
                    {item.category}
                  </Badge>
                  <span className="text-xs text-muted-foreground line-through">{formatINR(item.originalPrice)}</span>
                </div>
                <h3 className="text-sm font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
              </CardHeader>

              <CardContent className="px-4 pb-2">
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span className="truncate">{item.college}</span>
                </div>
              </CardContent>

              <CardFooter className="p-4 pt-2 flex items-center justify-between border-t border-border">
                <div className="text-base font-extrabold text-primary">
                  {formatINR(item.price)}
                </div>
                <Button size="sm" variant="ghost" className="text-xs">
                  Details
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </section>
  );
};
