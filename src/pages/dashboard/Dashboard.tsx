import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { PageHeader } from '@/components/common/PageHeader';
import { StatisticCard } from '@/components/dashboard/StatisticCard';
import { ProfileCard } from '@/components/dashboard/ProfileCard';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { apiRequest } from '@/services/api';
import { Package, Heart, MessageSquare, ShoppingBag, PlusCircle, ArrowRight, Settings, Bell, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { wishlistCount } = useWishlist();
  const { notifications, fetchNotifications } = useNotifications();

  const [myListingsCount, setMyListingsCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    const fetchUserStats = async () => {
      try {
        const response = await apiRequest('/listings/user/me');
        if (response.success && response.data) {
          setMyListingsCount(response.data.length);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const fetchUnreadMessages = async () => {
      try {
        const response = await apiRequest('/conversations');
        if (response.success && response.data) {
          const totalUnread = response.data.reduce((sum: number, c: any) => sum + (c.unread_count || 0), 0);
          setUnreadMessagesCount(totalUnread);
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchUserStats();
    fetchUnreadMessages();
    fetchNotifications();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Student'}!`}
        description="Here is an overview of your campus marketplace activity and profile statistics."
        action={
          <Link to={ROUTES.SELL}>
            <Button leftIcon={<PlusCircle className="w-4 h-4" />}>Post New Listing</Button>
          </Link>
        }
      />

      {/* KPI Widgets Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatisticCard
          title="My Listings"
          value={myListingsCount}
          subtitle="Active items on campus"
          icon={<Package className="w-5 h-5" />}
        />
        <StatisticCard
          title="Wishlist"
          value={wishlistCount}
          subtitle="Saved items for later"
          icon={<Heart className="w-5 h-5 text-danger" />}
        />
        <StatisticCard
          title="Messages"
          value={unreadMessagesCount}
          subtitle="Student inquiries"
          icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
        />
        <StatisticCard
          title="Transactions"
          value={0}
          subtitle="Completed sales"
          icon={<ShoppingBag className="w-5 h-5 text-emerald-500" />}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Area: Profile Card & Activity Feed */}
        <div className="lg:col-span-7 space-y-6">
          <ProfileCard
            name={user?.name || 'Student User'}
            email={user?.email || 'student@university.edu'}
            college="IIT Bombay"
            department="Computer Science"
            academicYear="Senior (4th Year)"
            avatarUrl={user?.avatarUrl}
            role={user?.role}
          />

          {/* Activity Feed Widget */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-border/80">
              <CardTitle className="text-base font-bold flex items-center gap-2">
                <Bell className="w-4 h-4 text-primary animate-bounce" /> Recent Campus Activity
              </CardTitle>
              <Link to={ROUTES.NOTIFICATIONS} className="text-xs text-primary font-bold hover:underline">
                View Inbox
              </Link>
            </CardHeader>

            <CardContent className="pt-4 space-y-3">
              {notifications.length === 0 ? (
                <p className="text-xs text-muted-foreground py-6 text-center">
                  No recent marketplace activities to show.
                </p>
              ) : (
                notifications.slice(0, 4).map((notif) => (
                  <div key={notif.id} className="flex gap-3 text-xs items-start border-l-2 border-primary/20 pl-4 py-1 relative">
                    <span className="absolute -left-1.5 top-2 w-3 h-3 rounded-full bg-primary/60 border border-card" />
                    <div className="flex-1 space-y-0.5 text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-foreground truncate">{notif.title}</span>
                        <span className="text-[9px] text-muted-foreground shrink-0">
                          {new Date(notif.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-[11px] leading-relaxed line-clamp-1">
                        {notif.message}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Area: Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link to={ROUTES.SELL} className="block">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  <span className="flex items-center gap-2">
                    <PlusCircle className="w-4 h-4 text-primary" /> Post Item for Sale
                  </span>
                </Button>
              </Link>

              <Link to={ROUTES.MARKETPLACE} className="block">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  <span className="flex items-center gap-2">
                    <Package className="w-4 h-4 text-primary" /> Browse Marketplace
                  </span>
                </Button>
              </Link>

              <Link to={ROUTES.WISHLIST} className="block">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  <span className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-danger" /> View Saved Wishlist
                  </span>
                </Button>
              </Link>

              <Link to={ROUTES.SETTINGS} className="block">
                <Button variant="outline" className="w-full justify-between" rightIcon={<ArrowRight className="w-4 h-4" />}>
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4 text-muted-foreground" /> Account Settings
                  </span>
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
