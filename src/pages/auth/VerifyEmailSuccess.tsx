import React from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { Button } from '@/components/ui/Button';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { ROUTES } from '@/constants/routes';

export const VerifyEmailSuccess: React.FC = () => {
  return (
    <AuthCard className="text-center">
      <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
        <CheckCircle2 className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h2 className="text-2xl font-extrabold text-foreground tracking-tight">Email Verified!</h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          Your campus email address has been successfully verified. Your account is now active and ready for buying and selling on campus.
        </p>
      </div>

      <div className="pt-4">
        <Link to={ROUTES.LOGIN}>
          <Button variant="primary" size="lg" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
            Continue to Sign In
          </Button>
        </Link>
      </div>
    </AuthCard>
  );
};
