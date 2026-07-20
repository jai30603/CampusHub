import React from 'react';

export interface CheckboxFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: React.ReactNode;
  error?: string;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({ label, error, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="flex items-start gap-2 text-xs text-muted-foreground cursor-pointer select-none">
        <input
          type="checkbox"
          className="mt-0.5 rounded border-input text-primary focus:ring-primary h-4 w-4 shrink-0"
          {...props}
        />
        <span>{label}</span>
      </label>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};
