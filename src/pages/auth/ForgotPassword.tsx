import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { ROUTES } from '@/constants/routes';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setError('');
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Reset your password"
        subtitle="Enter your email and we'll send you recovery instructions"
      />

      {isSubmitted ? (
        <div className="space-y-4">
          <SuccessMessage
            title="Password Reset Link Sent"
            message={`If an account exists for ${email}, we have sent a password recovery link to your inbox.`}
          />

          <Link to={ROUTES.RESET_PASSWORD}>
            <LoadingButton variant="outline" className="w-full mt-2">
              Demo: Proceed to Reset Password Page
            </LoadingButton>
          </Link>

          <div className="text-center text-xs pt-4 border-t border-border">
            <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <FormInput
            label="Email Address"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error}
            leftIcon={<Mail className="w-4 h-4" />}
          />

          <LoadingButton type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Send Recovery Link
          </LoadingButton>

          <div className="text-center text-xs pt-4 border-t border-border">
            <Link to={ROUTES.LOGIN} className="inline-flex items-center gap-1.5 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
            </Link>
          </div>
        </form>
      )}
    </AuthCard>
  );
};
