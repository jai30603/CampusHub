import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Search, Sun, Moon, Menu, ShoppingBag, Bell, User as UserIcon, GraduationCap, CheckCircle2, MessageSquare, Bookmark, Star, Settings } from 'lucide-react';
import { PUBLIC_NAV_LINKS, ROUTES } from '@/constants/routes';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useNotifications } from '@/contexts/NotificationContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { MobileDrawer } from './MobileDrawer';

export const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { theme, setTheme, isDark } = useTheme();
  const { user, isAuthenticated } = useAuth();
  const { itemCount } = useCart();
  const { notifications, unreadCount, markAsRead, markAllAsRead, fetchNotifications } = useNotifications();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isBellOpen, setIsBellOpen] = useState(false);

  const bellRef = useRef<HTMLDivElement>(null);

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (bellRef.current && !bellRef.current.contains(event.target as Node)) {
        setIsBellOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNotificationClick = async (notif: any) => {
    await markAsRead(notif.id);
    setIsBellOpen(false);

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
    if (type === 'messages') return <MessageSquare className="w-3.5 h-3.5 text-blue-500" />;
    if (type === 'reservations') return <Bookmark className="w-3.5 h-3.5 text-amber-500" />;
    if (type === 'reviews') return <Star className="w-3.5 h-3.5 text-yellow-500" />;
    return <Settings className="w-3.5 h-3.5 text-zinc-500" />;
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to={ROUTES.HOME} className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-xl bg-primary text-primary-foreground group-hover:scale-105 transition-transform">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg tracking-tight text-foreground">
              Campus<span className="text-primary">Hub</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Global Search Bar Placeholder */}
        <div className="hidden sm:flex max-w-xs w-full">
          <Input
            placeholder="Search textbook, notes..."
            leftIcon={<Search className="w-4 h-4 text-muted-foreground" />}
            className="h-9 text-xs"
          />
        </div>

        {/* Icon Actions Bar */}
        <div className="flex items-center gap-2.5">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme mode"
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Cart Icon */}
          <Link
            to={ROUTES.MARKETPLACE}
            className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground">
                {itemCount}
              </span>
            )}
          </Link>

          {/* Dynamic Dropdown Notification Bell */}
          {isAuthenticated && (
            <div ref={bellRef} className="relative">
              <button
                onClick={() => {
                  setIsBellOpen(!isBellOpen);
                  if (!isBellOpen) fetchNotifications();
                }}
                className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-danger animate-pulse" />
                )}
              </button>

              {isBellOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl bg-card border border-border shadow-lg py-2 z-50 text-left">
                  <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                    <span className="font-bold text-xs">Notifications ({unreadCount})</span>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-[10px] text-primary font-semibold hover:underline">
                        Mark all as read
                      </button>
                    )}
                  </div>

                  <div className="max-h-60 overflow-y-auto divide-y divide-border/60">
                    {notifications.length === 0 ? (
                      <div className="p-6 text-center text-xs text-muted-foreground">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <button
                          key={n.id}
                          onClick={() => handleNotificationClick(n)}
                          className={`w-full p-3 text-left transition-colors flex gap-2.5 items-start hover:bg-accent/40 ${
                            !n.is_read ? 'bg-primary/5' : ''
                          }`}
                        >
                          <div className="p-1.5 rounded-lg bg-accent shrink-0">
                            {getNotifIcon(n.type)}
                          </div>
                          <div className="flex-1 min-w-0 space-y-0.5">
                            <div className="font-bold text-[11px] text-foreground leading-tight truncate">
                              {n.title}
                            </div>
                            <p className="text-[10px] text-muted-foreground line-clamp-2 leading-relaxed">
                              {n.message}
                            </p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>

                  <div className="px-4 py-2 border-t border-border/80 text-center">
                    <Link
                      to={ROUTES.NOTIFICATIONS}
                      onClick={() => setIsBellOpen(false)}
                      className="text-[10px] text-primary font-bold hover:underline"
                    >
                      View all notifications
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* User Auth Buttons / Profile Link */}
          {isAuthenticated ? (
            <Link to={ROUTES.DASHBOARD}>
              <Button size="sm" variant="outline" leftIcon={<UserIcon className="w-4 h-4" />}>
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link to={ROUTES.LOGIN}>
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link to={ROUTES.REGISTER}>
                <Button size="sm" variant="primary">
                  Get Started
                </Button>
              </Link>
            </div>
          )}

          {/* Mobile Hamburger Toggle */}
          <button
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open mobile menu"
            className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors ml-1"
          >
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <MobileDrawer isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />
    </header>
  );
};
