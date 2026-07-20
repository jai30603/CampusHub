import React from 'react';

interface AuthDividerProps {
  label?: string;
}

export const AuthDivider: React.FC<AuthDividerProps> = ({ label = 'Or continue with' }) => {
  return (
    <div className="relative flex items-center justify-center my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-border" />
      </div>
      <span className="relative px-3 bg-card text-[11px] uppercase tracking-wider font-semibold text-muted-foreground">
        {label}
      </span>
    </div>
  );
};
