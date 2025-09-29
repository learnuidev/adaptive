import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const Cohorts = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Cohorts</h1>
        <p className="text-muted-foreground">
          Track user behavior and retention across different cohorts
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Cohort Analysis
            </CardTitle>
            <CardDescription>
              Analyze user behavior patterns and retention metrics across different time periods
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Cohort analysis coming soon...
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cohorts;