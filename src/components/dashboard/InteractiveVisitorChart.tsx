import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Chrome, Monitor, Smartphone, RefreshCw } from "lucide-react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

export function InteractiveVisitorChart({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<"map" | "country" | "region" | "city">("map");
  const [techView, setTechView] = useState<"browser_name" | "os_name">("browser_name");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView === "map" ? "country" : locationView,
  });

  const { data: techData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: techView,
  });

  const getBrowserIcon = (name: string) => {
    if (name?.toLowerCase().includes("chrome")) return Chrome;
    return Monitor;
  };

  const getCountryFlag = (countryName: string) => {
    const flags: Record<string, string> = {
      "Canada": "🇨🇦",
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      "Germany": "🇩🇪",
      "France": "🇫🇷",
      "Japan": "🇯🇵",
      "Australia": "🇦🇺",
      "Brazil": "🇧🇷",
      "India": "🇮🇳",
      "China": "🇨🇳",
    };
    return flags[countryName] || "🌍";
  };

  return (
    <Card className="bg-slate-800 border-slate-700 overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
          {/* Left Panel - Location */}
          <div className="bg-slate-800 border-r border-slate-700">
            {/* Location Tabs */}
            <div className="flex border-b border-slate-700">
              <Button
                variant={locationView === "map" ? "secondary" : "ghost"}
                className="rounded-none border-r border-slate-700 h-12 text-sm text-slate-300 hover:text-white"
                onClick={() => setLocationView("map")}
              >
                Map
              </Button>
              <Button
                variant={locationView === "country" ? "secondary" : "ghost"}
                className="rounded-none border-r border-slate-700 h-12 text-sm text-slate-300 hover:text-white"
                onClick={() => setLocationView("country")}
              >
                Country
              </Button>
              <Button
                variant={locationView === "region" ? "secondary" : "ghost"}
                className="rounded-none border-r border-slate-700 h-12 text-sm text-slate-300 hover:text-white"
                onClick={() => setLocationView("region")}
              >
                Region
              </Button>
              <Button
                variant={locationView === "city" ? "secondary" : "ghost"}
                className="rounded-none h-12 text-sm text-slate-300 hover:text-white"
                onClick={() => setLocationView("city")}
              >
                City
              </Button>
            </div>

            {/* Content Area */}
            <div className="h-[548px] relative">
              {locationView === "map" ? (
                <div className="h-full bg-slate-900">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 100,
                      center: [0, 20],
                    }}
                    width={400}
                    height={548}
                    className="w-full h-full"
                  >
                    <ZoomableGroup>
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const countryData = locationData?.find(
                              (d) => d.name === geo.properties.NAME
                            );
                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={countryData ? "#3b82f6" : "#374151"}
                                stroke="#6b7280"
                                strokeWidth={0.5}
                                style={{
                                  default: {
                                    outline: "none",
                                  },
                                  hover: {
                                    fill: "#60a5fa",
                                    outline: "none",
                                  },
                                  pressed: {
                                    fill: "#2563eb",
                                    outline: "none",
                                  },
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {locationData?.slice(0, 8).map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {locationView === "country" ? getCountryFlag(item.name) : "📍"}
                          </span>
                          <span className="text-sm font-medium text-white">{item.name}</span>
                        </div>
                        <span className="text-sm font-mono text-slate-300">
                          {item.visitors}
                        </span>
                      </div>
                    ))}
                    
                    {(!locationData || locationData.length === 0) && (
                      <div className="text-center text-slate-400 text-sm mt-8">
                        No data available
                      </div>
                    )}
                  </div>
                  
                  {/* Details Button */}
                  <div className="p-4 border-t border-slate-700">
                    <Button
                      variant="ghost"
                      className="w-full text-slate-400 hover:text-white"
                      size="sm"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      DETAILS
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel - Technology */}
          <div className="bg-slate-800">
            {/* Technology Tabs */}
            <div className="flex border-b border-slate-700">
              <Button
                variant={techView === "browser_name" ? "secondary" : "ghost"}
                className="rounded-none border-r border-slate-700 h-12 text-sm flex-1 text-slate-300 hover:text-white"
                onClick={() => setTechView("browser_name")}
              >
                Browser
              </Button>
              <Button
                variant={techView === "os_name" ? "secondary" : "ghost"}
                className="rounded-none border-r border-slate-700 h-12 text-sm flex-1 text-slate-300 hover:text-white"
                onClick={() => setTechView("os_name")}
              >
                OS
              </Button>
              <Button
                variant="ghost"
                className="rounded-none h-12 text-sm flex-1 text-slate-500"
                disabled
              >
                Device
              </Button>
            </div>

            {/* Technology Content */}
            <div className="h-[548px] flex flex-col">
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {techData?.slice(0, 8).map((item, index) => {
                  const IconComponent = techView === "browser_name" ? getBrowserIcon(item.name) : Smartphone;
                  
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-blue-500/20 rounded">
                          <IconComponent className="w-4 h-4 text-blue-400" />
                        </div>
                        <span className="text-sm font-medium text-white">{item.name}</span>
                      </div>
                      <span className="text-sm font-mono text-slate-300">
                        {item.visitors}
                      </span>
                    </div>
                  );
                })}
                
                {(!techData || techData.length === 0) && (
                  <div className="text-center text-slate-400 text-sm mt-8">
                    No data available
                  </div>
                )}
              </div>
              
              {/* Details Button */}
              <div className="p-4 border-t border-slate-700">
                <Button
                  variant="ghost"
                  className="w-full text-slate-400 hover:text-white"
                  size="sm"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  DETAILS
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}