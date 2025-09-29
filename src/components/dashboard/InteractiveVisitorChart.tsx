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
                <div className="h-full bg-muted/10">
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
                                fill={countryData ? "hsl(var(--primary))" : "hsl(var(--muted))"}
                                stroke="hsl(var(--border))"
                                strokeWidth={0.5}
                                style={{
                                  default: {
                                    outline: "none",
                                  },
                                  hover: {
                                    fill: "hsl(var(--primary-glow))",
                                    outline: "none",
                                  },
                                  pressed: {
                                    fill: "hsl(var(--primary))",
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