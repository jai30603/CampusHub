import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-muted-foreground py-2 overflow-x-auto">
      <Link to={ROUTES.HOME} className="hover:text-foreground transition-colors flex items-center gap-1">
        <Home className="w-3.5 h-3.5" /> Home
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 shrink-0" />
          {item.path ? (
            <Link to={item.path} className="hover:text-foreground transition-colors truncate">
              {item.label}
            </Link>
          ) : (
            <span className="font-semibold text-foreground truncate">{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};
