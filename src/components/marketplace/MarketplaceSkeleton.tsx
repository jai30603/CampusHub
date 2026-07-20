import React from 'react';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';

export const MarketplaceSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <Card key={idx} className="animate-pulse overflow-hidden">
          <div className="h-44 bg-muted" />
          <CardHeader className="p-4 space-y-2">
            <div className="h-3 w-1/4 bg-muted rounded" />
            <div className="h-4 w-3/4 bg-muted rounded" />
          </CardHeader>
          <CardContent className="px-4 pb-2">
            <div className="h-3 w-1/2 bg-muted rounded" />
          </CardContent>
          <CardFooter className="p-4 pt-2 flex items-center justify-between">
            <div className="h-5 w-1/3 bg-muted rounded" />
            <div className="h-7 w-16 bg-muted rounded" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
