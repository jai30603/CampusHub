import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, MapPin, Sparkles, CheckCircle2 } from 'lucide-react';
import type { ListingItem } from '@/data/mockListings';
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { ConditionBadge } from './ConditionBadge';
import { PriceTag } from './PriceTag';
import { useWishlist } from '@/contexts/WishlistContext';
import { ListingStatusBadge } from './ListingStatusBadge';

interface ListingCardProps {
  item: ListingItem;
  viewMode?: 'grid' | 'list';
}

export const ListingCard: React.FC<ListingCardProps> = ({ item, viewMode = 'grid' }) => {
  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = isInWishlist(item.id);

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist({
      id: item.id,
      title: item.title,
      price: item.price,
      category: item.category,
      imageUrl: item.images[0],
    });
  };

  if (viewMode === 'list') {
    return (
      <Link to={`/marketplace/${item.id}`} className="block group">
        <Card className="flex flex-col sm:flex-row overflow-hidden hover:border-primary/50 transition-all duration-200">
          <div className="sm:w-48 h-48 sm:h-auto bg-muted relative shrink-0 overflow-hidden">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 flex gap-1">
              <ConditionBadge condition={item.condition} />
            </div>
            <button
              onClick={handleWishlistClick}
              aria-label="Wishlist toggle"
              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-danger hover:bg-background transition-colors"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-danger text-danger' : ''}`} />
            </button>
          </div>

          <div className="flex-1 p-5 flex flex-col justify-between space-y-3">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary" className="text-[10px]">
                  {item.category}
                </Badge>
                <span className="text-xs text-muted-foreground">{item.createdAt}</span>
              </div>

              <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {item.title}
              </h3>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <PriceTag price={item.price} originalPrice={item.originalPrice} size="md" />

              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                <span className="truncate max-w-[150px]">{item.college}</span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link to={`/marketplace/${item.id}`} className="block group h-full">
      <Card className="h-full flex flex-col justify-between overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1">
        <div>
          {/* Card Image Area */}
          <div className="h-44 bg-muted relative overflow-hidden">
            <img
              src={item.images[0]}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
              <div className="flex gap-1">
                <ConditionBadge condition={item.condition} />
                {item.isTrending && (
                  <Badge variant="default" className="text-[9px] gap-1 px-1.5 py-0">
                    <Sparkles className="w-2.5 h-2.5" /> Hot
                  </Badge>
                )}
              </div>
              <ListingStatusBadge status={item.status || 'active'} />
            </div>
            <button
              onClick={handleWishlistClick}
              aria-label="Wishlist toggle"
              className="absolute top-2 right-2 p-2 rounded-full bg-background/80 backdrop-blur-xs text-muted-foreground hover:text-danger hover:bg-background transition-colors shadow-xs"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-danger text-danger' : ''}`} />
            </button>
          </div>

          <CardHeader className="p-4 space-y-2">
            <div className="flex items-center justify-between">
              <Badge variant="secondary" className="text-[10px]">
                {item.category}
              </Badge>
              <span className="text-[11px] text-muted-foreground">{item.createdAt}</span>
            </div>

            <CardTitle className="text-sm font-bold group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {item.title}
            </CardTitle>
          </CardHeader>

          <CardContent className="px-4 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
              <span className="truncate">{item.college}</span>
            </div>
          </CardContent>
        </div>

        <CardFooter className="p-4 pt-3 flex items-center justify-between border-t border-border bg-card/50">
          <PriceTag price={item.price} originalPrice={item.originalPrice} size="sm" />
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span className="truncate max-w-[100px]">{item.seller.name}</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
