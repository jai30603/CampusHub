import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import type { SellerInfo } from '@/data/mockListings';
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { apiRequest } from '@/services/api';
import { ShieldCheck, Star, Calendar, Package, MessageSquare, Loader2 } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

interface SellerCardProps {
  seller: SellerInfo;
  listingId?: string;
}

export const SellerCard: React.FC<SellerCardProps> = ({ seller, listingId }) => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [messageText, setMessageText] = useState('Hi! Is this item still available for pickup on campus?');
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Dynamic reputation states
  const [dynamicRating, setDynamicRating] = useState<number>(seller.rating || 5.0);
  const [reviewsCount, setReviewsCount] = useState<number>(0);
  const [completedDeals, setCompletedDeals] = useState<number>(0);

  useEffect(() => {
    const fetchSellerReputation = async () => {
      if (!seller.id) return;
      try {
        const response = await apiRequest(`/reviews/user/${seller.id}`);
        if (response.success && response.data) {
          setDynamicRating(response.data.average_rating || 5.0);
          setReviewsCount(response.data.total_reviews || 0);
          setCompletedDeals(response.data.completed_deals || 0);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchSellerReputation();
  }, [seller.id]);

  const handleStartChat = async () => {
    if (!listingId) return;
    setIsSending(true);
    setError(null);

    try {
      // Step 1: Start/retrieve conversation
      const response = await apiRequest('/conversations/start', {
        method: 'POST',
        body: JSON.stringify({ listing_id: parseInt(listingId, 10) }),
      });

      if (response.success && response.data) {
        const convId = response.data.id;
        
        // Step 2: Send initial custom message text if provided
        if (messageText.trim()) {
          await apiRequest(`/conversations/${convId}/messages`, {
            method: 'POST',
            body: JSON.stringify({ message: messageText.trim() }),
          });
        }
        
        setIsModalOpen(false);
        navigate(`${ROUTES.MESSAGES}?id=${convId}`);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to start conversation.');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <Card className="p-2 space-y-4 border-border">
        <CardHeader className="p-4 flex flex-row items-center gap-4 space-y-0">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary font-bold text-base flex items-center justify-center shrink-0 border border-primary/20">
            {seller.name.substring(0, 2).toUpperCase()}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-sm text-foreground">{seller.name}</h3>
              {seller.verifiedStudent && (
                <span title="Verified Student">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground">{seller.college}</p>
          </div>
        </CardHeader>

        <CardContent className="px-4 py-0 grid grid-cols-3 gap-2 text-center text-xs">
          <div className="p-2 rounded-xl bg-accent/60">
            <div className="flex items-center justify-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-500" />
              <span>{dynamicRating}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">{reviewsCount} reviews</span>
          </div>

          <div className="p-2 rounded-xl bg-accent/60">
            <div className="flex items-center justify-center gap-1 font-bold text-foreground">
              <Package className="w-3.5 h-3.5 text-primary" />
              <span>{completedDeals}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Deals</span>
          </div>

          <div className="p-2 rounded-xl bg-accent/60">
            <div className="flex items-center justify-center gap-1 font-bold text-foreground">
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-[11px]">{seller.joinedDate}</span>
            </div>
            <span className="text-[10px] text-muted-foreground">Joined</span>
          </div>
        </CardContent>

        <CardFooter className="p-4 pt-2">
          <Button
            variant="primary"
            className="w-full"
            leftIcon={<MessageSquare className="w-4 h-4" />}
            onClick={() => setIsModalOpen(true)}
            disabled={!listingId}
          >
            Chat with Seller
          </Button>
        </CardFooter>
      </Card>

      {/* Contact Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Message ${seller.name}`}>
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Send a direct campus message to arrange item condition inspection and pickup.
          </p>

          {error && <p className="text-xs text-danger font-medium">{error}</p>}

          <div className="space-y-1.5">
            <label className="block text-xs font-medium text-foreground">Your Message</label>
            <textarea
              rows={4}
              className="w-full p-3 text-sm bg-background border border-input rounded-xl focus:outline-none focus:ring-2 focus:ring-ring"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
            />
          </div>
          <Button
            variant="primary"
            className="w-full"
            disabled={isSending}
            leftIcon={isSending ? <Loader2 className="w-4 h-4 animate-spin" /> : undefined}
            onClick={handleStartChat}
          >
            {isSending ? 'Sending Message...' : 'Send Campus Message'}
          </Button>
        </div>
      </Modal>
    </>
  );
};
