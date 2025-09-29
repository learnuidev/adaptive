import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
    title: "Analytics Metadata Trend",
    description: "Analyze trends across metadata values over time with customizable metrics",
    icon: BarChart3,
    features: ["Time-based grouping", "Multiple trend types", "Event filtering"],
  },
  {
    type: "top-values" as const,
    title: "Top N Metadata Values",
    description: "Find the most popular metadata values ranked by activity",
    icon: List,
    features: ["Ranked by event count", "Unique user metrics", "Configurable limit"],
  },
  {
    type: "timeline" as const,
    title: "Metadata Timeline",
    description: "Track a specific metadata value's performance over time",
    icon: Clock,
    features: ["Single value focus", "Event & user counts", "Time series analysis"],
  },
];

export const TrendTypeSelector = ({ onSelect, onCancel }: TrendTypeSelectorProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Select Trend Type</h3>
          <p className="text-sm text-muted-foreground">
            Choose the type of trend analysis you want to create
          </p>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        {trendTypes.map((trend) => {
          const Icon = trend.icon;
          return (
            <Card key={trend.type} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Icon className="h-5 w-5" />
                  {trend.title}
                </CardTitle>
                <CardDescription className="text-sm">
                  {trend.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <ul className="text-xs text-muted-foreground space-y-1 mb-4">
                  {trend.features.map((feature, index) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
                <Button 
                  className="w-full" 
                  onClick={() => onSelect(trend.type)}
                >
                  Create {trend.title}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};