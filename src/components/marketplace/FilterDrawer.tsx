import React from 'react';
import { X } from 'lucide-react';
import { FilterSidebar, type FilterState } from './FilterSidebar';
import { Button } from '@/components/ui/Button';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onResetFilters: () => void;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex lg:hidden">
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      />

      <div className="relative w-4/5 max-w-xs bg-background h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto animate-in slide-in-from-right duration-200 z-10 ml-auto border-l border-border">
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <h3 className="font-bold text-base text-foreground">Marketplace Filters</h3>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <FilterSidebar
            filters={filters}
            onFilterChange={onFilterChange}
            onResetFilters={onResetFilters}
          />
        </div>

        <div className="pt-4 border-t border-border">
          <Button variant="primary" className="w-full" onClick={onClose}>
            Apply Filters
          </Button>
        </div>
      </div>
    </div>
  );
};
