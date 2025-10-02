import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar } from "lucide-react";
import { Cohort } from "@/modules/cohort/cohort.types";
import { format } from "date-fns";

interface CohortCardProps {
  cohort: Cohort;
}

export function CohortCard({ cohort }: CohortCardProps) {
  const ruleCount = cohort.cohortRules?.length || 0;

  return (
    <Card className="glass border-border/50 hover:border-primary/20 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">{cohort.name}</h3>
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <Calendar className="w-3 h-3" />
                {format(new Date(cohort.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs">
            {ruleCount} {ruleCount === 1 ? "rule" : "rules"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
