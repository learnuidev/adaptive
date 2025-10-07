import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Clock, Globe, Monitor, User } from "lucide-react";
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
      eventId: goalId,
    });

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  const formatEventName = (event: AnalyticsEvent) => {
    if (event.type === "pageview") {
      return "Page View";
    }
    if (event.type === "custom") {
      return event.event_name || "Custom Event";
    }
    if (event.type === "payment") {
      return "Payment Event";
    }
    return event.event_name || "Unknown Event";
  };

  const formatDeviceIcon = (event: AnalyticsEvent) => {
    if (
      event.device_vendor?.toLowerCase().includes("apple") ||
      event.device_model?.toLowerCase().includes("iphone") ||
      event.device_model?.toLowerCase().includes("ipad")
    ) {
      return <div className="w-4 h-4 bg-blue-500 rounded" />;
    }
    return <Monitor className="h-4 w-4" />;
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
    <div className="min-h-screen bg-background p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/goals/${websiteId}`}>
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Goals
            </Button>
          </Link>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-foreground">
              Journeys to: {decodeURIComponent(goalId || "")}
            </h1>
            <p className="text-muted-foreground">
              {currentWebsite
                ? `User journeys that led to this goal on ${currentWebsite.title}`
                : "User journeys that led to this goal"}
            </p>
          </div>
        </div>
      </div>

      <Card className="glass">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Journey Overview
          </CardTitle>
          <CardDescription>
            Complete user journeys showing the steps users took to achieve this
            goal
          </CardDescription>
        </CardHeader>
        <CardContent>
          {journeysLoading ? (
            <div className="text-center py-8">Loading journeys...</div>
          ) : Object.keys(visitorJourneys).length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No journeys found for this goal
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(visitorJourneys).map(
                ([visitorId, events], journeyIndex) => (
                  <div key={visitorId} className="border rounded-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">
                          Journey #{journeyIndex + 1}
                        </h3>
                        <Badge variant="secondary" className="gap-1">
                          <User className="h-3 w-3" />
                          {visitorId.slice(0, 8)}...
                        </Badge>
                        <Badge variant="outline" className="gap-1">
                          <Clock className="h-3 w-3" />
                          {events.length} steps
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(events[0]?.created_at).toLocaleDateString()} -{" "}
                        {new Date(
                          events[events.length - 1]?.created_at
                        ).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="space-y-4">
                      {events.map((event, eventIndex) => (
                        <div key={event.id} className="flex items-start gap-4">
                          <div className="flex flex-col items-center">
                            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                              {eventIndex + 1}
                            </div>
                            {eventIndex < events.length - 1 && (
                              <div className="w-0.5 h-12 bg-border mt-2" />
                            )}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="font-medium text-lg">
                                {formatEventName(event)}
                              </div>
                              <Badge
                                variant={
                                  event.type === "pageview"
                                    ? "default"
                                    : "secondary"
                                }
                              >
                                {event.type}
                              </Badge>
                            </div>

                            {event.href && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <Globe className="h-4 w-4" />
                                <span className="truncate">{event.href}</span>
                              </div>
                            )}

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <div className="font-medium text-muted-foreground">
                                  Device
                                </div>
                                <div className="flex items-center gap-2">
                                  {formatDeviceIcon(event)}
                                  <span>
                                    {event.device_vendor} {event.device_model}
                                  </span>
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-muted-foreground">
                                  Browser
                                </div>
                                <div>
                                  {event.browser_name} {event.browser_version}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-muted-foreground">
                                  Location
                                </div>
                                <div>
                                  {event.city}, {event.region}
                                </div>
                              </div>
                              <div>
                                <div className="font-medium text-muted-foreground">
                                  Time
                                </div>
                                <div>
                                  {new Date(event.created_at).toLocaleString()}
                                </div>
                              </div>
                            </div>

                            {event.metadata &&
                              Object.keys(event.metadata).length > 0 && (
                                <div className="mt-3 p-3 bg-muted/50 rounded">
                                  <div className="font-medium text-sm text-muted-foreground mb-2">
                                    Event Details
                                  </div>
                                  <div className="grid grid-cols-2 gap-2 text-sm">
                                    {Object.entries(event.metadata).map(
                                      ([key, value]) => (
                                        <div key={key}>
                                          <span className="font-medium">
                                            {key}:
                                          </span>{" "}
                                          {value}
                                        </div>
                                      )
                                    )}
                                  </div>
                                </div>
                              )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {journeyIndex < Object.keys(visitorJourneys).length - 1 && (
                      <div className="mt-8 pt-8 border-t" />
                    )}
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default GoalJourneys;
