import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthHeader } from '@/components/auth/AuthHeader';
import { PasswordInput } from '@/components/auth/PasswordInput';
import { LoadingButton } from '@/components/auth/LoadingButton';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { ROUTES } from '@/constants/routes';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!password) {
      newErrors.password = 'New password is required';
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
    }, 1000);
  };

  return (
    <AuthCard>
      <AuthHeader
        title="Set New Password"
        subtitle="Create a new secure password for your CampusHub account"
      />

      {isSuccess ? (
        <div className="space-y-4">
          <SuccessMessage
            title="Password Updated Successfully!"
            message="Your password has been changed. You can now sign in with your new password."
          />

          <LoadingButton
            variant="primary"
            className="w-full"
            onClick={() => navigate(ROUTES.LOGIN)}
          >
            Continue to Sign In
          </LoadingButton>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
          />

          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={errors.confirmPassword}
          />

          <LoadingButton type="submit" variant="primary" isLoading={isLoading} className="w-full">
            Update Password
          </LoadingButton>
        </form>
      )}
    </AuthCard>
  );
};
