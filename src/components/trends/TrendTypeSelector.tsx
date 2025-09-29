import { Button } from "@/components/ui/button";
import { BarChart3, List, Clock } from "lucide-react";
import { TrendVariant } from "@/modules/trends/trends.types";

interface TrendTypeSelectorProps {
  onSelect: (type: TrendVariant) => void;
  onCancel: () => void;
}

const trendTypes = [
  {
    type: "analytics" as const,
    title: "Analytics Metadata",
    subtitle: "Analyze trends across metadata values",
    icon: BarChart3,
  },
  {
    type: "top-values" as const,
    title: "Top N Values",
    subtitle: "Find the most popular metadata values",
    icon: List,
  },
  {
    type: "timeline" as const,
    title: "Metadata Timeline",
    subtitle: "Track specific value performance",
    icon: Clock,
  },
];

export const TrendTypeSelector = ({ onSelect, onCancel }: TrendTypeSelectorProps) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Create New Trend
        </h2>
        <p className="text-muted-foreground text-sm">
          Choose the type of analysis you want to create
        </p>
      </div>
      
      <div className="space-y-3 mb-8">
        {trendTypes.map((trend) => {
          const Icon = trend.icon;
          return (
            <button
              key={trend.type}
              onClick={() => onSelect(trend.type)}
              className="w-full p-6 bg-card hover:bg-accent/50 border border-border rounded-xl transition-all duration-200 hover:shadow-sm hover:scale-[0.995] active:scale-[0.99] group text-left"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-full group-hover:bg-primary/15 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-foreground mb-1">
                    {trend.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {trend.subtitle}
                  </p>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          variant="ghost" 
          onClick={onCancel}
          className="text-muted-foreground hover:text-foreground"
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};