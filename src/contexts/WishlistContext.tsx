import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '@/services/api';

export interface WishlistItem {
  id: string;
  title: string;
  price: number;
  category: string;
  imageUrl?: string;
  college?: string;
  sellerName?: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  savedIds: Set<string>;
  wishlistCount: number;
  isInWishlist: (id: string) => boolean;
  toggleWishlist: (item: WishlistItem) => Promise<void>;
  fetchWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());

  const fetchWishlist = async () => {
    if (!isAuthenticated) {
      setItems([]);
      setSavedIds(new Set());
      return;
    }

    try {
      const response = await apiRequest('/wishlist');
      if (response.success && response.data) {
        const transformed: WishlistItem[] = response.data.map((w: any) => ({
          id: String(w.listing?.id || w.listing_id),
          title: w.listing?.title || 'Listing',
          price: Number(w.listing?.price || 0),
          category: w.listing?.category?.name || 'General',
          imageUrl: w.listing?.images?.[0]?.image_url,
          college: w.listing?.seller?.college || 'Campus',
          sellerName: w.listing?.seller?.full_name || 'Student',
        }));

        setItems(transformed);
        setSavedIds(new Set(transformed.map((i) => i.id)));
      }
    } catch (err) {
      console.error('Failed to fetch user wishlist:', err);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (id: string) => savedIds.has(id);

  const toggleWishlist = async (item: WishlistItem) => {
    if (!isAuthenticated) {
      alert('Please sign in to save items to your campus wishlist.');
      return;
    }

    const isSaved = savedIds.has(item.id);

    // Optimistic UI update
    if (isSaved) {
      setSavedIds((prev) => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setSavedIds((prev) => new Set(prev).add(item.id));
      setItems((prev) => [item, ...prev]);
    }

    // Backend sync in background
    try {
      if (isSaved) {
        await apiRequest(`/wishlist/${item.id}`, { method: 'DELETE' });
      } else {
        await apiRequest(`/wishlist/${item.id}`, { method: 'POST' });
      }
    } catch (err) {
      // Revert on failure
      fetchWishlist();
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        savedIds,
        wishlistCount: items.length,
        isInWishlist,
        toggleWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = (): WishlistContextType => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
