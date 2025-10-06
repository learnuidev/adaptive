import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  Activity,
  Clock,
  MapPin,
  UserPlus,
  Users as UsersIcon,
} from "lucide-react";

import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";

import { WithNewEvents } from "@/components/with-new-events";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";

const Users = () => {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const navigate = useNavigate();
  const { data: websites } = useListUserWebsitesQuery();
  const { selectedPeriod, customDateRange } = useFilterPeriodStore();
  const { data: summaryData } = useGetSummaryQuery({
    websiteId: websiteId,
    period: selectedPeriod,
    customDateRange: selectedPeriod === "custom" ? customDateRange : undefined,
  });

  const currentWebsite = websites?.find((cred) => cred.id === websiteId);

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  // Transform visitors data for display
  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24)
      return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  };

  const formatLocation = (country?: string, region?: string, city?: string) => {
    const parts = [city, region, country].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : "Unknown location";
  };

  const getDisplayName = (email?: string, visitorId?: string) => {
    if (email) {
      const name = email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, " ");
    }
    return `Visitor ${visitorId?.slice(-4) || "Unknown"}`;
  };

  const visitors = summaryData?.visitors || [];

  return (
    <WithNewEvents websiteId={websiteId}>
      <div className="min-h-screen bg-background p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">Users</h1>
            <p className="text-muted-foreground">
              {currentWebsite
                ? `Manage users for ${currentWebsite.title}`
                : "Manage and analyze your user base"}
            </p>
          </div>
          <ResponsiveFilters />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <UsersIcon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <p className="text-xs text-muted-foreground">
                +15.3% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Users
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">
                +8.2% from last week
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Users</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">
                +12 since yesterday
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Session
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4m 32s</div>
              <p className="text-xs text-muted-foreground">
                +1m 12s from last week
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="glass">
          <CardHeader>
            <CardTitle>Recent Users</CardTitle>
            <CardDescription>
              Latest user activity and engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <div
                    key={visitor.visitor_id}
                    onClick={() =>
                      navigate({
                        to: `/users/${websiteId}/${visitor.visitor_id}` as any,
                      })
                    }
                    className="flex items-center justify-between p-3 rounded-lg border border-border/50 glass hover:bg-accent/50 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getDisplayName(visitor.email, visitor.visitor_id)
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">
                          {getDisplayName(visitor.email, visitor.visitor_id)}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {visitor.email || "Anonymous visitor"}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>
                            {formatLocation(
                              visitor.country,
                              visitor.region,
                              visitor.city
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge variant="default">Active</Badge>
                      <span className="text-sm text-muted-foreground">
                        {formatLastSeen(visitor.last_seen)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No recent users found</p>
                  <p className="text-sm">
                    Users will appear here once they visit your site
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </WithNewEvents>
  );
};

export default Users;
