import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({ viewMode, onViewChange }) => {
  return (
    <div className="flex items-center p-1 rounded-lg border border-border bg-card">
      <button
        type="button"
        onClick={() => onViewChange('grid')}
        aria-label="Grid View"
        className={cn(
          'p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors',
          viewMode === 'grid' && 'bg-primary/10 text-primary font-bold'
        )}
      >
        <LayoutGrid className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => onViewChange('list')}
        aria-label="List View"
        className={cn(
          'p-1.5 rounded-md text-muted-foreground hover:text-foreground transition-colors',
          viewMode === 'list' && 'bg-primary/10 text-primary font-bold'
        )}
      >
        <List className="w-4 h-4" />
      </button>
    </div>
  );
};
