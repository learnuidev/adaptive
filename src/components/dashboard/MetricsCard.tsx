import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface MetricsCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  trend?: number[];
}

export function MetricsCard({ title, value, change, changeType = 'neutral', icon: Icon, trend }: MetricsCardProps) {
  const changeColor = {
    positive: 'text-primary',
    negative: 'text-destructive',
    neutral: 'text-muted-foreground'
  }[changeType];

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            {title}
          </p>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-foreground">
              {value}
            </p>
            {change && (
              <p className={`text-sm font-medium ${changeColor}`}>
                {change}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col items-center gap-3">
          <div className="p-3 bg-primary-soft rounded-xl">
            <Icon className="w-6 h-6 text-primary" />
          </div>
          {trend && (
            <div className="w-16 h-8 flex items-end gap-1">
              {trend.map((value, index) => (
                <div
                  key={index}
                  className="flex-1 bg-primary/30 rounded-sm"
                  style={{ height: `${(value / Math.max(...trend)) * 100}%` }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}