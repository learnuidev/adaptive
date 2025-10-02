import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Feature } from "@/modules/feature/feature.types";
import { format } from "date-fns";

interface FeatureCardProps {
  feature: Feature;
}

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <Card className="p-4 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 glass">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{feature.name}</h3>
          {feature.description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {feature.description}
            </p>
          )}
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <Badge variant="secondary" className="text-xs font-mono">
              {feature.featureKey}
            </Badge>
            {feature.tags?.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
        <div className="text-xs text-muted-foreground whitespace-nowrap">
          {format(new Date(feature.createdAt), "MMM d, yyyy")}
        </div>
      </div>
    </Card>
  );
}