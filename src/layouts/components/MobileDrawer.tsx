import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { X, GraduationCap, Search } from 'lucide-react';
import { PUBLIC_NAV_LINKS, ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      />

      {/* Drawer Content */}
      <div className="relative w-4/5 max-w-xs bg-background h-full shadow-2xl p-6 flex flex-col justify-between border-r border-border animate-in slide-in-from-left duration-200 z-10">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-border">
            <Link to={ROUTES.HOME} onClick={onClose} className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
                <GraduationCap className="w-4 h-4" />
              </div>
              <span className="font-bold text-base tracking-tight text-foreground">
                Campus<span className="text-primary">Hub</span>
              </span>
            </Link>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <Input
            placeholder="Search..."
            leftIcon={<Search className="w-4 h-4" />}
            className="h-9 text-xs"
          />

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1">
            {PUBLIC_NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={onClose}
                  className={`px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
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

        {/* Footer CTAs */}
        <div className="space-y-2 pt-4 border-t border-border">
          <Link to={ROUTES.LOGIN} onClick={onClose}>
            <Button variant="outline" className="w-full mb-2">
              Sign In
            </Button>
          </Link>
          <Link to={ROUTES.REGISTER} onClick={onClose}>
            <Button variant="primary" className="w-full">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
