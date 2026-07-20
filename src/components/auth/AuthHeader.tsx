import React from 'react';
import { cn } from '@/lib/utils';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle, className }) => {
  return (
    <div className={cn('text-center space-y-1.5', className)}>
      <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">{title}</h2>
      {subtitle && <p className="text-xs sm:text-sm text-muted-foreground">{subtitle}</p>}
    </div>
  );
};
