import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { PriceTag } from '@/components/marketplace/PriceTag';
import { SelectField } from '@/components/auth/SelectField';
import { useWishlist } from '@/contexts/WishlistContext';
import { apiRequest } from '@/services/api';
import { Heart, Trash2, ArrowRight, MapPin, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

const SORT_OPTIONS = [
  { label: 'Recently Saved', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];

export const Wishlist: React.FC = () => {
  const { items, toggleWishlist, fetchWishlist } = useWishlist();
  const [sortBy, setSortBy] = useState('newest');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleSortChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    setIsLoading(true);

    try {
      const response = await apiRequest(`/wishlist?sort_by=${newSort}`);
      if (response.success && response.data) {
        // Updated items handled via re-fetch or state
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Saved Wishlist"
          description="Keep track of textbooks, gear, and items you want to buy later"
        />

        {items.length > 0 && (
          <div className="w-48 shrink-0">
            <SelectField
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={handleSortChange}
            />
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <EmptyState
          icon={<Heart className="w-8 h-8 text-danger" />}
          title="You haven't saved any listings yet"
          description="Explore the campus marketplace and click the heart icon on any item to save it here for later."
          actionText="Explore Marketplace"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <Card key={item.id} className="overflow-hidden group flex flex-col justify-between hover:border-primary/40 transition-colors">
              <div>
                <div className="h-44 bg-muted relative overflow-hidden">
                  <img
                    src={
                      item.imageUrl ||
                      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => toggleWishlist(item)}
                    aria-label="Remove from wishlist"
                    className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-xs text-danger hover:bg-background transition-colors shadow-xs"
                    title="Remove from wishlist"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <CardHeader className="p-4 space-y-2">
                  <Badge variant="secondary" className="text-[10px] w-fit">
                    {item.category}
                  </Badge>
                  <CardTitle className="text-sm font-bold line-clamp-2">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-2 space-y-2">
                  <PriceTag price={item.price} size="sm" />

                  {item.college && (
                    <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
                      <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="truncate">{item.college}</span>
                    </div>
                  )}
                </CardContent>
              </div>

              <CardFooter className="p-4 pt-2 border-t border-border">
                <Link to={`/marketplace/${item.id}`} className="w-full">
                  <Button variant="outline" size="sm" className="w-full text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    View Listing
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
