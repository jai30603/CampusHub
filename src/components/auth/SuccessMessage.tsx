import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuccessMessageProps {
  title: string;
  message?: string;
  className?: string;
}

export const SuccessMessage: React.FC<SuccessMessageProps> = ({ title, message, className }) => {
  return (
    <div
      className={cn(
        'p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-start gap-3 text-xs',
        className
      )}
    >
      <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
      <div className="space-y-0.5">
        <h4 className="font-semibold">{title}</h4>
        {message && <p className="opacity-90">{message}</p>}
      </div>
    </div>
  );
};
