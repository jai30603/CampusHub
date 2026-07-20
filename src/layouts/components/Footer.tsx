import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Globe } from 'lucide-react';
import { ROUTES } from '@/constants/routes';
import { Container } from '@/components/common/Container';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card/50 text-muted-foreground mt-auto transition-colors">
      <Container className="py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to={ROUTES.HOME} className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-primary text-primary-foreground">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight text-foreground">
                Campus<span className="text-primary">Hub</span>
              </span>
            </Link>
            <p className="text-xs leading-relaxed max-w-xs">
              The premier student marketplace platform to buy, sell, exchange textbooks, electronics, and campus essentials.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg hover:bg-accent hover:text-foreground transition-colors">
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Marketplace</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to={ROUTES.MARKETPLACE} className="hover:text-foreground transition-colors">Textbooks & Notes</Link></li>
              <li><Link to={ROUTES.CATEGORIES} className="hover:text-foreground transition-colors">Electronics & Gear</Link></li>
              <li><Link to={ROUTES.SELL} className="hover:text-foreground transition-colors">Dorm Furniture</Link></li>
              <li><Link to={ROUTES.MARKETPLACE} className="hover:text-foreground transition-colors">Housing & Sublets</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><Link to={ROUTES.ABOUT} className="hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-foreground transition-colors">Support & Contact</Link></li>
              <li><Link to={ROUTES.REGISTER} className="hover:text-foreground transition-colors">Campus Verification</Link></li>
              <li><Link to={ROUTES.ADMIN} className="hover:text-foreground transition-colors">Admin Console</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">Legal</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-foreground transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Community Guidelines</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Trust & Safety</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between text-xs gap-4">
          <p>© {new Date().getFullYear()} CampusHub Inc. All rights reserved.</p>
          <p className="text-muted-foreground">Built for students, by students.</p>
        </div>
      </Container>
    </footer>
  );
};
