import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  User,
  Settings,
  ShieldCheck,
  Users,
  FileText,
  Sliders,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { USER_NAV_LINKS, ADMIN_NAV_LINKS, ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';

interface SidebarProps {
  isAdmin?: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingBag,
  Heart,
  MessageSquare,
  Bell,
  User,
  Settings,
  ShieldCheck,
  Users,
  FileText,
  Sliders,
};

export const Sidebar: React.FC<SidebarProps> = ({
  isAdmin = false,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const location = useLocation();
  const { logoutUser } = useAuth();
  const navLinks = isAdmin ? ADMIN_NAV_LINKS : USER_NAV_LINKS;

  return (
    <aside
      className={`h-screen sticky top-0 border-r border-border bg-card flex flex-col justify-between p-4 transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="space-y-6">
        {/* Sidebar Header */}
        <div className="flex items-center justify-between pb-4 border-b border-border">
          {!isCollapsed && (
            <span className="font-bold text-sm uppercase tracking-wider text-muted-foreground">
              {isAdmin ? 'Admin Console' : 'User Portal'}
            </span>
          )}
          {onToggleCollapse && (
            <button
              onClick={onToggleCollapse}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors mx-auto"
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          )}
        </div>

        {/* Sidebar Links */}
        <nav className="flex flex-col space-y-1">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const IconComponent = ICON_MAP[link.icon] || LayoutDashboard;

            return (
              <Link
                key={link.path}
                to={link.path}
                title={isCollapsed ? link.label : undefined}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <IconComponent className="w-4 h-4 shrink-0" />
                {!isCollapsed && <span>{link.label}</span>}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="pt-4 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={logoutUser}
          className={`w-full text-danger hover:bg-danger/10 hover:text-danger justify-start ${
            isCollapsed ? 'px-2 justify-center' : ''
          }`}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Logout</span>}
        </Button>
      </div>
    </aside>
  );
};
