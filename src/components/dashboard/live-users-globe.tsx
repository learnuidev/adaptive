import { useEffect, useRef, useState } from "react";
import Map, { Popup, MapRef, Marker, MapMouseEvent } from "react-map-gl/mapbox";
import "mapbox-gl/dist/mapbox-gl.css";
import "./live-users-globe.css";
import {
  useGetLiveUsersQuery,
  LiveUser,
} from "@/modules/analytics/use-get-live-users-query";
import { Button } from "@/components/ui/button";
import { X, Users, Plus, Minus } from "lucide-react";
import { LiveUserDetailsPopup } from "./live-user-details-popup";
import { createPortal } from "react-dom";

interface LiveUsersGlobeProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;

interface LocationGroup {
  latitude: number;
  longitude: number;
  city?: string;
  country?: string;
  users: LiveUser[];
  count: number;
}

export function LiveUsersGlobe({
  websiteId,
  isOpen,
  onClose,
}: LiveUsersGlobeProps) {
  const mapRef = useRef<MapRef>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<LiveUser[]>([]);
  const [popupInfo, setPopupInfo] = useState<{
    longitude: number;
    latitude: number;
    users: LiveUser[];
    userCount: number;
    name: string;
    country: string;
  } | null>(null);

  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [0, 0],
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
    }
  };

  const { data: liveUsersData } = useGetLiveUsersQuery({
    websiteId,
    timeWindowMinutes: 30,
    includeSummary: false,
    includeGeography: true,
    limit: 1000,
    enabled: isOpen && !!websiteId,
  });

  // Process live users data into GeoJSON features
  const geoJsonData = useRef<GeoJSON.FeatureCollection>({
    type: "FeatureCollection",
    features: [],
  });

  useEffect(() => {
    if (!liveUsersData?.liveUsers) {
      geoJsonData.current.features = [];
      return;
    }

    // Group users by exact coordinates for clustering nearby users
    const locationGroups = liveUsersData.liveUsers.reduce(
      (acc: Record<string, LocationGroup>, user: LiveUser) => {
        if (user.latitude && user.longitude) {
          const latKey = Math.round(user.latitude * 100) / 100;
          const lngKey = Math.round(user.longitude * 100) / 100;
          const key = `${latKey},${lngKey}`;

          if (!acc[key]) {
            acc[key] = {
              latitude: user.latitude,
              longitude: user.longitude,
              city: user.city,
              country: user.country,
              users: [],
              count: 0,
            };
          }
          acc[key].users.push(user);
          acc[key].count++;
        } else if (user.city && user.country) {
          const key = `${user.city},${user.country}`;

          if (!acc[key]) {
            acc[key] = {
              latitude: 0,
              longitude: 0,
              city: user.city,
              country: user.country,
              users: [],
              count: 0,
            };
          }
          acc[key].users.push(user);
          acc[key].count++;
        }
        return acc;
      },
      {}
    );

    // Create features for clustered locations with valid coordinates only
    const features = Object.values(locationGroups)
      .map((location) => {
        if (location.latitude === 0 && location.longitude === 0) {
          return null;
        }
        return {
          type: "Feature",
          properties: {
            name: location.city || "Unknown Location",
            country: location.country || "Unknown",
            userCount: location.count,
            users: location.users,
          },
          geometry: {
            type: "Point",
            coordinates: [location.longitude, location.latitude],
          },
        } as GeoJSON.Feature;
      })
      .filter((f): f is GeoJSON.Feature => f !== null);

    geoJsonData.current = {
      type: "FeatureCollection",
      features,
    };
  }, [liveUsersData]);

  const handleMapLoad = () => {
    setMapLoaded(true);

    if (mapRef.current) {
      mapRef.current.getMap().setFog({
        "horizon-blend": 0.1,
        color: "#242B4B",
        "high-color": "#161B3D",
        "space-color": "#0B0E1F",
        "star-intensity": 0.15,
      });
    }
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if (!event.features || event.features.length === 0) {
      setPopupInfo(null);
      setSelectedUser(null);
      setSelectedUsers([]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative w-full h-full">
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 bg-black/50 backdrop-blur-sm border-b border-white/10">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-green-400" />
              <h2 className="text-xl font-semibold text-white">
                Live Users Globe
              </h2>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-300">
                  {liveUsersData?.metadata.totalLiveUsers || 0} active users
                </span>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Map Container */}
        <Map
          ref={mapRef}
          mapboxAccessToken={mapboxApiKey}
          initialViewState={{
            longitude: 0,
            latitude: 0,
            zoom: 2,
            pitch: 0,
            bearing: 0,
          }}
          style={{ width: "100%", height: "100%", paddingTop: "73px" }}
          mapStyle="mapbox://styles/mapbox/dark-v11"
          projection="globe"
          interactive={true}
          dragPan={true}
          dragRotate={true}
          scrollZoom={true}
          minZoom={0.5}
          maxZoom={8}
          onLoad={handleMapLoad}
          onClick={handleMapClick}
        >
          {/* Render user clusters as Markers */}
          {mapLoaded &&
            geoJsonData.current.features.map((feature, index) => {
              // @ts-ignore
              const [longitude, latitude] = feature?.geometry?.coordinates;
              const { name, country, userCount, users } =
                feature.properties as {
                  name: string;
                  country: string;
                  userCount: number;
                  users: LiveUser[];
                };

              return (
                <Marker
                  key={index}
                  longitude={longitude}
                  latitude={latitude}
                  onClick={(e) => {
                    e.originalEvent.stopPropagation();
                    const firstUser = users[0];
                    setSelectedUser(firstUser);
                    setSelectedUsers(users);
                    setPopupInfo({
                      longitude,
                      latitude,
                      users,
                      userCount,
                      name,
                      country,
                    });
                  }}
                >
                  <div
                    style={{
                      width: `${8 + Math.min(userCount * 1.5, 25)}px`,
                      height: `${8 + Math.min(userCount * 1.5, 25)}px`,
                      backgroundColor: "#00ff88",
                      borderRadius: "50%",
                      border: "2px solid white",
                      opacity: 0.8,
                      cursor: "pointer",
                      boxShadow: "0 0 8px rgba(0,255,136,0.6)",
                    }}
                    title={`${userCount} user${userCount > 1 ? "s" : ""}`}
                  />
                </Marker>
              );
            })}

          {/* Popup for user details */}
          {popupInfo && (
            <Popup
              longitude={popupInfo.longitude}
              latitude={popupInfo.latitude}
              closeOnClick={false}
              offset={15}
              className="live-users-popup p-4"
              onClose={() => {
                setPopupInfo(null);
                setSelectedUser(null);
                setSelectedUsers([]);
              }}
            >
              <LiveUserDetailsPopup
                user={selectedUser}
                users={selectedUsers}
                mapInstance={mapRef.current?.getMap()!}
                coordinates={{ lng: 0, lat: 0 }}
                websiteId={websiteId}
                onClose={() => {
                  setPopupInfo(null);
                  setSelectedUser(null);
                  setSelectedUsers([]);
                }}
              />
            </Popup>
          )}
        </Map>

        {/* Loading State */}
        {!mapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-white text-lg">Loading globe...</div>
          </div>
        )}

        {/* Zoom Controls */}
        {mapLoaded && (
          <div className="absolute bottom-6 right-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-2">
            <div className="flex flex-col gap-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomIn}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Zoom in"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleZoomOut}
                className="text-white hover:bg-white/10 h-8 w-8"
                title="Zoom out"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleResetView}
                className="text-white hover:bg-white/10 h-8 w-8 text-xs"
                title="Reset view"
              >
                ⟲
              </Button>
            </div>
          </div>
        )}

        {/* Legend */}
        {mapLoaded && (
          <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm border border-white/10 rounded-lg p-4">
            <h3 className="text-white text-sm font-semibold mb-2">
              Live Activity
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Active users</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">
                  Click & drag to rotate
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                <span className="text-gray-300 text-sm">Scroll to zoom</span>
              </div>
              <div className="text-gray-400 text-xs">
                Circle size represents number of users
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
