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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
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
  Search,
  Filter,
  SortAsc,
  SortDesc,
  X,
  ChevronDown,
  ChevronUp,
  ExternalLink,
} from "lucide-react";
import { DeviceUsageChart } from "@/components/dashboard/device-usage-chart";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { NoCredentialsMessage } from "@/components/credentials/no-credentials-message";
import { WithNewEvents } from "@/components/with-new-events";
import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { useListEventsByEmailQuery } from "@/modules/analytics/use-list-events-by-email-query";
import { useState, useMemo } from "react";
import { AnalyticsEvent } from "@/modules/analytics/analytics.types";
import JsonView from "@uiw/react-json-view";
import { useGetUserInfoQuery } from "@/modules/analytics/use-get-user-info-query";

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

  // Activity state management
  const [selectedEvent, setSelectedEvent] = useState<AnalyticsEvent | null>(
    null
  );
  const [visibleCount, setVisibleCount] = useState(20);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] =
    useState<keyof AnalyticsEvent>("created_at");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [filterField, setFilterField] = useState<keyof AnalyticsEvent | "none">(
    "none"
  );
  const [filterValue, setFilterValue] = useState("");

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
  const { data: userInfo } = useGetUserInfoQuery({
    email: user?.email,
    websiteId: credentialId,
  });

  // Filter and sort events
  const filteredAndSortedEvents = useMemo(() => {
    if (!userEvents) return [];

    let filtered = userEvents.filter((event) => {
      // Search query filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch =
          event.event_name?.toLowerCase().includes(searchLower) ||
          event.href?.toLowerCase().includes(searchLower) ||
          event.type?.toLowerCase().includes(searchLower) ||
          event.domain?.toLowerCase().includes(searchLower) ||
          JSON.stringify(event.metadata).toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Field-specific filter
      if (filterField && filterField !== "none" && filterValue) {
        const fieldValue = event[filterField as keyof AnalyticsEvent];
        if (typeof fieldValue === "string") {
          return fieldValue.toLowerCase().includes(filterValue.toLowerCase());
        } else if (typeof fieldValue === "object") {
          return JSON.stringify(fieldValue)
            .toLowerCase()
            .includes(filterValue.toLowerCase());
        }
        return String(fieldValue)
          .toLowerCase()
          .includes(filterValue.toLowerCase());
      }

      return true;
    });

    // Sort events
    filtered.sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortDirection === "asc" ? comparison : -comparison;
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      // Default to string comparison
      const aStr = String(aValue);
      const bStr = String(bValue);
      const comparison = aStr.localeCompare(bStr);
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [
    userEvents,
    searchQuery,
    filterField,
    filterValue,
    sortField,
    sortDirection,
  ]);

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

  const formatDuration = (seconds: number) => {
    if (seconds === 0) return "0s";
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m ${secs}s`;
    return `${secs}s`;
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
                        {userInfo?.basicInformation?.location || formatLocation(user.country, user.region, user.city)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Last Seen:</span>
                      <span className="text-foreground">
                        {userInfo?.basicInformation?.lastSeen ? formatLastSeen(userInfo.basicInformation.lastSeen) : formatLastSeen(user.last_seen)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        First Visit:
                      </span>
                      <span className="text-foreground">
                        {userInfo?.basicInformation?.firstVisit ? new Date(userInfo.basicInformation.firstVisit).toLocaleDateString() : new Date(user.last_seen).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-foreground mb-2">
                    Primary Device & Browser
                  </h3>
                  <div className="space-y-2">
                    {userInfo?.devicesUsed && userInfo.devicesUsed.length > 0 ? (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Browser:</span>
                          <span className="text-foreground">
                            {userInfo.devicesUsed[0].browser_name} {userInfo.devicesUsed[0].browser_version}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">OS:</span>
                          <span className="text-foreground">
                            {userInfo.devicesUsed[0].os_name} {userInfo.devicesUsed[0].os_version}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Device:</span>
                          <span className="text-foreground">
                            {userInfo.devicesUsed[0].device_vendor} {userInfo.devicesUsed[0].device_model}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Browser:</span>
                          <span className="text-foreground">Unknown</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Monitor className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">OS:</span>
                          <span className="text-foreground">Unknown</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Smartphone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Device:</span>
                          <span className="text-foreground">Unknown</span>
                        </div>
                      </>
                    )}
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
              <div className="text-2xl font-bold">
                {userInfo?.basicInformation?.totalPageViews ?? 0}
              </div>
              <p className="text-xs text-muted-foreground">Total page views</p>
            </CardContent>
          </Card>

          <Card className="glass">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {userInfo?.basicInformation?.totalSessions ?? 0}
              </div>
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
              <div className="text-2xl font-bold">
                {formatDuration(userInfo?.basicInformation?.averageDuration ?? 0)}
              </div>
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
                <Badge variant={userInfo?.basicInformation?.status === "active" ? "default" : "secondary"}>
                  {userInfo?.basicInformation?.status ?? "Unknown"}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Current status</p>
            </CardContent>
          </Card>
        </div>

        {/* Device Usage Chart */}
        {userInfo?.devicesUsed && userInfo.devicesUsed.length > 0 && (
          <DeviceUsageChart devices={userInfo.devicesUsed} />
        )}

        {/* Activity Events */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Activity
              {filteredAndSortedEvents.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {filteredAndSortedEvents.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Recent user activity and events</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters and Sorting */}
            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search events..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
                    }
                    className="gap-2"
                  >
                    {sortDirection === "asc" ? (
                      <SortAsc className="h-4 w-4" />
                    ) : (
                      <SortDesc className="h-4 w-4" />
                    )}
                    Sort
                  </Button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Select
                  value={sortField}
                  onValueChange={(value) =>
                    setSortField(value as keyof AnalyticsEvent)
                  }
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="created_at">Created At</SelectItem>
                    <SelectItem value="type">Event Type</SelectItem>
                    <SelectItem value="event_name">Event Name</SelectItem>
                    <SelectItem value="href">Page URL</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={filterField}
                  onValueChange={(value) => {
                    setFilterField(
                      value === "none"
                        ? "none"
                        : (value as keyof AnalyticsEvent)
                    );
                    if (value === "none") {
                      setFilterValue("");
                    }
                  }}
                >
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No filter</SelectItem>
                    <SelectItem value="type">Event Type</SelectItem>
                    <SelectItem value="event_name">Event Name</SelectItem>
                    <SelectItem value="domain">Domain</SelectItem>
                    <SelectItem value="country">Country</SelectItem>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="browser_name">Browser</SelectItem>
                    <SelectItem value="os_name">OS</SelectItem>
                  </SelectContent>
                </Select>

                {filterField && filterField !== "none" && (
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder={`Filter ${filterField}...`}
                      value={filterValue}
                      onChange={(e) => setFilterValue(e.target.value)}
                      className="w-full sm:w-48"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterField("none");
                        setFilterValue("");
                      }}
                      className="shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Events List */}
            {filteredAndSortedEvents.length === 0 ? (
              <div className="text-center py-12">
                <Activity className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No Activity Found
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery || filterValue
                    ? "No events match your current filters"
                    : "This user hasn't performed any tracked actions yet"}
                </p>
                {(searchQuery || filterValue) && (
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setFilterField("none");
                      setFilterValue("");
                    }}
                    className="mt-4"
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAndSortedEvents
                  .slice(0, visibleCount)
                  .map((event, index) => (
                    <div
                      key={`${event.id}-${index}`}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card/50 hover:bg-card transition-colors"
                    >
                      <div 
                        className="flex items-center space-x-4 flex-1 cursor-pointer"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Badge
                          variant={
                            event.type === "pageview"
                              ? "default"
                              : event.type === "payment"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {event.type}
                        </Badge>
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {event.event_name || event.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {event.href}
                          </p>
                          {event.domain && (
                            <p className="text-xs text-muted-foreground">
                              Domain: {event.domain}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right space-y-1">
                          <p className="text-sm text-muted-foreground">
                            {new Date(event.created_at).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(event.created_at).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {event.href && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(event.href, '_blank');
                              }}
                              className="gap-1"
                            >
                              <ExternalLink className="h-3 w-3" />
                              Visit
                            </Button>
                          )}
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                  ))}

                {visibleCount < filteredAndSortedEvents.length && (
                  <div className="text-center pt-4">
                    <Button
                      variant="outline"
                      onClick={() => setVisibleCount((prev) => prev + 20)}
                    >
                      Load More ({filteredAndSortedEvents.length - visibleCount}{" "}
                      remaining)
                    </Button>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Event Details Drawer */}
        <Drawer
          open={selectedEvent !== null}
          onOpenChange={(open) => !open && setSelectedEvent(null)}
        >
          <DrawerContent className="max-h-[80vh]">
            <DrawerHeader className="pb-4">
              <div className="flex items-center justify-between">
                <DrawerTitle>Event Details</DrawerTitle>
                <DrawerClose asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <X className="h-4 w-4" />
                  </Button>
                </DrawerClose>
              </div>
            </DrawerHeader>
            <div className="px-4 pb-6 overflow-auto">
              {selectedEvent && (
                <div className="rounded-lg border bg-card p-4">
                  <JsonView
                    value={selectedEvent}
                    style={{
                      backgroundColor: "transparent",
                      fontSize: "14px",
                    }}
                    collapsed={false}
                    displayDataTypes={false}
                  />
                </div>
              )}
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </WithNewEvents>
  );
};

export default UserDetail;
