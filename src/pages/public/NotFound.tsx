import React from 'react';
import { Link } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Home, Search, Compass } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const NotFound: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center py-16">
      <Container className="text-center space-y-6 max-w-lg">
        {/* Visual Graphic Badge */}
        <div className="relative mx-auto w-24 h-24 rounded-3xl bg-primary/10 text-primary flex items-center justify-center">
          <Compass className="w-12 h-12 animate-pulse" />
          <span className="absolute -top-2 -right-2 font-mono text-xs font-extrabold px-2 py-0.5 rounded-full bg-danger text-white">
            404
          </span>
        </div>

        <div className="space-y-2">
          <Badge variant="secondary">Page Not Found</Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Lost on Campus?
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            The page or listing you are looking for might have been moved, renamed, or no longer exists.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.HOME} className="w-full sm:w-auto">
            <Button variant="primary" size="md" className="w-full" leftIcon={<Home className="w-4 h-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to={ROUTES.MARKETPLACE} className="w-full sm:w-auto">
            <Button variant="outline" size="md" className="w-full" leftIcon={<Search className="w-4 h-4" />}>
              Explore Marketplace
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
