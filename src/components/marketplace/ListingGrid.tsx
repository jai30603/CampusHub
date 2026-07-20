import React from 'react';
import type { ListingItem } from '@/data/mockListings';
import { ListingCard } from './ListingCard';

interface ListingGridProps {
  items: ListingItem[];
}

export const ListingGrid: React.FC<ListingGridProps> = ({ items }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} viewMode="grid" />
      ))}
    </div>
  );
};
