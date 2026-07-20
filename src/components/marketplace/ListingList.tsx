import React from 'react';
import type { ListingItem } from '@/data/mockListings';
import { ListingCard } from './ListingCard';

interface ListingListProps {
  items: ListingItem[];
}

export const ListingList: React.FC<ListingListProps> = ({ items }) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <ListingCard key={item.id} item={item} viewMode="list" />
      ))}
    </div>
  );
};
