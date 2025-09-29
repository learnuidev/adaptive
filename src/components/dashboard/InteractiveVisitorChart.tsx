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

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

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
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 glass overflow-hidden">
      <CardContent className="p-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 h-[600px]">
          {/* Left Panel - Location */}
          <div className="bg-card/50 border-r border-border/50 backdrop-blur-sm">
            {/* Location Tabs */}
            <div className="flex border-b border-border/50">
              <div className="flex">
                <Button
                  variant={locationView === "map" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("map")}
                >
                  Map
                </Button>
              </div>
              <div className="w-px bg-border/50 mx-2" />
              <div className="flex">
                <Button
                  variant={locationView === "country" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("country")}
                >
                  Country
                </Button>
                <Button
                  variant={locationView === "region" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("region")}
                >
                  Region
                </Button>
                <Button
                  variant={locationView === "city" ? "secondary" : "ghost"}
                  className="rounded-none h-12 text-sm text-muted-foreground hover:text-foreground"
                  onClick={() => setLocationView("city")}
                >
                  City
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="h-[548px] relative">
              {locationView === "map" ? (
                <div className="h-full bg-muted/10 relative">
                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      scale: 120,
                    }}
                    className="w-full h-full"
                  >
                    <ZoomableGroup>
                      <Geographies geography={geoUrl}>
                        {({ geographies }) =>
                          geographies.map((geo) => {
                            const countryName = geo.properties.NAME;
                            const countryData = locationData?.find(
                              (item) => item.name === countryName
                            );
                            const visitors = countryData ? parseInt(countryData.visitors) : 0;
                            const maxVisitors = locationData?.reduce(
                              (max, item) => Math.max(max, parseInt(item.visitors)), 
                              0
                            ) || 1;
                            const intensity = visitors / maxVisitors;

                            return (
                              <Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={
                                  visitors > 0
                                    ? `hsl(var(--primary) / ${0.2 + intensity * 0.6})`
                                    : "hsl(var(--muted) / 0.3)"
                                }
                                stroke="hsl(var(--border))"
                                strokeWidth={0.5}
                                style={{
                                  default: { outline: "none" },
                                  hover: { 
                                    fill: `hsl(var(--primary) / ${0.4 + intensity * 0.4})`,
                                    outline: "none" 
                                  },
                                  pressed: { outline: "none" },
                                }}
                              />
                            );
                          })
                        }
                      </Geographies>
                    </ZoomableGroup>
                  </ComposableMap>
                  
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded p-3 border border-border/50">
                    <p className="text-xs font-medium text-foreground mb-2">Visitors</p>
                    <div className="flex items-center gap-2 text-xs">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}></div>
                      <span className="text-muted-foreground">No data</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs mt-1">
                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }}></div>
                      <span className="text-muted-foreground">High traffic</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                    {locationData?.slice(0, 8).map((item, index) => (
                      <div
                        key={item.name}
                        className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-lg">
                            {locationView === "country" ? getCountryFlag(item.name) : "📍"}
                          </span>
                          <span className="text-sm font-medium text-foreground">{item.name}</span>
                        </div>
                        <span className="text-sm font-mono text-muted-foreground">
                          {item.visitors}
                        </span>
                      </div>
                    ))}
                    
                    {(!locationData || locationData.length === 0) && (
                      <div className="text-center text-muted-foreground text-sm mt-8">
                        No data available
                      </div>
                    )}
                  </div>
                  
                  {/* Details Button */}
                  <div className="p-4 border-t border-border/50">
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-foreground"
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
          <div className="bg-card/50 backdrop-blur-sm">
            {/* Technology Tabs */}
            <div className="flex border-b border-border/50">
              <div className="flex">
                <Button
                  variant={techView === "browser_name" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm flex-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setTechView("browser_name")}
                >
                  Browser
                </Button>
                <Button
                  variant={techView === "os_name" ? "secondary" : "ghost"}
                  className="rounded-none border-r border-border/50 h-12 text-sm flex-1 text-muted-foreground hover:text-foreground"
                  onClick={() => setTechView("os_name")}
                >
                  OS
                </Button>
              </div>
              <div className="w-px bg-border/50 mx-2" />
              <div className="flex">
                <Button
                  variant="ghost"
                  className="rounded-none h-12 text-sm flex-1 text-muted-foreground/50"
                  disabled
                >
                  Device
                </Button>
              </div>
            </div>

            {/* Technology Content */}
            <div className="h-[548px] flex flex-col">
              <div className="flex-1 p-4 space-y-2 overflow-y-auto">
                {techData?.slice(0, 8).map((item, index) => {
                  const IconComponent = techView === "browser_name" ? getBrowserIcon(item.name) : Smartphone;
                  
                  return (
                    <div
                      key={item.name}
                      className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-1.5 bg-primary/20 rounded">
                          <IconComponent className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm font-medium text-foreground">{item.name}</span>
                      </div>
                      <span className="text-sm font-mono text-muted-foreground">
                        {item.visitors}
                      </span>
                    </div>
                  );
                })}
                
                {(!techData || techData.length === 0) && (
                  <div className="text-center text-muted-foreground text-sm mt-8">
                    No data available
                  </div>
                )}
              </div>
              
              {/* Details Button */}
              <div className="p-4 border-t border-border/50">
                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground hover:text-foreground"
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