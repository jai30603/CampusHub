import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { apiRequest } from '@/services/api';

export interface NotificationItem {
  id: string;
  user_id: number;
  type: string; // messages, reservations, reviews, account
  title: string;
  message: string;
  reference_type?: string;
  reference_id?: number;
  is_read: boolean;
  created_at: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  unreadCount: number;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      // Fetch latest list
      const response = await apiRequest('/notifications');
      if (response.success && response.data) {
        const transformed: NotificationItem[] = response.data.map((n: any) => ({
          id: String(n.id),
          user_id: n.user_id,
          type: n.type,
          title: n.title,
          message: n.message,
          reference_type: n.reference_type,
          reference_id: n.reference_id,
          is_read: n.is_read,
          created_at: n.created_at,
        }));
        setNotifications(transformed);

        // Filter unread count
        const unread = transformed.filter((x) => !x.is_read).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error('Failed to sync user notifications:', err);
    }
  };

  const fetchUnreadCountOnly = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await apiRequest('/notifications/unread-count');
      if (response.success && response.data) {
        setUnreadCount(response.data.count || 0);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Setup periodic polling for bell count
    const interval = setInterval(() => {
      fetchUnreadCountOnly();
    }, 10000);

    return () => clearInterval(interval);
  }, [isAuthenticated]);

  const markAsRead = async (id: string) => {
    // Optimistic state
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
    );
    setUnreadCount((prev) => Math.max(0, prev - 1));

    try {
      await apiRequest(`/notifications/${id}/read`, { method: 'PUT' });
    } catch (err) {
      fetchNotifications();
    }
  };

  const markAllAsRead = async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
    setUnreadCount(0);

    try {
      await apiRequest('/notifications/read-all', { method: 'PUT' });
    } catch (err) {
      fetchNotifications();
    }
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
