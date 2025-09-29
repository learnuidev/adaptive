import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Users, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface FeatureCardProps {
  name: string;
  description: string;
  enabled: boolean;
  rolloutPercentage: number;
  environment: 'production' | 'staging' | 'development';
  usersAffected: number;
  onToggle: () => void;
}

export function FeatureCard({
  name,
  description,
  enabled,
  rolloutPercentage,
  environment,
  usersAffected,
  onToggle
}: FeatureCardProps) {
  const environmentColors = {
    production: 'bg-primary text-primary-foreground',
    staging: 'bg-orange-500 text-white',
    development: 'bg-blue-500 text-white'
  };

  return (
    <Card className="p-6 bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-foreground">{name}</h3>
            <Badge className={environmentColors[environment]}>
              {environment}
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Switch checked={enabled} onCheckedChange={onToggle} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="glass">
              <DropdownMenuItem>
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                Edit Configuration
              </DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Delete Feature
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Rollout</span>
          <span className="font-medium text-foreground">{rolloutPercentage}%</span>
        </div>
        
        <div className="w-full bg-muted/30 rounded-full h-2">
          <div 
            className="bg-primary rounded-full h-2 transition-all duration-500"
            style={{ width: `${rolloutPercentage}%` }}
          />
        </div>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Users className="w-4 h-4" />
            <span>Users affected</span>
          </div>
          <span className="font-medium text-foreground">{usersAffected.toLocaleString()}</span>
        </div>
      </div>
    </Card>
  );
}