import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "@tanstack/react-router";
import { useParams } from "@tanstack/react-router";
import {
  ArrowRight,
  DollarSign,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { useGetCurrentWebsite } from "@/hooks/use-get-current-website";
import { useListGoalsQuery } from "@/modules/analytics/use-list-goals-query";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";

const Goals = () => {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();
  const { selectedPeriod, customDateRange } = useFilterPeriodStore();

  const currentWebsite = useGetCurrentWebsite();

  const { data: goalsData, isLoading: goalsLoading } = useListGoalsQuery({
    websiteId: websiteId!,
    period: selectedPeriod,
    // customDateRange: selectedPeriod === "custom" ? customDateRange : undefined,
  });

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  const goals = goalsData?.goals || [];

  return (
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Goals</h1>
          <p className="text-muted-foreground">
            {currentWebsite
              ? `Track goals for ${currentWebsite.title}`
              : "Track progress towards your business objectives"}
          </p>
        </div>
        <ResponsiveFilters />
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Goals</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              4 achieved this month
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last quarter
            </p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">User Growth</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">+24%</div>
            <p className="text-xs text-muted-foreground">Target: +30%</p>
          </CardContent>
        </Card>

        <Card className="glass">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Revenue Target
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">$42K of $50K goal</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle>Goals</CardTitle>
          <CardDescription>
            Click on any goal to view the journeys that led to it
          </CardDescription>
        </CardHeader>
        <CardContent>
          {goalsLoading ? (
            <div className="text-center py-8">Loading goals...</div>
          ) : goals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No goals found for this website
            </div>
          ) : (
            <div className="space-y-4">
              {goals.map((goal) => (
                <Link
                  key={goal.id}
                  to={`/goals/${websiteId}/journeys/${goal.id}`}
                  className="block"
                >
                  <div className="p-4 border rounded-lg hover:bg-secondary/50 cursor-pointer transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <h4 className="font-medium text-foreground">
                          {goal.goalName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Created by {goal.email} •{" "}
                          {new Date(goal.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Active</Badge>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Goals;
