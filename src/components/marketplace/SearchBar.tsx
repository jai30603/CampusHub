import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  onClear: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onClear,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const RECENT_SEARCHES = ['Organic Chemistry', 'TI-84 Calculator', 'MacBook Air', 'Dorm Lamp'];

  return (
    <div className="relative w-full">
      <Input
        placeholder="Search textbooks, calculators, laptops, course codes..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setTimeout(() => setIsFocused(false), 200)}
        leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
        rightIcon={
          searchTerm ? (
            <button
              onClick={onClear}
              aria-label="Clear search"
              className="p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          ) : undefined
        }
        className="h-10 text-sm"
      />

      {/* Recent Searches Dropdown Mockup */}
      {isFocused && !searchTerm && (
        <div className="absolute top-12 left-0 right-0 z-30 bg-card border border-border rounded-xl p-3 shadow-xl space-y-2 animate-in fade-in duration-150">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Recent Searches
          </div>
          <div className="flex flex-wrap gap-1.5">
            {RECENT_SEARCHES.map((query, idx) => (
              <button
                key={idx}
                onClick={() => onSearchChange(query)}
                className="px-2.5 py-1 rounded-md bg-accent text-xs text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
              >
                {query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
