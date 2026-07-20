import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { FormInput } from '@/components/auth/FormInput';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { CheckboxField } from '@/components/auth/CheckboxField';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { SocialButton } from '@/components/auth/SocialButton';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { ROUTES } from '@/constants/routes';
import { useAuth } from '@/contexts/AuthContext';
import { Mail } from 'lucide-react';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
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
      await loginUser(email, password);
      navigate(ROUTES.DASHBOARD);
    } catch (err: any) {
      setErrors({ general: err.message || 'Invalid email or password.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Welcome back to CampusHub"
        subtitle="Enter your account credentials to sign in"
      />

      {errors.general && <ErrorMessage title="Authentication Error" message={errors.general} />}

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          leftIcon={<Mail className="w-4 h-4" />}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
        />

        <div className="flex items-center justify-between text-xs pt-1">
          <CheckboxField
            label="Remember me"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
          <Link to={ROUTES.FORGOT_PASSWORD} className="text-primary font-semibold hover:underline">
            Forgot Password?
          </Link>
        </div>

        <LoadingButton type="submit" variant="primary" isLoading={isLoading} className="w-full">
          Sign In to Account
        </LoadingButton>
      </form>

      <AuthDivider />

      <div className="grid grid-cols-2 gap-3">
        <SocialButton provider="google" onClick={() => {}} />
        <SocialButton provider="github" onClick={() => {}} />
      </div>

      <div className="text-center text-xs text-muted-foreground pt-2 border-t border-border">
        Don't have an account?{' '}
        <Link to={ROUTES.REGISTER} className="text-primary font-bold hover:underline">
          Create Account
        </Link>
      </div>
    </AuthCard>
  );
};
