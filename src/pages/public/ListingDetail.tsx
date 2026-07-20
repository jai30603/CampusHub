import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container } from '@/components/common/Container';
import { Breadcrumb } from '@/components/marketplace/Breadcrumb';
import { ImageGallery } from '@/components/marketplace/ImageGallery';
import { PriceTag } from '@/components/marketplace/PriceTag';
import { ConditionBadge } from '@/components/marketplace/ConditionBadge';
import { ListingStatusBadge } from '@/components/marketplace/ListingStatusBadge';
import { SellerCard } from '@/components/marketplace/SellerCard';
import { ListingGrid } from '@/components/marketplace/ListingGrid';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { type ListingItem } from '@/data/mockListings';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import { Heart, Share2, MapPin, Calendar, ShieldCheck, ArrowLeft, Bookmark, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [item, setItem] = useState<ListingItem | null>(null);
  const [similarItems, setSimilarItems] = useState<ListingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isReserving, setIsReserving] = useState(false);
  const [reserveError, setReserveError] = useState<string | null>(null);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const isSaved = item ? isInWishlist(item.id) : false;

  useEffect(() => {
    const fetchListingDetail = async () => {
      if (!id) return;
      setIsLoading(true);

      try {
        const response = await apiRequest(`/listings/${id}`);
        if (response.success && response.data) {
          const l = response.data;
          const transformedItem: ListingItem = {
            id: String(l.id),
            title: l.title,
            description: l.description,
            price: Number(l.price),
            category: l.category?.name || 'General',
            condition: l.condition,
            college: l.seller?.college || 'IIT Bombay',
            createdAt: new Date(l.created_at).toLocaleDateString(),
            images: l.images && l.images.length > 0 ? l.images.map((img: any) => img.image_url) : [
              'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
            ],
            seller_id: String(l.seller_id),
            seller: {
              id: String(l.seller?.id || l.seller_id),
              name: l.seller?.full_name || 'Student Seller',
              college: l.seller?.college || 'IIT Bombay',
              joinedDate: new Date(l.seller?.created_at).toLocaleDateString(),
              rating: 4.8,
              totalListings: 4,
              verifiedStudent: true,
            },
            status: l.status || 'active',
            attributes: l.attributes || {},
          };
          setItem(transformedItem);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchListingDetail();
  }, [id]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReserveItem = async () => {
    if (!item) return;
    setIsReserving(true);
    setReserveError(null);

    try {
      const response = await apiRequest('/reservations', {
        method: 'POST',
        body: JSON.stringify({ listing_id: parseInt(item.id, 10) }),
      });

      if (response.success) {
        alert('Reservation request submitted! Directing you to transaction manager...');
        navigate(`${ROUTES.ORDERS}?tab=purchases`);
      }
    } catch (err: any) {
      setReserveError(err.message || 'Failed to submit reservation.');
    } finally {
      setIsReserving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <LoadingSpinner size="lg" label="Loading listing details..." />
      </div>
    );
  }

  if (!item) {
    return (
      <Container className="py-12 text-center space-y-4">
        <h2 className="text-xl font-bold">Listing Not Found</h2>
        <p className="text-muted-foreground">The item listing you requested does not exist or has been removed.</p>
        <Link to={ROUTES.MARKETPLACE}>
          <Button variant="primary">Back to Marketplace</Button>
        </Link>
      </Container>
    );
  }

  const isSeller = String(item.seller_id) === String(user?.id);
  const isAvailable = (item.status || 'active').toLowerCase() === 'active';

  return (
    <Container className="py-6 space-y-6">
      <div className="flex items-center justify-between">
        <Link to={ROUTES.MARKETPLACE} className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-4 h-4" /> Back to Marketplace
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <ImageGallery images={item.images} title={item.title} />

          <Card className="p-2 border-border">
            <CardHeader className="p-4">
              <CardTitle className="text-base font-bold">Description</CardTitle>
            </CardHeader>
            <CardContent className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed whitespace-pre-wrap">
              {item.description}
            </CardContent>
          </Card>
        </div>

        {/* Action Column */}
        <div className="lg:col-span-5 space-y-6 sticky top-24">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge variant="secondary">{item.category}</Badge>
              <ConditionBadge condition={item.condition} />
              <ListingStatusBadge status={item.status || 'active'} />
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight leading-snug">
              {item.title}
            </h1>

            <div className="flex flex-col gap-3 p-4 rounded-2xl bg-card border border-border">
              <div className="flex items-center justify-between">
                <PriceTag price={item.price} size="lg" />

                <div className="flex items-center gap-2">
                  <Button
                    variant={isSaved ? 'danger' : 'outline'}
                    size="sm"
                    onClick={() =>
                      toggleWishlist({
                        id: item.id,
                        title: item.title,
                        price: item.price,
                        category: item.category,
                        imageUrl: item.images[0],
                      })
                    }
                    leftIcon={<Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />}
                  >
                    {isSaved ? 'Saved' : 'Save'}
                  </Button>

                  <Button variant="outline" size="sm" onClick={handleShare} leftIcon={<Share2 className="w-4 h-4" />}>
                    {copied ? 'Copied Link!' : 'Share'}
                  </Button>
                </div>
              </div>

              {reserveError && <p className="text-xs text-danger font-medium mt-1">{reserveError}</p>}

              {/* Reserve Button */}
              {!isSeller && (
                <Button
                  variant="primary"
                  className="w-full mt-2"
                  disabled={!isAvailable || isReserving}
                  leftIcon={isReserving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Bookmark className="w-4 h-4" />}
                  onClick={handleReserveItem}
                >
                  {isReserving ? 'Submitting Reservation...' : isAvailable ? 'Reserve Item' : `Item is ${(item.status || 'active').toUpperCase()}`}
                </Button>
              )}
              {isSeller && (
                <p className="text-[11px] text-center text-muted-foreground font-medium pt-1">
                  You listed this item. Manage reservation requests in your Sales Manager panel.
                </p>
              )}
            </div>

            <div className="flex items-center gap-4 text-xs text-muted-foreground pt-1">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <MapPin className="w-4 h-4 text-primary" /> {item.college}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Listed {item.createdAt}
              </span>
              <span className="flex items-center gap-1 text-emerald-500 font-medium ml-auto">
                <ShieldCheck className="w-4 h-4" /> Verified Student
              </span>
            </div>
          </div>

          <SellerCard seller={item.seller} listingId={item.id} />
        </div>
      </div>
    </Container>
  );
};
