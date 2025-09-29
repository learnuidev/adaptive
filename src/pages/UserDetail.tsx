import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  MapPin,
  Clock,
  Activity,
  Calendar,
  Globe,
  Smartphone,
  Monitor,
  Eye,
  BarChart3,
} from "lucide-react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { WithNewEvents } from "@/components/with-new-events";
import { ResponsiveFilters } from "@/components/analytics/ResponsiveFilters";
import { useListEventsByEmailQuery } from "@/modules/analytics/use-list-events-by-email-query";

const UserDetail = () => {
  const params = useParams({ strict: false }) as {
    credentialId?: string;
    userId?: string;
  };
  const { credentialId, userId } = params;
  const navigate = useNavigate();
  const { data: credentials } = useListUserCredentialsQuery();
  const { selectedPeriod } = useFilterPeriodStore();
  const { data: summaryData } = useGetSummaryQuery({
    websiteId: credentialId,
    period: selectedPeriod,
  });

  const currentCredential = credentials?.find(
    (cred) => cred.id === credentialId
  );

  // Find the specific user from visitors data
  const user = summaryData?.visitors?.find(
    (visitor) => visitor.visitor_id === userId
  );

  const { data: userEvents } = useListEventsByEmailQuery({
    email: user?.email,
    websiteId: credentialId,
    period: selectedPeriod,
  });

  console.log("EVENT", userEvents);

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  const getDisplayName = (email?: string, visitorId?: string) => {
    if (email) {
      const name = email.split("@")[0];
      return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._]/g, " ");
    }
    return `Visitor ${visitorId?.slice(-4) || "Unknown"}`;
  };

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

  if (!user) {
    return (
      <WithNewEvents credentialId={credentialId}>
        <div className="min-h-screen bg-background p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: `/users/${credentialId}` as any })}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
          </div>
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">
              User Not Found
            </h1>
            <p className="text-muted-foreground">
              The user you're looking for could not be found.
            </p>
          </div>
        </div>
      </WithNewEvents>
    );
  }

  return (
    <WithNewEvents credentialId={credentialId}>
      <div className="min-h-screen bg-background p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate({ to: `/users/${credentialId}` as any })}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Users
            </Button>
            <div className="space-y-1">
              <h1 className="text-3xl font-bold text-foreground">
                {getDisplayName(user.email, user.visitor_id)}
              </h1>
              <p className="text-muted-foreground">
                User profile and activity details
              </p>
            </div>
          </div>
          <ResponsiveFilters />
        </div>

        {/* User Profile Card */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary text-lg">
                  {getDisplayName(user.email, user.visitor_id)
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">
                  {getDisplayName(user.email, user.visitor_id)}
                </h2>
                <p className="text-muted-foreground">
                  {user.email || "Anonymous visitor"}
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Basic Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-foreground">
                        {formatLocation(user.country, user.region, user.city)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="text-foreground">
                        {formatLastSeen(user.last_seen)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        First Visit:
                      </span>
                      <span className="text-foreground">
                        {new Date(user.last_seen).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Device & Browser
                  </h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Browser:</span>
                      <span className="text-foreground">Chrome</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Monitor className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">OS:</span>
                      <span className="text-foreground">Windows</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Smartphone className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Device:</span>
                      <span className="text-foreground">Desktop</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">Total page views</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Number of visits</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3m</div>
              <p className="text-xs text-muted-foreground">
                Average session time
              </p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Badge variant="default">Active</Badge>
              </div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Activity Events */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activity
            </CardTitle>
            <CardDescription>
              Recent user activity and events
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userEvents && userEvents.length > 0 ? (
              <div className="space-y-4">
                {userEvents.slice(0, 10).map((event) => (
                  <div key={event.id} className="flex items-center gap-3 p-4 rounded-lg border bg-card">
                    <div className="flex-shrink-0">
                      {event.type === "pageview" && (
                        <Eye className="h-5 w-5 text-blue-500" />
                      )}
                      {event.type === "payment" && (
                        <div className="h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                          <span className="text-xs text-white font-bold">$</span>
                        </div>
                      )}
                      {event.type === "custom" && (
                        <Activity className="h-5 w-5 text-purple-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">
                          {event.type === "pageview" && "Page View"}
                          {event.type === "payment" && "Payment"}
                          {event.type === "custom" && (event.event_name || "Custom Event")}
                        </p>
                        <time className="text-xs text-muted-foreground">
                          {new Date(event.created_at).toLocaleString()}
                        </time>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {event.type === "pageview" && event.href}
                        {event.type === "payment" && `Payment processed`}
                        {event.type === "custom" && event.metadata && Object.keys(event.metadata).length > 0 && (
                          <span>
                            {Object.entries(event.metadata).map(([key, value]) => 
                              `${key}: ${value}`
                            ).join(", ")}
                          </span>
                        )}
                      </p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                        <span>{event.browser_name} {event.browser_version}</span>
                        <span>{event.os_name}</span>
                        <span>{formatLocation(event.country, event.region, event.city)}</span>
                      </div>
                    </div>
                  </div>
                ))}
                {userEvents.length > 10 && (
                  <p className="text-sm text-muted-foreground text-center py-2">
                    Showing 10 of {userEvents.length} events
                  </p>
                )}
              </div>
            ) : (
              <div className="h-32 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No activity found for this period</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </WithNewEvents>
  );
};

export default UserDetail;
