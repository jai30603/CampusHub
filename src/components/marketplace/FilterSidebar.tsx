import React from 'react';
import { SelectField } from '@/components/auth/SelectField';
import { Button } from '@/components/ui/Button';
import { RotateCcw } from 'lucide-react';

export interface FilterState {
  category: string;
  college: string;
  condition: string;
  maxPrice: number;
  sortBy: string;
}

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string | number) => void;
  onResetFilters: () => void;
}

const CATEGORY_OPTIONS = [
  { label: 'All Categories', value: '' },
  { label: 'Books & Textbooks', value: 'Books & Textbooks' },
  { label: 'Study Notes', value: 'Study Notes' },
  { label: 'Previous Year Papers', value: 'Previous Year Papers' },
  { label: 'Lab Manuals', value: 'Lab Manuals' },
  { label: 'Electronics & Gear', value: 'Electronics & Gear' },
  { label: 'Scientific Calculators', value: 'Scientific Calculators' },
  { label: 'Stationery & Accessories', value: 'Stationery & Accessories' },
  { label: 'Campus Merchandise', value: 'Campus Merchandise' },
  { label: 'Free Donations', value: 'Free Donations' },
];

const COLLEGE_OPTIONS = [
  { label: 'All Institutions', value: '' },
  { label: 'IIT Bombay', value: 'IIT Bombay' },
  { label: 'BITS Pilani', value: 'BITS Pilani' },
  { label: 'NIT Trichy', value: 'NIT Trichy' },
  { label: 'Delhi University', value: 'Delhi University' },
  { label: 'IIT Madras', value: 'IIT Madras' },
];

const CONDITION_OPTIONS = [
  { label: 'All Conditions', value: '' },
  { label: 'Brand New', value: 'Brand New' },
  { label: 'Like New', value: 'Like New' },
  { label: 'Good', value: 'Good' },
  { label: 'Fair', value: 'Fair' },
];

const SORT_OPTIONS = [
  { label: 'Newest Arrivals', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <aside className="w-full space-y-6 bg-card p-5 border border-border rounded-2xl shadow-xs">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="font-bold text-sm text-foreground uppercase tracking-wider">Filters</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onResetFilters}
          leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
          className="text-xs text-muted-foreground hover:text-foreground h-8 px-2"
        >
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {/* Sort By */}
        <SelectField
          label="Sort By"
          options={SORT_OPTIONS}
          value={filters.sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        />

        {/* Category Filter */}
        <SelectField
          label="Category"
          options={CATEGORY_OPTIONS}
          value={filters.category}
          onChange={(e) => onFilterChange('category', e.target.value)}
        />

        {/* College Filter */}
        <SelectField
          label="College / Campus"
          options={COLLEGE_OPTIONS}
          value={filters.college}
          onChange={(e) => onFilterChange('college', e.target.value)}
        />

        {/* Condition Filter */}
        <SelectField
          label="Item Condition"
          options={CONDITION_OPTIONS}
          value={filters.condition}
          onChange={(e) => onFilterChange('condition', e.target.value)}
        />

        {/* Max Price Range Slider */}
        <div className="space-y-2 pt-2">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-foreground">Max Price</span>
            <span className="font-bold text-primary">₹{filters.maxPrice.toLocaleString('en-IN')}</span>
          </div>
          <input
            type="range"
            min="0"
            max="50000"
            step="500"
            value={filters.maxPrice}
            onChange={(e) => onFilterChange('maxPrice', Number(e.target.value))}
            className="w-full accent-primary bg-secondary rounded-lg h-2 cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>₹0 (Free)</span>
            <span>₹50,000+</span>
          </div>
        </div>
      </div>
    </aside>
  );
};
