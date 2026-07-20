import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { CheckboxField } from '@/components/auth/CheckboxField';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialButton } from '@/components/auth/SocialButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { User, Mail } from 'lucide-react';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const { registerUser } = useAuth();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = 'Full name is required';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!acceptedTerms) {
      newErrors.terms = 'You must accept the Terms & Privacy Policy to register';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setErrors({});

    try {
      await registerUser({
        fullName,
        email,
        password,
      });
      navigate(ROUTES.VERIFY_EMAIL_SUCCESS);
    } catch (err: any) {
      setErrors({ general: err.message || 'Registration failed. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard className="max-w-md">
      <AuthHeader
        title="Create Account"
        subtitle="Join the CampusHub marketplace in a few seconds"
      />

      {errors.general && <ErrorMessage title="Registration Error" message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Full Name"
          placeholder="e.g. Jailingam Santhanakumar"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          leftIcon={<User className="w-4 h-4" />}
        />

        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />
          <PasswordInput
            label="Confirm Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />
        </div>

        <CheckboxField
          label={
            <span>
              I accept CampusHub's{' '}
              <a href="#" className="text-primary underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary underline">Privacy Policy</a>
            </span>
          }
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          error={errors.terms}
        />

        <LoadingButton type="submit" variant="primary" isLoading={isLoading} className="w-full">
          Create Account
        </LoadingButton>
      </form>

      <AuthDivider />

      <div className="grid grid-cols-2 gap-3">
        <SocialButton provider="google" onClick={() => {}} />
        <SocialButton provider="github" onClick={() => {}} />
      </div>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Already have an account?{' '}
        <Link to={ROUTES.LOGIN} className="text-primary font-bold hover:underline">
          Sign In
        </Link>
      </div>
    </AuthCard>
  );
};
