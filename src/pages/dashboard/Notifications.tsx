import React, { useEffect } from 'react';
import { PageHeader } from '@/components/common/PageHeader';
import { EmptyState } from '@/components/common/EmptyState';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useNotifications } from '@/contexts/NotificationContext';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Bell, CheckSquare, MessageSquare, Bookmark, Star, Settings, Calendar } from 'lucide-react';

export const Notifications: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleNotificationClick = async (notif: any) => {
    await markAsRead(notif.id);

    // Redirect to correct target page
    if (notif.type === 'messages') {
      navigate(`${ROUTES.MESSAGES}?id=${notif.reference_id}`);
    } else if (notif.type === 'reservations') {
      navigate(ROUTES.ORDERS);
    } else if (notif.type === 'reviews') {
      navigate(`${ROUTES.PROFILE}`);
    } else if (notif.type === 'account') {
      navigate(`${ROUTES.SETTINGS}`);
    }
  };

  const getNotifIcon = (type: string) => {
    if (type === 'messages') return <MessageSquare className="w-5 h-5 text-blue-500" />;
    if (type === 'reservations') return <Bookmark className="w-5 h-5 text-amber-500" />;
    if (type === 'reviews') return <Star className="w-5 h-5 text-yellow-500" />;
    return <Settings className="w-5 h-5 text-zinc-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Notification Center"
          description="Keep track of transaction updates, message requests, and peer reviews"
        />

        {unreadCount > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            leftIcon={<CheckSquare className="w-4 h-4" />}
            onClick={markAllAsRead}
          >
            Mark All as Read
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <EmptyState
          icon={<Bell className="w-8 h-8 text-muted-foreground" />}
          title="Your inbox is empty"
          description="You will receive alerts here when students contact you about listing items or reserve products."
          actionText="Discover Marketplace"
          onAction={() => navigate(ROUTES.MARKETPLACE)}
        />
      ) : (
        <Card className="divide-y divide-border">
          {notifications.map((notif) => {
            return (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`p-4 flex gap-4 transition-colors cursor-pointer hover:bg-accent/40 items-start ${
                  !notif.is_read ? 'bg-primary/5' : ''
                }`}
              >
                {/* Left Icon Panel */}
                <div className="p-2.5 rounded-xl bg-accent shrink-0 border border-border/80">
                  {getNotifIcon(notif.type)}
                </div>

                <div className="flex-1 min-w-0 space-y-1 text-left">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className={`text-xs ${!notif.is_read ? 'font-extrabold text-foreground' : 'font-bold text-foreground/80'}`}>
                      {notif.title}
                    </h4>
                    <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {new Date(notif.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed max-w-2xl">
                    {notif.message}
                  </p>
                </div>

                {/* Unread circle badge */}
                {!notif.is_read && (
                  <span className="w-2.5 h-2.5 rounded-full bg-primary mt-2 shrink-0" />
                )}
              </div>
            );
          })}
        </Card>
      )}
    </div>
  );
};
export default Notifications;
