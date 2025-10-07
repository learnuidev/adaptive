import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowLeft,
  Clock,
  Globe,
  MapPin,
  Monitor,
  Smartphone,
  User,
} from "lucide-react";
import { Link, useParams } from "@tanstack/react-router";

import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { useGetCurrentWebsite } from "@/hooks/use-get-current-website";
import { useListJourneysQuery } from "@/modules/analytics/use-list-journeys-query";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { AnalyticsEvent } from "@/modules/analytics/analytics.types";

const GoalJourneys = () => {
  const params = useParams({ strict: false }) as {
    websiteId?: string;
    goalId?: string;
  };
  const websiteId = params?.websiteId;
  const goalId = params?.goalId;
  const { data: websites } = useListUserWebsitesQuery();

  const currentWebsite = useGetCurrentWebsite();

  const { data: journeysData, isLoading: journeysLoading } =
    useListJourneysQuery({
      websiteId: websiteId!,
      eventId: goalId || "",
    });

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  const formatEventName = (event: AnalyticsEvent) => {
    if (event.type === "pageview") {
      return "Visited page";
    }
    return event.event_name || "Event";
  };

  const formatDeviceIcon = (event: AnalyticsEvent) => {
    const device = event.device_model?.toLowerCase() || "";
    if (device.includes("iphone") || device.includes("android")) {
      return <Smartphone className="h-4 w-4" />;
    }
    return <Monitor className="h-4 w-4" />;
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diff = now.getTime() - time.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return "Just now";
  };

  const formatDuration = (startTime: string, endTime: string) => {
    const diff = new Date(endTime).getTime() - new Date(startTime).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return "< 1m";
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ${minutes % 60}m`;
  };

  const getStepDelay = (currentTime: string, previousTime?: string) => {
    if (!previousTime) return null;
    const diff =
      new Date(currentTime).getTime() - new Date(previousTime).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return null;
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h`;
  };

  const groupEventsByVisitor = (events: AnalyticsEvent[]) => {
    const grouped = events.reduce(
      (acc, event) => {
        if (!acc[event.visitor_id]) {
          acc[event.visitor_id] = [];
        }
        acc[event.visitor_id].push(event);
        return acc;
      },
      {} as Record<string, AnalyticsEvent[]>
    );

    // Sort events within each visitor by timestamp
    Object.keys(grouped).forEach((visitorId) => {
      grouped[visitorId].sort(
        (a, b) =>
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
      );
    });

    return grouped;
  };

  const visitorJourneys =
    journeysData && Array.isArray(journeysData.journeys)
      ? groupEventsByVisitor(journeysData.journeys)
      : {};

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to={`/goals/${websiteId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold">
              {decodeURIComponent(goalId || "")}
            </h1>
            <p className="text-muted-foreground">
              User journeys that achieved this goal
            </p>
          </div>
        </div>

        {journeysLoading ? (
          <div className="text-center py-12 text-muted-foreground">
            Loading journeys...
          </div>
        ) : Object.keys(visitorJourneys).length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No journeys found for this goal
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(visitorJourneys).map(
              ([visitorId, events], journeyIndex) => {
                const firstEvent = events[0];
                const lastEvent = events[events.length - 1];
                const totalDuration = formatDuration(
                  firstEvent.created_at,
                  lastEvent.created_at
                );

                return (
                  <Card key={visitorId} className="border-0 shadow-sm">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="gap-1">
                            <User className="h-3 w-3" />
                            Journey {journeyIndex + 1}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {totalDuration} • {events.length} steps
                          </div>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {formatTimeAgo(firstEvent.created_at)}
                        </div>
                      </div>

                      <div className="space-y-4">
                        {events.map((event, eventIndex) => {
                          const previousEvent = events[eventIndex - 1];
                          const stepDelay = getStepDelay(
                            event.created_at,
                            previousEvent?.created_at
                          );
                          const isLastStep = eventIndex === events.length - 1;

                          return (
                            <div key={event.id} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium border-2 border-background">
                                  {eventIndex + 1}
                                </div>
                                {!isLastStep && (
                                  <div className="w-px h-12 bg-border relative">
                                    {stepDelay && (
                                      <Badge
                                        variant="secondary"
                                        className="absolute left-1/2 transform -translate-x-1/2 -top-2 text-xs whitespace-nowrap"
                                      >
                                        {stepDelay}
                                      </Badge>
                                    )}
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0 pb-6">
                                <div className="flex items-center justify-between mb-1">
                                  <div className="font-medium">
                                    {formatEventName(event)}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {new Date(
                                      event.created_at
                                    ).toLocaleTimeString([], {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </div>
                                </div>

                                {event.href && (
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                                    <Globe className="h-3 w-3" />
                                    <span className="truncate">
                                      {event.href.replace(/^https?:\/\//, "")}
                                    </span>
                                  </div>
                                )}

                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center gap-1">
                                    {formatDeviceIcon(event)}
                                    <span>{event.browser_name}</span>
                                  </div>
                                  {event.city && (
                                    <div className="flex items-center gap-1">
                                      <MapPin className="h-3 w-3" />
                                      <span>{event.city}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                );
              }
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalJourneys;
