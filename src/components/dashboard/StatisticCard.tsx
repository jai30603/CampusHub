import React from 'react';
import { Card } from '@/components/ui/Card';

interface StatisticCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
}

export const StatisticCard: React.FC<StatisticCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
}) => {
  return (
    <Card className="p-5 flex items-center justify-between hover:border-primary/40 transition-colors">
      <div className="space-y-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          {title}
        </p>
        <div className="flex items-baseline gap-2">
          <h3 className="text-2xl font-extrabold text-foreground tracking-tight">{value}</h3>
          {trend && (
            <span className="text-[11px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded">
              {trend}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
        {icon}
      </div>
    </Card>
  );
};
