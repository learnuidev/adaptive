import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGetLiveUsersQuery } from "@/modules/analytics/use-get-live-users-query";
import { Button } from "@/components/ui/button";
import { X, Users, Plus, Minus } from "lucide-react";
import { LiveUserDetailsPopup } from "./live-user-details-popup";

interface LiveUsersGlobeProps {
  websiteId: string;
  isOpen: boolean;
  onClose: () => void;
}

const mapboxApiKey = import.meta.env.VITE_MAPBOX_API_KEY;

export function LiveUsersGlobe({
  websiteId,
  isOpen,
  onClose,
}: LiveUsersGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
  const [popupCoordinates, setPopupCoordinates] = useState<{ lng: number; lat: number } | null>(null);
  const popupRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => {
    if (map.current) {
      map.current.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map.current) {
      map.current.zoomOut();
    }
  };

  const handleResetView = () => {
    if (map.current) {
      map.current.flyTo({
        center: [0, 0],
        zoom: 1.5,
        pitch: 0,
        bearing: 0,
        duration: 1000,
      });
    }
  };

  console.log("API KEY", mapboxApiKey);

  const { data: liveUsersData } = useGetLiveUsersQuery({
    websiteId,
    timeWindowMinutes: 30,
    includeSummary: false,
    includeGeography: true,
    limit: 1000,
    enabled: isOpen && !!websiteId,
  });

  console.log("live users", liveUsersData);

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxApiKey;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe", // This creates the 3D globe effect
      center: [0, 0],
      zoom: 1.5,
      pitch: 0,
      bearing: 0,
      interactive: true, // Enable all default interactions
      dragPan: true,
      dragRotate: true,
      scrollZoom: true, // Enable scroll wheel zoom
      minZoom: 0.5, // Allow zooming out further
      maxZoom: 8, // Limit zoom in for globe perspective
    });

    mapInstance.on("load", () => {
      setMapLoaded(true);

      // Add atmosphere effect
      mapInstance.setFog({
        "horizon-blend": 0.1,
        color: "#242B4B",
        "high-color": "#161B3D",
        "space-color": "#0B0E1F",
        "star-intensity": 0.15,
      });

      // No auto-rotation - user controls everything manually

      // No cleanup needed for rotation interval
    });

    map.current = mapInstance;

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (!map.current || !mapLoaded || !liveUsersData) return;

    const mapInstance = map.current;

    // Remove existing layers and sources if they exist
    if (mapInstance.getLayer("users-layer")) {
      mapInstance.removeLayer("users-layer");
    }
    if (mapInstance.getSource("users-source")) {
      mapInstance.removeSource("users-source");
    }

    // Group users by exact coordinates for clustering nearby users
    const locationGroups = liveUsersData.liveUsers.reduce((acc: any, user) => {
      if (user.latitude && user.longitude) {
        // Round coordinates to 2 decimal places to cluster nearby users
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
      }
      return acc;
    }, {});

    // Create features for clustered locations with actual coordinates
    const features = Object.values(locationGroups).map((location: any) => ({
      type: "Feature",
      properties: {
        name: location.city || "Unknown Location",
        country: location.country || "Unknown",
        userCount: location.count,
        users: location.users,
      },
      geometry: {
        type: "Point",
        coordinates: [location.longitude, location.latitude], // [longitude, latitude] for GeoJSON
      },
    }));

    // Add source for user locations
    mapInstance.addSource("users-source", {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: features as any,
      },
    });

    // Add layer for user locations
    mapInstance.addLayer({
      id: "users-layer",
      type: "circle",
      source: "users-source",
      paint: {
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "userCount"],
          1,
          5,
          10,
          15,
          50,
          25,
        ],
        "circle-color": "#00ff88",
        "circle-opacity": 0.8,
        "circle-stroke-color": "#ffffff",
        "circle-stroke-width": 2,
      },
    });

    // Add popups for user locations
    mapInstance.on("click", "users-layer", (e) => {
      if (!e.features || e.features.length === 0) return;

      const feature = e.features[0];
      const properties = feature.properties;

      // Show user details for the first user in the cluster
      const firstUser = properties.users[0];
      if (firstUser) {
        setSelectedUser(firstUser);
        setSelectedUsers(properties.users);
        setPopupCoordinates({ 
          lng: e.lngLat.lng, 
          lat: e.lngLat.lat 
        });
      }
    });

    // Change cursor on hover
    mapInstance.on("mouseenter", "users-layer", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });

    mapInstance.on("mouseleave", "users-layer", () => {
      mapInstance.getCanvas().style.cursor = "";
    });

    // No need for geocoding since we have actual coordinates
  }, [mapLoaded, liveUsersData]);

  // Update popup position when map moves
  useEffect(() => {
    if (!map.current || !popupRef.current || !popupCoordinates) return;

    const mapInstance = map.current;
    
    const updatePopupPosition = () => {
      if (popupRef.current && popupCoordinates) {
        const pixel = mapInstance.project([popupCoordinates.lng, popupCoordinates.lat]);
        popupRef.current.style.left = `${pixel.x}px`;
        popupRef.current.style.top = `${pixel.y}px`;
      }
    };

    mapInstance.on('move', updatePopupPosition);
    mapInstance.on('zoom', updatePopupPosition);

    return () => {
      mapInstance.off('move', updatePopupPosition);
      mapInstance.off('zoom', updatePopupPosition);
    };
  }, [mapLoaded, popupCoordinates]);

  

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
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ paddingTop: "73px" }}
        />

        {/* Custom Popup Container */}
        {selectedUser && popupCoordinates && map.current && (
          <div
            ref={popupRef}
            className="absolute z-20"
            style={{
              left: `${map.current.project([popupCoordinates.lng, popupCoordinates.lat]).x}px`,
              top: `${map.current.project([popupCoordinates.lng, popupCoordinates.lat]).y}px`,
              transform: 'translate(-50%, -100%)'
            }}
          >
            <LiveUserDetailsPopup
              user={selectedUser}
              users={selectedUsers}
              mapInstance={map.current}
              coordinates={popupCoordinates}
              websiteId={websiteId}
              onClose={() => {
                setSelectedUser(null);
                setSelectedUsers([]);
                setPopupCoordinates(null);
              }}
            />
          </div>
        )}

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
