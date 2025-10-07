import { useState } from "react";
import mapboxgl from "mapbox-gl";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  Monitor,
  Smartphone,
  Globe,
  Activity,
  Eye,
  Calendar,
  ExternalLink,
  X,
} from "lucide-react";
import { useGetUserInfoQuery } from "@/modules/analytics/use-get-user-info-query";
import { useListEventsByEmailQuery } from "@/modules/analytics/use-list-events-by-email-query";
import { LiveUser } from "@/modules/analytics/use-get-live-users-query";
import { AnalyticsEvent } from "@/modules/analytics/analytics.types";
import { FilterPeriod } from "@/modules/analytics/analytics.types";

interface LiveUserDetailsPopupProps {
  user: LiveUser;
  users?: LiveUser[];
  mapInstance?: mapboxgl.Map;
  coordinates?: { lng: number; lat: number };
  websiteId: string;
  onClose: () => void;
}

export function LiveUserDetailsPopup({
  user,
  users,
  mapInstance,
  coordinates,
  websiteId,
  onClose,
}: LiveUserDetailsPopupProps) {
  const [activeTab, setActiveTab] = useState<"overview" | "events">("overview");
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const allUsers = users || [user];
  const currentUser = allUsers[selectedUserIndex];

  const { data: userInfo } = useGetUserInfoQuery({
    websiteId,
    email: currentUser.email || "",
  });

  const { data: userEvents } = useListEventsByEmailQuery({
    websiteId,
    period: "last24h",
    email: currentUser.email || "",
  });

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${Math.round(minutes)}m`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.round(minutes % 60);
    return `${hours}h ${remainingMinutes}m`;
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  const getDeviceIcon = (deviceModel: string) => {
    if (
      deviceModel?.toLowerCase().includes("iphone") ||
      deviceModel?.toLowerCase().includes("android") ||
      deviceModel?.toLowerCase().includes("mobile")
    ) {
      return <Smartphone className="w-4 h-4" />;
    }
    return <Monitor className="w-4 h-4" />;
  };

  return (
    <div className="bg-card rounded-lg shadow-xl border border-border w-96 max-h-[80vh] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-border bg-gradient-to-r from-primary/5 to-primary/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-primary/20 text-primary font-semibold">
                {currentUser.email?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-card-foreground">
                {currentUser.email || "Anonymous User"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Currently Active</span>
                {allUsers.length > 1 && (
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">
                    {selectedUserIndex + 1}/{allUsers.length}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="p-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* User Navigation - Only show if multiple users */}
      {allUsers.length > 1 && (
        <div className="px-4 py-2 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              User at this location:
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedUserIndex(Math.max(0, selectedUserIndex - 1))
                }
                disabled={selectedUserIndex === 0}
              >
                Previous
              </Button>
              <span className="text-sm font-medium text-card-foreground">
                {selectedUserIndex + 1} of {allUsers.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setSelectedUserIndex(
                    Math.min(allUsers.length - 1, selectedUserIndex + 1)
                  )
                }
                disabled={selectedUserIndex === allUsers.length - 1}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-border">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "overview"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 py-2 px-4 text-sm font-medium transition-colors ${
            activeTab === "events"
              ? "text-primary border-b-2 border-primary bg-primary/5"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Recent Activity
        </button>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto max-h-[60vh]">
        {activeTab === "overview" && (
          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <MapPin className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-medium text-card-foreground">
                  {currentUser.city}, {currentUser.region},{" "}
                  {currentUser.country}
                </p>
                <p className="text-sm text-muted-foreground">
                  {currentUser.latitude?.toFixed(4)}°,{" "}
                  {currentUser.longitude?.toFixed(4)}°
                </p>
              </div>
            </div>

            {/* Session Info */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-card-foreground">
                    Session
                  </span>
                </div>
                <p className="text-lg font-semibold text-card-foreground">
                  {formatDuration(currentUser.session_duration_minutes || 0)}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  <Activity className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-card-foreground">
                    Events
                  </span>
                </div>
                <p className="text-lg font-semibold text-card-foreground">
                  {currentUser.event_count || 0}
                </p>
              </div>
            </div>

            {/* Device Info */}
            {(currentUser.device_model || currentUser.browser_name) && (
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  {getDeviceIcon(currentUser.device_model || "")}
                  <span className="font-medium text-card-foreground">
                    Device
                  </span>
                </div>
                <div className="space-y-1 text-sm text-muted-foreground">
                  {currentUser.device_model && (
                    <p>Model: {currentUser.device_model}</p>
                  )}
                  {currentUser.browser_name && (
                    <p>
                      Browser: {currentUser.browser_name}{" "}
                      {currentUser.browser_version || ""}
                    </p>
                  )}
                  {currentUser.os_name && (
                    <p>
                      OS: {currentUser.os_name} {currentUser.os_version || ""}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Current Page */}
            {currentUser.last_page && (
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-yellow-500" />
                  <span className="font-medium text-card-foreground">
                    Currently Viewing
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {currentUser.last_page}
                </p>
              </div>
            )}

            {/* Last Activity */}
            <div className="p-3 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span className="font-medium text-card-foreground">
                  Last Activity
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {currentUser.last_activity
                  ? formatTime(currentUser.last_activity)
                  : "Unknown"}
              </p>
              <p className="text-xs text-muted-foreground/70">
                {currentUser.last_seen
                  ? `Last seen: ${new Date(currentUser.last_seen).toLocaleString()}`
                  : ""}
              </p>
            </div>
          </div>
        )}

        {activeTab === "events" && (
          <div className="space-y-3">
            {userEvents && userEvents.length > 0 ? (
              userEvents
                .slice(0, 20)
                .map((event: AnalyticsEvent, index: number) => (
                  <div
                    key={`${event.id}-${index}`}
                    className="p-3 bg-muted/50 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            event.type === "pageview" ? "default" : "secondary"
                          }
                        >
                          {event.type}
                        </Badge>
                        <span className="text-sm font-medium text-card-foreground">
                          {event.event_name}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatTime(event.created_at)}
                      </span>
                    </div>
                    {event.href && (
                      <p className="text-sm text-muted-foreground truncate mb-1">
                        {event.href}
                      </p>
                    )}
                    {event.metadata &&
                      Object.keys(event.metadata).length > 0 && (
                        <div className="mt-2 p-2 bg-card rounded border border-border">
                          <p className="text-xs font-medium text-card-foreground mb-1">
                            Metadata:
                          </p>
                          <div className="space-y-1">
                            {Object.entries(event.metadata).map(
                              ([key, value]) => (
                                <div
                                  key={key}
                                  className="flex justify-between text-xs"
                                >
                                  <span className="text-muted-foreground">
                                    {key}:
                                  </span>
                                  <span className="text-card-foreground truncate ml-2">
                                    {value}
                                  </span>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 text-muted-foreground/30" />
                <p>No recent activity found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-border bg-muted/30">
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // Navigate to full user detail page
            window.open(
              `/websites/${websiteId}/users/${currentUser.visitor_id}`,
              "_blank"
            );
          }}
        >
          <ExternalLink className="w-4 h-4 mr-2" />
          View Full Profile
        </Button>
      </div>
    </div>
  );
}
