import React, { useState, useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { PriceTag } from '@/components/marketplace/PriceTag';
import { ConditionBadge } from '@/components/marketplace/ConditionBadge';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { apiRequest } from '@/services/api';
import { PlusCircle, Edit3, Trash2, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const MyListings: React.FC = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchMyListings = async () => {
    setIsLoading(true);
    try {
      const response = await apiRequest('/listings/user/me');
      if (response.success && response.data) {
        setListings(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch user listings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyListings();
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteId) return;
    setIsDeleting(true);

    try {
      const response = await apiRequest(`/listings/${deleteId}`, {
        method: 'DELETE',
      });

      if (response.success) {
        setListings((prev) => prev.filter((l) => l.id !== deleteId));
        setDeleteId(null);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to delete listing.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="My Campus Listings"
        description="Manage, edit, or delete items you have posted for sale on campus"
        action={
          <Link to={ROUTES.SELL}>
            <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post New Item</Button>
          </Link>
        }
      />

      {isLoading ? (
        <div className="py-20 flex justify-center">
          <LoadingSpinner size="lg" label="Loading your listings..." />
        </div>
      ) : listings.length === 0 ? (
        <EmptyState
          title="You haven't posted any listings yet"
          description="Have old textbooks, notes, or electronics lying around? List them on CampusHub today!"
          actionText="Post Your First Item"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {listings.map((item) => (
            <Card key={item.id} className="overflow-hidden flex flex-col justify-between group">
              <div>
                <div className="h-44 bg-muted relative overflow-hidden">
                  <img
                    src={
                      item.images && item.images.length > 0
                        ? item.images[0].image_url
                        : 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
                    }
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <ConditionBadge condition={item.condition} />
                    <Badge variant="default" className="text-[10px] bg-emerald-500 text-white">
                      {item.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-4 space-y-2">
                  <Badge variant="secondary" className="text-[10px] w-fit">
                    {item.category?.name || 'Category'}
                  </Badge>
                  <CardTitle className="text-sm font-bold line-clamp-2">{item.title}</CardTitle>
                </CardHeader>

                <CardContent className="px-4 pb-2">
                  <PriceTag price={Number(item.price)} size="sm" />
                </CardContent>
              </div>

              <CardFooter className="p-4 pt-3 flex items-center justify-between border-t border-border bg-card/50">
                <Link to={`/marketplace/${item.id}`}>
                  <Button variant="ghost" size="sm" leftIcon={<ExternalLink className="w-3.5 h-3.5" />}>
                    View
                  </Button>
                </Link>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(item.id)}
                    leftIcon={<Trash2 className="w-3.5 h-3.5 text-danger" />}
                    className="text-danger hover:bg-danger/10 hover:text-danger"
                  >
                    Delete
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Confirm Delete Listing"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete this listing? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
            >
              {isDeleting ? 'Deleting...' : 'Delete Listing'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
