import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
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

export function LiveUsersGlobe({
  websiteId,
  isOpen,
  onClose,
}: LiveUsersGlobeProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [selectedUser, setSelectedUser] = useState<LiveUser | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<LiveUser[]>([]);
  const popupRef = useRef<mapboxgl.Popup | null>(null);
  const contentRef = useRef(document.createElement("div"));

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

  const { data: liveUsersData } = useGetLiveUsersQuery({
    websiteId,
    timeWindowMinutes: 30,
    includeSummary: false,
    includeGeography: true,
    limit: 1000,
    enabled: isOpen && !!websiteId,
  });

  console.log("live users raw data", liveUsersData);
  console.log("live users data exists:", !!liveUsersData);
  console.log("live users array:", liveUsersData?.liveUsers);
  console.log(
    "Should process data:",
    isOpen && !!websiteId && mapLoaded && !!liveUsersData
  );

  useEffect(() => {
    if (!isOpen || !mapContainer.current) return;

    mapboxgl.accessToken = mapboxApiKey;

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      projection: "globe", // This creates the 3D globe effect
      center: [0, 0],
      zoom: 2,
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

      console.log("Map loaded");
    });

    map.current = mapInstance;

    return () => {
      if (popupRef.current) {
        popupRef.current.remove();
        popupRef.current = null;
      }
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [isOpen]);

  // Simple test effect to verify effects are working
  useEffect(() => {
    console.log("EFFECT SYSTEM WORKING - Component rendered");
  });

  // Separate effect to debug when dependencies change
  useEffect(() => {
    console.log(
      "DEPENDENCY CHANGE - mapLoaded:",
      mapLoaded,
      "liveUsersData:",
      !!liveUsersData
    );
  }, [mapLoaded, liveUsersData]);

  useEffect(() => {
    console.log("=== LIVE USERS EFFECT TRIGGERED ===");
    console.log("Processing live users data effect:", {
      mapExists: !!map.current,
      mapLoaded,
      liveUsersDataExists: !!liveUsersData,
      liveUsersData,
      liveUsersArray: liveUsersData?.liveUsers,
    });

    if (!map.current || !mapLoaded || !liveUsersData) {
      console.log("Early return from effect - missing dependencies", {
        mapExists: !!map.current,
        mapLoaded,
        liveUsersDataExists: !!liveUsersData,
      });
      return;
    }

    console.log("Continuing with live users data processing...");
    const mapInstance = map.current;

    // Remove existing layers and sources if they exist
    if (mapInstance.getLayer("users-layer")) {
      mapInstance.removeLayer("users-layer");
    }
    if (mapInstance.getSource("users-source")) {
      mapInstance.removeSource("users-source");
    }

    console.log("Processing live users data:", liveUsersData);
    console.log("Number of live users:", liveUsersData?.liveUsers?.length);

    // Group users by exact coordinates for clustering nearby users
    const locationGroups = liveUsersData.liveUsers.reduce(
      (
        acc: Record<
          string,
          {
            latitude: number;
            longitude: number;
            city?: string;
            country?: string;
            users: LiveUser[];
            count: number;
          }
        >,
        user: LiveUser
      ) => {
        // Group by coordinates if available, otherwise group by city/country
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
        } else if (user.city && user.country) {
          // Fallback to city/country grouping for users without coordinates
          const key = `${user.city},${user.country}`;

          if (!acc[key]) {
            acc[key] = {
              latitude: 0, // Will be set to 0,0 for users without exact coordinates
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

    console.log("Location groups:", locationGroups);

    // Create features for clustered locations with actual coordinates
    const features = Object.values(locationGroups).map((location) => {
      console.log("Creating feature for location:", location);

      // Check if coordinates are valid
      if (location.latitude === 0 && location.longitude === 0) {
        console.warn("Invalid coordinates (0,0) for location:", location);
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
          coordinates: [location.longitude, location.latitude], // [longitude, latitude] for GeoJSON
        },
      };
    });

    console.log("Created features:", features);
    console.log("Features length:", features.length);

    // Filter out features with invalid coordinates (0,0)
    const validFeatures = features.filter((feature) => {
      const [lng, lat] = feature.geometry.coordinates;
      const isValid = lng !== 0 || lat !== 0;
      if (!isValid) {
        console.warn(
          "Filtering out feature with invalid coordinates:",
          feature
        );
      }
      return isValid;
    });

    console.log("Valid features:", validFeatures);
    console.log("Valid features length:", validFeatures.length);

    // Wait for style to be loaded before adding layers
    const addLayers = () => {
      if (!mapInstance.isStyleLoaded()) {
        console.log("Style not loaded yet, waiting...");
        setTimeout(addLayers, 100);
        return;
      }

      console.log("Style loaded, adding layers...");

      // Add source for user locations
      mapInstance.addSource("users-source", {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: validFeatures as GeoJSON.Feature[],
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
            8,
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

      // Initialize Mapbox popup after layer is created
      popupRef.current = new mapboxgl.Popup({
        closeOnClick: false,
        offset: 15,
        className: "live-users-popup",
      });
      console.log("Popup initialized after layer creation:", popupRef.current);

      // Add popups for user locations
      console.log("Attaching click event to users-layer...");
      mapInstance.on("click", "users-layer", (e) => {
        console.log("Click event on users-layer:", e);

        if (!e.features || e.features.length === 0) {
          console.log("No features found");
          return;
        }

        const feature = e.features[0] as GeoJSON.Feature;
        const properties = feature.properties as {
          name: string;
          country: string;
          userCount: number;
          users: LiveUser[];
        };

        console.log("Feature properties:", properties);

        // Show user details for the first user in the cluster
        const firstUser = properties.users[0];
        console.log("PROPS");
        if (firstUser) {
          console.log("Setting selected user:", firstUser);
          setSelectedUser(firstUser);
          setSelectedUsers(properties.users);

          // Create a simple test popup first
          const testContent = document.createElement("div");
          testContent.innerHTML = `
            <div style="padding: 10px; background: white; border-radius: 8px; border: 1px solid #ccc;">
              <h3 style="margin: 0 0 10px 0;">${firstUser.email || "Anonymous User"}</h3>
              <p style="margin: 0;">Location: ${properties.name}, ${properties.country}</p>
              <p style="margin: 5px 0 0 0;">Users at location: ${properties.userCount}</p>
            </div>
          `;

          console.log("Adding test popup with coordinates:", [
            e.lngLat.lng,
            e.lngLat.lat,
          ]);
          popupRef
            .current!.setLngLat([e.lngLat.lng, e.lngLat.lat])
            .setDOMContent(testContent)
            .addTo(mapInstance);
        } else {
          console.log("No users found in properties");
        }
      });

      // Change cursor on hover
      mapInstance.on("mouseenter", "users-layer", () => {
        mapInstance.getCanvas().style.cursor = "pointer";
      });

      mapInstance.on("mouseleave", "users-layer", () => {
        mapInstance.getCanvas().style.cursor = "";
      });

      // Add a general click handler to debug what's happening
      mapInstance.on("click", (e) => {
        const features = mapInstance.queryRenderedFeatures(e.point, {
          layers: ["users-layer"],
        });

        console.log("General map click:", e);
        console.log("Features at click point:", features);
        console.log(
          "All layers at point:",
          mapInstance.queryRenderedFeatures(e.point)
        );
      });
    };

    addLayers();

    // No need for geocoding since we have actual coordinates
  }, [mapLoaded, liveUsersData, JSON.stringify(liveUsersData)]);

  // Close popup when clicking on the map (outside of user locations)
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    const mapInstance = map.current;

    const handleMapClick = () => {
      if (popupRef.current) {
        popupRef.current.remove();
        setSelectedUser(null);
        setSelectedUsers([]);
      }
    };

    mapInstance.on("click", handleMapClick);

    return () => {
      mapInstance.off("click", handleMapClick);
    };
  }, [mapLoaded]);

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

        {/* Mapbox Popup Portal - Temporarily disabled for testing */}
        {selectedUser && (
          <>
            {createPortal(
              <LiveUserDetailsPopup
                user={selectedUser}
                users={selectedUsers}
                mapInstance={map.current!}
                coordinates={{ lng: 0, lat: 0 }} // Not needed for Mapbox popup
                websiteId={websiteId}
                onClose={() => {
                  if (popupRef.current) {
                    popupRef.current.remove();
                  }
                  setSelectedUser(null);
                  setSelectedUsers([]);
                }}
              />,
              contentRef.current
            )}
          </>
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
