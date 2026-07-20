import React from 'react';
import { cn } from '@/lib/utils';

interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'w-full max-w-md mx-auto bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl space-y-6',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
