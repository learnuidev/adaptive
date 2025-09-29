import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import {
  DetailsButton,
  LocationList,
  MapLegend,
  TabContent,
} from "./interactive-visitor-chart.components";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function LocationPanel({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<
    "map" | "country" | "region" | "city"
  >("map");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView === "map" ? "country" : locationView,
  });

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

        <TabContent value="map">
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
            <MapLegend />
          </div>
        </TabContent>

        <TabContent value="country">
          <div className="min-h-[420px]">
            <LocationList data={locationData} />
          </div>
          <DetailsButton />
        </TabContent>

        <TabContent value="region">
          <div className="min-h-[420px]">
            <LocationList data={locationData} icon="📍" />
          </div>
          <DetailsButton />
        </TabContent>

        <TabContent value="city">
          <div className="min-h-[420px]">
            <LocationList data={locationData} icon="📍" />
          </div>
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
