import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate, useParams } from "@tanstack/react-router";
import { Activity, Clock, MapPin, UserPlus, Users as UsersIcon, Plus, Search } from "lucide-react";

import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { WithGlow } from "@/components/with-glow";
import { WithNewEvents } from "@/components/with-new-events";
import { CohortCard } from "@/components/cohorts/cohort-card";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";

import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useListCohortsQuery } from "@/modules/cohort/use-list-cohorts-query";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";

const People = () => {
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
  const { data: cohorts, isLoading: cohortsLoading } = useListCohortsQuery(websiteId || "");
  const [searchQuery, setSearchQuery] = useState("");

  const currentWebsite = websites?.find((cred) => cred.id === websiteId);

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  // Utility functions
  const formatLastSeen = (lastSeen: string) => {
    const date = new Date(lastSeen);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
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
  const filteredCohorts = (cohorts || []).filter((cohort) =>
    cohort.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <WithNewEvents websiteId={websiteId}>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-card/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-foreground">People</h1>
                <p className="text-muted-foreground">
                  {currentWebsite
                    ? `Manage people for ${currentWebsite.title}`
                    : "Manage and analyze your users and cohorts"}
                </p>
              </div>
              <ResponsiveFilters />
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card className="p-4 glass">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                    <p className="text-2xl font-bold text-foreground">2,847</p>
                  </div>
                  <UsersIcon className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>

              <Card className="p-4 glass">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold text-foreground">1,234</p>
                  </div>
                  <Activity className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>

              <Card className="p-4 glass">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Cohorts</p>
                    <p className="text-2xl font-bold text-foreground">{cohorts?.length || 0}</p>
                  </div>
                  <UserPlus className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>

              <Card className="p-4 glass">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Avg. Session</p>
                    <p className="text-2xl font-bold text-foreground">4m 32s</p>
                  </div>
                  <Clock className="h-4 w-4 text-muted-foreground" />
                </div>
              </Card>
            </div>
          </div>
        </div>

        <div className="p-6">
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 max-w-md">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="cohorts">Cohorts</TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="glass">
                <CardHeader>
                  <CardTitle>Recent Users</CardTitle>
                  <CardDescription>Latest user activity and engagement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {visitors.length > 0 ? (
                      visitors.map((visitor) => (
                        <div
                          key={visitor.visitor_id}
                          onClick={() =>
                            navigate({
                              to: `/users/${websiteId}/${visitor.visitor_id}`,
                            })
                          }
                          className="flex items-center justify-between p-3 rounded-lg glass hover:bg-accent/50 cursor-pointer transition-colors"
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
                                  {formatLocation(visitor.country, visitor.region, visitor.city)}
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
                        <p className="text-sm">Users will appear here once they visit your site</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Cohorts Tab */}
            <TabsContent value="cohorts" className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search cohorts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 glass"
                  />
                </div>
                <WithGlow>
                  <Button
                    onClick={() => navigate({ to: `/cohorts/${websiteId}/add` })}
                    className="bg-gradient-primary hover:bg-primary-glow shadow-emerald"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Cohort
                  </Button>
                </WithGlow>
              </div>

              {cohortsLoading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading...
                </div>
              ) : filteredCohorts.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-muted-foreground">
                    <p className="text-lg mb-2">No cohorts yet</p>
                    <p className="text-sm">Create your first cohort to segment your users</p>
                  </div>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {filteredCohorts.map((cohort) => (
                    <CohortCard
                      key={cohort.id}
                      cohort={cohort}
                      websiteId={cohort.websiteId}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </WithNewEvents>
  );
};

export default People;
