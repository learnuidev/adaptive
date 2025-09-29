import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LocationView,
  useGetTotalVisitorsByQuery,
} from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useMemo, useState } from "react";
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
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useParams } from "@tanstack/react-router";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@3/countries-110m.json";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function PageAndFeaturePanel({
  credentialId,
}: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<LocationView>("map");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView === "map" ? "country" : locationView,
  });

  const params = useParams({ strict: false }) as { credentialId?: string };
  // const credentialId = params?.credentialId;

  const { data: summary } = useGetSummaryQuery({
    websiteId: credentialId,
    period: selectedPeriod,
  });

  const currentPageVisitsPerPage = useMemo(
    () =>
      (summary?.pageVisitsPerPage.current || [])
        ?.sort(
          (a, b) =>
            parseInt(b?.total || b?.visits || "0" || "0") -
            parseInt(a?.total || a?.visits || "0" || "0")
        )
        .slice(0, 3)
        ?.map((page) => {
          return {
            name: page?.patternHref || page?.href || "",
            value: parseInt(page?.total || page?.visits || "0" || "0"),
          };
        }),
    [summary?.pageVisitsPerPage.current]
  );

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs
        value={locationView}
        onValueChange={(v) => setLocationView(v as any)}
      >
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="page"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Page
          </TabsTrigger>
          <TabsTrigger
            value="city"
            className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Feature
          </TabsTrigger>
        </TabsList>

        <TabContent value="page">
          <div className="min-h-[420px]">
            <LocationList
              data={locationData}
              icon="📍"
              locationView={locationView}
            />
          </div>
          <DetailsButton />
        </TabContent>

        <TabContent value="feature">
          <div className="min-h-[420px]">
            <LocationList
              data={locationData}
              icon="📍"
              locationView={locationView}
            />
          </div>
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
