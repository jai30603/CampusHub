import React from 'react';
import { Badge } from '@/components/ui/Badge';

interface ListingStatusBadgeProps {
  status: string;
}

export const ListingStatusBadge: React.FC<ListingStatusBadgeProps> = ({ status }) => {
  const normalized = status.toLowerCase();

  if (normalized === 'pending') {
    return (
      <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/25 text-[10px] gap-1 px-1.5 py-0.5 border border-amber-500/25">
        🟡 Pending Approval
      </Badge>
    );
  }

  if (normalized === 'reserved') {
    return (
      <Badge variant="secondary" className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/25 text-[10px] gap-1 px-1.5 py-0.5 border border-blue-500/25">
        🔵 Reserved
      </Badge>
    );
  }

  if (normalized === 'sold') {
    return (
      <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400 hover:bg-zinc-500/25 text-[10px] gap-1 px-1.5 py-0.5 border border-zinc-500/25">
        ⚫ Sold
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/25 text-[10px] gap-1 px-1.5 py-0.5 border border-emerald-500/25">
      🟢 Active
    </Badge>
  );
};
