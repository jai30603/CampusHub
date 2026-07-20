import React from 'react';
import { cn } from '@/lib/utils';

interface PriceTagProps {
  price: number;
  originalPrice?: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * Formats a number using the Indian numbering system.
 * e.g. 125000 → ₹1,25,000 | 1500 → ₹1,500 | 999 → ₹999
 */
export function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

export const PriceTag: React.FC<PriceTagProps> = ({
  price,
  originalPrice,
  size = 'md',
  className,
}) => {
  const isFree = price === 0;

  const sizes = {
    sm: 'text-sm font-bold',
    md: 'text-base font-extrabold',
    lg: 'text-2xl font-extrabold',
  };

  const discountPercent =
    originalPrice && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : 0;

  return (
    <div className={cn('flex items-baseline gap-2', className)}>
      {isFree ? (
        <span className={cn('text-emerald-600 dark:text-emerald-400 font-extrabold', sizes[size])}>
          FREE
        </span>
      ) : (
        <span className={cn('text-primary font-extrabold tracking-tight', sizes[size])}>
          {formatINR(price)}
        </span>
      )}

      {originalPrice && originalPrice > price && (
        <span className="text-xs text-muted-foreground line-through font-medium">
          {formatINR(originalPrice)}
        </span>
      )}

      {discountPercent > 0 && (
        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
          {discountPercent}% OFF
        </span>
      )}
    </div>
  );
};
