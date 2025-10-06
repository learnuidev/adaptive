import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useGetLiveUsersQuery } from "@/modules/analytics/use-get-live-users-query";
import { Button } from "@/components/ui/button";
import { X, Users, Plus, Minus } from "lucide-react";

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

    // Group users by location
    const locationGroups = liveUsersData.liveUsers.reduce((acc: any, user) => {
      if (user.city && user.country) {
        const key = `${user.city}, ${user.country}`;
        if (!acc[key]) {
          acc[key] = {
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

    // Create features for clustered locations
    const features = Object.values(locationGroups).map((location: any) => ({
      type: "Feature",
      properties: {
        name: location.city,
        country: location.country,
        userCount: location.count,
        users: location.users,
      },
      geometry: {
        type: "Point",
        coordinates: [0, 0], // Will be updated with geocoded coordinates
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

      const popup = new mapboxgl.Popup({
        closeButton: true,
        closeOnClick: true,
      }).setHTML(`
        <div class="p-3">
          <h3 class="font-semibold text-white mb-2">${properties.name}, ${properties.country}</h3>
          <p class="text-sm text-gray-300">${properties.userCount} live user${properties.userCount !== 1 ? "s" : ""}</p>
          <div class="mt-2 space-y-1">
            ${properties.users
              .slice(0, 3)
              .map(
                (user: any) => `
              <div class="text-xs text-gray-400">
                ${user.page ? `Viewing: ${user.page}` : "Active user"}
                ${user.duration ? ` • ${Math.floor(user.duration / 60)}m` : ""}
              </div>
            `
              )
              .join("")}
            ${properties.users.length > 3 ? `<div class="text-xs text-gray-500">+${properties.users.length - 3} more...</div>` : ""}
          </div>
        </div>
      `);

      popup.setLngLat(e.lngLat).addTo(mapInstance);
    });

    // Change cursor on hover
    mapInstance.on("mouseenter", "users-layer", () => {
      mapInstance.getCanvas().style.cursor = "pointer";
    });

    mapInstance.on("mouseleave", "users-layer", () => {
      mapInstance.getCanvas().style.cursor = "";
    });

    // Update coordinates for each location (simplified geocoding)
    // In a real implementation, you'd use a proper geocoding service
    const updateCoordinates = async () => {
      const updatedFeatures = await Promise.all(
        Object.values(locationGroups).map(async (location: any) => {
          // Simple coordinate mapping - in production, use proper geocoding
          const coords = getCoordinatesForLocation(
            location.city,
            location.country
          );
          return {
            type: "Feature",
            properties: {
              name: location.city,
              country: location.country,
              userCount: location.count,
              users: location.users,
            },
            geometry: {
              type: "Point",
              coordinates: coords,
            },
          };
        })
      );

      const source = mapInstance.getSource(
        "users-source"
      ) as mapboxgl.GeoJSONSource;
      if (source) {
        source.setData({
          type: "FeatureCollection",
          features: updatedFeatures as any,
        });
      }
    };

    updateCoordinates();
  }, [mapLoaded, liveUsersData]);

  // Simple coordinate lookup - in production, use proper geocoding
  const getCoordinatesForLocation = (
    city: string,
    country: string
  ): [number, number] => {
    // This is a very simplified mapping - you'd want to use a proper geocoding API
    const cityCoordinates: { [key: string]: [number, number] } = {
      "New York": [-74.006, 40.7128],
      London: [-0.1278, 51.5074],
      Tokyo: [139.6503, 35.6762],
      Paris: [2.3522, 48.8566],
      Sydney: [151.2093, -33.8688],
      "San Francisco": [-122.4194, 37.7749],
      "Los Angeles": [-118.2437, 34.0522],
      Chicago: [-87.6298, 41.8781],
      Toronto: [-79.3832, 43.6532],
      Berlin: [13.405, 52.52],
      Mumbai: [72.8777, 19.076],
      Singapore: [103.8198, 1.3521],
      Dubai: [55.2708, 25.2048],
      Seoul: [126.978, 37.5665],
      Moscow: [37.6173, 55.7558],
      "São Paulo": [-46.6333, -23.5505],
      "Mexico City": [-99.1332, 19.4326],
      Cairo: [31.2357, 30.0444],
      Bangkok: [100.5018, 13.7563],
      Jakarta: [106.8456, -6.2088],
    };

    return cityCoordinates[city] || [0, 0];
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
        <div
          ref={mapContainer}
          className="w-full h-full"
          style={{ paddingTop: "73px" }}
        />

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
                <span className="text-gray-300 text-sm">Click & drag to rotate</span>
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
