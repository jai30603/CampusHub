import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest } from '@/services/api';
import { PageHeader } from '@/components/common/PageHeader';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { EmptyState } from '@/components/common/EmptyState';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { MapPin, User, MessageSquare, CheckCircle, XCircle, Ban, ArrowRight, Loader2, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const Orders: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') === 'sales' ? 'sales' : 'purchases';

  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState<number | null>(null);

  // Review Modal States
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewResId, setReviewResId] = useState<number | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const fetchReservations = async () => {
    setIsLoading(true);
    try {
      const roleFilter = activeTab === 'sales' ? 'seller' : 'buyer';
      const response = await apiRequest(`/reservations?role=${roleFilter}`);
      if (response.success && response.data) {
        setReservations(response.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [activeTab]);

  const handleUpdateStatus = async (resId: number, endpoint: string, successMessage: string) => {
    setActioningId(resId);
    try {
      const response = await apiRequest(`/reservations/${resId}/${endpoint}`, {
        method: 'PUT',
      });
      if (response.success) {
        alert(successMessage);
        fetchReservations();
      }
    } catch (err: any) {
      alert(err.message || 'Action failed.');
    } finally {
      setActioningId(null);
    }
  };

  const handleOpenReviewModal = (resId: number) => {
    setReviewResId(resId);
    setRating(5);
    setComment('');
    setIsReviewModalOpen(true);
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewResId) return;

    setIsSubmittingReview(true);
    try {
      const response = await apiRequest('/reviews', {
        method: 'POST',
        body: JSON.stringify({
          reservation_id: reviewResId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (response.success) {
        alert('Review submitted successfully!');
        setIsReviewModalOpen(false);
      }
    } catch (err: any) {
      alert(err.message || 'Failed to submit review.');
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusPill = (status: string) => {
    const norm = status.toLowerCase();
    if (norm === 'pending') {
      return <Badge variant="secondary" className="bg-amber-500/10 text-amber-500">🟡 Pending Approval</Badge>;
    }
    if (norm === 'accepted') {
      return <Badge variant="secondary" className="bg-blue-500/10 text-blue-500">🔵 Reserved</Badge>;
    }
    if (norm === 'completed') {
      return <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-500">🟢 Sold / Complete</Badge>;
    }
    if (norm === 'rejected') {
      return <Badge variant="secondary" className="bg-red-500/10 text-red-500">🔴 Rejected</Badge>;
    }
    return <Badge variant="secondary" className="bg-zinc-500/10 text-zinc-400">⚫ Cancelled</Badge>;
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reservation & Deal Manager"
        description="Track pending requests, organize meeting times with campus peers, and monitor transactions"
      />

      {/* Tab Switchers */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setSearchParams({ tab: 'purchases' })}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'purchases' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          My Purchases / Reservations
        </button>
        <button
          onClick={() => setSearchParams({ tab: 'sales' })}
          className={`px-6 py-3 text-xs font-bold border-b-2 transition-colors ${
            activeTab === 'sales' ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
          }`}
        >
          Sales Manager (Incoming Requests)
        </button>
      </div>

      {isLoading ? (
        <div className="py-16 text-center">
          <LoadingSpinner size="lg" label="Syncing reservation logs..." />
        </div>
      ) : reservations.length === 0 ? (
        <EmptyState
          icon={<CheckCircle className="w-8 h-8 text-primary" />}
          title={activeTab === 'sales' ? 'No incoming requests found' : 'No outgoing reservations found'}
          description="Explore items on the marketplace to request a reservation, or wait for buyers to request yours."
          actionText="Browse Marketplace"
          onAction={() => {}}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reservations.map((res) => {
            const isPending = res.status.toLowerCase() === 'pending';
            const isAccepted = res.status.toLowerCase() === 'accepted';
            const isCompleted = res.status.toLowerCase() === 'completed';
            const displayImg = res.listing?.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80';
            const otherUser = activeTab === 'sales' ? res.buyer : res.seller;

            return (
              <Card key={res.id} className="overflow-hidden flex flex-col justify-between hover:border-primary/20 transition-colors">
                <div>
                  {/* Reservation Top Header */}
                  <div className="p-4 border-b border-border/80 flex items-center justify-between bg-accent/20">
                    <span className="text-[10px] text-muted-foreground font-semibold">
                      Requested {new Date(res.requested_at).toLocaleDateString()}
                    </span>
                    {getStatusPill(res.status)}
                  </div>

                  {/* Listing Info Card */}
                  <div className="p-4 flex gap-4">
                    <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden shrink-0 border border-border">
                      <img src={displayImg} alt={res.listing?.title} className="w-full h-full object-cover" />
                    </div>

                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="text-[11px] text-muted-foreground font-bold truncate">
                        {res.listing?.category?.name || 'General'}
                      </div>
                      <h4 className="font-bold text-xs text-foreground truncate">
                        {res.listing?.title}
                      </h4>
                      <div className="text-xs font-bold text-primary">
                        ₹{res.listing?.price?.toLocaleString('en-IN')}
                      </div>
                    </div>
                  </div>

                  {/* Peer Participant Card */}
                  <div className="px-4 pb-4 flex items-center justify-between border-t border-border/50 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-primary/10 text-primary font-bold text-[10px] flex items-center justify-center border border-primary/15">
                        {otherUser?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
                      </div>
                      <div className="text-left">
                        <div className="text-[10px] font-bold text-foreground">
                          {activeTab === 'sales' ? 'Buyer: ' : 'Seller: '}{otherUser?.full_name}
                        </div>
                        <div className="text-[9px] text-muted-foreground flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" /> {otherUser?.college || 'College'}
                        </div>
                      </div>
                    </div>

                    {/* Chat Action Shortcut */}
                    <Link to={`${ROUTES.MESSAGES}`}>
                      <Button variant="outline" size="sm" leftIcon={<MessageSquare className="w-3 h-3" />}>
                        Chat
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Reservation Action Footers */}
                <CardFooter className="p-4 bg-accent/10 border-t border-border flex justify-end gap-2">
                  {isCompleted && (
                    <Button
                      variant="primary"
                      size="sm"
                      className="bg-amber-600 hover:bg-amber-700 text-xs"
                      leftIcon={<Star className="w-3.5 h-3.5 fill-white" />}
                      onClick={() => handleOpenReviewModal(res.id)}
                    >
                      Leave Review
                    </Button>
                  )}

                  {activeTab === 'purchases' && (isPending || isAccepted) && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-danger border-danger/30 hover:bg-danger/5 text-xs"
                      leftIcon={actioningId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                      onClick={() => handleUpdateStatus(res.id, 'cancel', 'Reservation cancelled.')}
                      disabled={actioningId !== null}
                    >
                      Cancel Deal
                    </Button>
                  )}

                  {activeTab === 'sales' && isPending && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-danger border-danger/30 hover:bg-danger/5 text-xs"
                        leftIcon={actioningId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleUpdateStatus(res.id, 'reject', 'Request rejected.')}
                        disabled={actioningId !== null}
                      >
                        Reject
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="text-xs"
                        leftIcon={actioningId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleUpdateStatus(res.id, 'accept', 'Reservation accepted! Coordinate meeting spot.')}
                        disabled={actioningId !== null}
                      >
                        Accept
                      </Button>
                    </>
                  )}

                  {activeTab === 'sales' && isAccepted && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-danger border-danger/30 hover:bg-danger/5 text-xs"
                        leftIcon={actioningId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Ban className="w-3.5 h-3.5" />}
                        onClick={() => handleUpdateStatus(res.id, 'cancel', 'Deal cancelled. Listing reopened.')}
                        disabled={actioningId !== null}
                      >
                        Cancel Deal
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-xs"
                        leftIcon={actioningId === res.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle className="w-3.5 h-3.5" />}
                        onClick={() => handleUpdateStatus(res.id, 'complete', 'Congratulations! Deal marked as sold.')}
                        disabled={actioningId !== null}
                      >
                        Mark as Sold
                      </Button>
                    </>
                  )}

                  {/* Details Link */}
                  <Link to={`/marketplace/${res.listing_id}`}>
                    <Button variant="outline" size="sm" className="text-xs" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                      View Item
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Review Modal Form */}
      <Modal isOpen={isReviewModalOpen} onClose={() => setIsReviewModalOpen(false)} title="Submit Peer Reputation Feedback">
        <form onSubmit={handleSubmitReview} className="space-y-4">
          <p className="text-xs text-muted-foreground">
            How was your P2P campus meetup transaction? Leaving ratings helps keep the university marketplace trustworthy.
          </p>

          <div className="space-y-2">
            <label className="block text-xs font-bold text-foreground">Star Rating (Required)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform active:scale-95"
                >
                  <Star
                    className={`w-6 h-6 ${
                      star <= rating ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-foreground">Review Comment (Optional)</label>
            <textarea
              maxLength={500}
              rows={3}
              placeholder="e.g. Met on time near library, item was exactly as described!"
              className="w-full p-3 text-xs bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <p className="text-[10px] text-right text-muted-foreground">{comment.length}/500 chars</p>
          </div>

          <Button
            type="submit"
            variant="primary"
            className="w-full text-xs"
            disabled={isSubmittingReview}
            leftIcon={isSubmittingReview ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
          >
            {isSubmittingReview ? 'Submitting Review...' : 'Submit Feedback'}
          </Button>
        </form>
      </Modal>
    </div>
  );
};
