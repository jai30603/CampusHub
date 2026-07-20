import React from 'react';
import { AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  title: string;
  message?: string;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ title, message, className }) => {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border border-rose-500/20 bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-start gap-3 text-xs',
        className
      )}
    >
      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <h4 className="font-semibold">{title}</h4>
        {message && <p className="opacity-90">{message}</p>}
      </div>
    </div>
  );
};
