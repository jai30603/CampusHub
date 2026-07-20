import React from 'react';
import { PackageOpen } from 'lucide-react';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'There are no items to display at the moment.',
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 border border-dashed border-border rounded-xl bg-card">
      <div className="p-4 rounded-full bg-accent text-muted-foreground mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-sm">{description}</p>
      {actionText && onAction && (
        <Button onClick={onAction} className="mt-6">
          {actionText}
        </Button>
      )}
    </div>
  );
};
