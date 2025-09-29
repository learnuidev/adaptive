import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { flags } from "@/lib/flags";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { Chrome, ExpandIcon, Monitor } from "lucide-react";
import { useState } from "react";
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

export function LocationPanel({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<
    "map" | "country" | "region" | "city"
  >("map");
  const [techView, setTechView] = useState<"browser_name" | "os_name">(
    "browser_name"
  );
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

  console.log("techData", techData);

  const getBrowserIcon = (name: string) => {
    if (name?.toLowerCase().includes("chrome")) return Chrome;
    return Monitor;
  };

  const getCountryFlag = (countryName: string) => {
    return flags[countryName] || "🌍";
  };

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs
        value={locationView}
        onValueChange={(v) => setLocationView(v as any)}
      >
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="map"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Map
          </TabsTrigger>
          <TabsTrigger
            value="country"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Country
          </TabsTrigger>
          <TabsTrigger
            value="region"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Region
          </TabsTrigger>
          <TabsTrigger
            value="city"
            className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            City
          </TabsTrigger>
        </TabsList>

        {/* Content Area */}
        <TabsContent value="map" className="mt-0 relative">
          <div className="bg-muted/10 relative">
            <ComposableMap
              projection="geoMercator"
              projectionConfig={{ scale: 120 }}
              className="w-full"
            >
              <ZoomableGroup>
                <Geographies geography={geoUrl}>
                  {({ geographies }) =>
                    geographies.map((geo) => {
                      const countryName = geo.properties.NAME;
                      const countryData = locationData?.find(
                        (item) => item.name === countryName
                      );
                      const visitors = countryData
                        ? parseInt(countryData.visitors)
                        : 0;
                      const maxVisitors =
                        locationData?.reduce(
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
                              outline: "none",
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
              <p className="text-xs font-medium text-foreground mb-2">
                Visitors
              </p>
              <div className="flex items-center gap-2 text-xs">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: "hsl(var(--muted) / 0.3)" }}
                ></div>
                <span className="text-muted-foreground">No data</span>
              </div>
              <div className="flex items-center gap-2 text-xs mt-1">
                <div
                  className="w-3 h-3 rounded"
                  style={{ backgroundColor: "hsl(var(--primary) / 0.8)" }}
                ></div>
                <span className="text-muted-foreground">High traffic</span>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="country" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {locationData?.slice(0, 8).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{getCountryFlag(item.name)}</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
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
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <ExpandIcon className="w-4 h-4 mr-2" />
              <span className="uppercase">Details</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="region" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {locationData?.slice(0, 8).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
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
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <ExpandIcon className="w-4 h-4 mr-2" />
              <span className="uppercase">Details</span>
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="city" className="mt-0 flex flex-col">
          <div className="flex-1 p-4 space-y-2 overflow-y-auto">
            {locationData?.slice(0, 8).map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between p-3 bg-card/80 backdrop-blur-sm rounded hover:bg-card/90 transition-colors border border-border/30"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">📍</span>
                  <span className="text-sm font-medium text-foreground">
                    {item.name}
                  </span>
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
          <div className="p-4 border-t border-border/50">
            <Button
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
              size="sm"
            >
              <ExpandIcon className="w-4 h-4 mr-2" />
              <span className="uppercase">Details</span>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}
