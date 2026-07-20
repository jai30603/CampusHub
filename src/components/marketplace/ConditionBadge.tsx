import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface ConditionBadgeProps {
  condition: 'Brand New' | 'Like New' | 'Good' | 'Fair';
}

export const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition }) => {
  const variantMap: Record<
    ConditionBadgeProps['condition'],
    'success' | 'default' | 'warning' | 'secondary'
  > = {
    'Brand New': 'success',
    'Like New': 'default',
    Good: 'secondary',
    Fair: 'warning',
  };

  return (
    <Badge variant={variantMap[condition]} className="text-[10px] uppercase font-bold tracking-wider">
      {condition}
    </Badge>
  );
};
