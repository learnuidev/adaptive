import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LocationView,
  useGetTotalVisitorsByQuery,
} from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

import {
  AnalyticsDetailsDialog,
  DetailsButton,
  MapLegend,
  TabContent,
  VisitorsBarChart,
  formatVisitorsValue,
  getLocationDisplayName,
  getLocationIcon,
} from "./interactive-visitor-chart.components";
import { flags } from "@/lib/flags";
import { countryNames } from "@/lib/country-names";
import type { VisitorsBarDatum } from "./interactive-visitor-chart.components";

// const geoUrl = "/world.json";
const geoUrl =
  "https://nomadmethod-api-dev-assetsbucket-2u2iqsv5nizc.s3.amazonaws.com/01K6R1ZYAFM3E05H0C8GEXF0PV.json";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function LocationPanel({ credentialId }: InteractiveVisitorChartProps) {
  const [locationView, setLocationView] = useState<LocationView>("map");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsSearch, setDetailsSearch] = useState("");
  const [locationSortDirection, setLocationSortDirection] = useState<
    "asc" | "desc"
  >("desc");
  const [hoveredCountry, setHoveredCountry] = useState<{
    name: string;
    iso: string;
    visitors: number;
    x: number;
    y: number;
  } | null>(null);
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: locationData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: locationView === "map" ? "country" : locationView,
  });

  console.log("LOCATION DATA", locationData);

  const activeLocationView = locationView === "map" ? "country" : locationView;

  useEffect(() => {
    if (!isDetailsOpen) {
      setDetailsSearch("");
    }
  }, [isDetailsOpen]);

  useEffect(() => {
    if (locationView === "map") {
      setIsDetailsOpen(false);
    }
    setDetailsSearch("");
  }, [locationView]);

  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (hoveredCountry) {
        setHoveredCountry((prev) =>
          prev
            ? {
                ...prev,
                x: event.clientX - 300,
                y: event.clientY - 300,
              }
            : null
        );
      }
    };

    if (hoveredCountry) {
      document.addEventListener("mousemove", handleGlobalMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
    };
  }, [hoveredCountry]);

  const orderedLocationDetails = useMemo(() => {
    const entries = Array.isArray(locationData) ? locationData : [];

    const mapped = entries
      .map((item, index) => {
        const visitorsValue = Number.parseInt(item?.visitors ?? "0", 10);
        const numericVisitors = Number.isNaN(visitorsValue) ? 0 : visitorsValue;
        const rawName = item?.name ?? `location-${index}`;
        const displayName =
          getLocationDisplayName(rawName, activeLocationView) ||
          rawName ||
          "Unknown";
        const iconNode = getLocationIcon(rawName || "", activeLocationView);
        const icon = typeof iconNode === "string" ? iconNode : "";
        return {
          id: rawName || `location-${index}`,
          rawName,
          displayName,
          icon,
          value: numericVisitors,
        };
      })
      .sort((a, b) => b.value - a.value);

    return locationSortDirection === "asc" ? [...mapped].reverse() : mapped;
  }, [locationData, locationSortDirection, activeLocationView]);

  const filteredLocationDetails = useMemo(() => {
    const query = detailsSearch.trim().toLowerCase();

    if (!query) {
      return orderedLocationDetails;
    }

    return orderedLocationDetails.filter((item) => {
      return (
        item.displayName.toLowerCase().includes(query) ||
        item.rawName.toLowerCase().includes(query)
      );
    });
  }, [detailsSearch, orderedLocationDetails]);

  const totalLocationCount = orderedLocationDetails.length;
  const filteredLocationCount = filteredLocationDetails.length;

  const locationEntityLabel =
    activeLocationView === "country"
      ? "countries"
      : activeLocationView === "region"
        ? "regions"
        : "cities";

  const locationChartData = useMemo<VisitorsBarDatum[]>(
    () =>
      orderedLocationDetails.slice(0, 5).map((item) => ({
        id: item.id,
        label: item.displayName,
        value: item.value,
        labelPrefix: item.icon,
        labelDescription:
          item.rawName && item.rawName !== item.displayName
            ? item.rawName
            : undefined,
        secondaryLabel:
          item.rawName && item.rawName !== item.displayName
            ? item.rawName
            : undefined,
      })),
    [orderedLocationDetails]
  );

  const locationChartEmptyState = `No ${locationEntityLabel} data available`;

  const handleOpenDetails = useCallback(() => {
    if (locationView === "map") {
      return;
    }
    setDetailsSearch("");
    setIsDetailsOpen(true);
  }, [locationView]);

  const handleLocationSortToggle = useCallback(() => {
    setLocationSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const locationChartTooltip = useCallback((datum: VisitorsBarDatum) => {
    const primary = [datum.labelPrefix, datum.label]
      .filter(Boolean)
      .join(" ")
      .trim();
    const secondary = datum.labelDescription || datum.secondaryLabel;

    return (
      <div className="rounded-md border border-border/60 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
        <p className="text-sm font-semibold">{primary || datum.label}</p>
        {secondary ? (
          <p className="text-xs text-muted-foreground">{secondary}</p>
        ) : null}
        <p className="text-xs text-muted-foreground">
          {formatVisitorsValue(datum.value)} visitors
        </p>
      </div>
    );
  }, []);

  const renderLocationChartSection = useCallback(
    (title: string) => (
      <div className="min-h-[420px]">
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            <button
              type="button"
              onClick={handleLocationSortToggle}
              className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Sort visitors ${locationSortDirection === "desc" ? "ascending" : "descending"}`}
              title="Toggle visitor sort order"
            >
              <span>Visitors</span>
              <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
                <span
                  className={
                    locationSortDirection === "asc"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  ↑
                </span>
                <span
                  className={
                    locationSortDirection === "desc"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  ↓
                </span>
              </span>
            </button>
          </div>
        </div>
        <div className="h-[360px] p-4">
          <VisitorsBarChart
            data={locationChartData}
            tooltipRenderer={locationChartTooltip}
            emptyState={locationChartEmptyState}
          />
        </div>
      </div>
    ),
    [
      handleLocationSortToggle,
      locationChartData,
      locationChartEmptyState,
      locationChartTooltip,
      locationSortDirection,
    ]
  );

  const locationDetailsHeader = (
    <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span>Rank</span>
      <span>
        {activeLocationView === "country"
          ? "Country"
          : activeLocationView === "region"
            ? "Region"
            : "City"}
      </span>
      <button
        type="button"
        onClick={handleLocationSortToggle}
        className="flex items-center justify-end gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`Sort visitors ${locationSortDirection === "desc" ? "ascending" : "descending"}`}
      >
        <span>Visitors</span>
        <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
          <span
            className={
              locationSortDirection === "asc"
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            ↑
          </span>
          <span
            className={
              locationSortDirection === "desc"
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            ↓
          </span>
        </span>
      </button>
    </div>
  );

  const locationDetailsContent = filteredLocationDetails.length ? (
    <div className="divide-y divide-border/40">
      {filteredLocationDetails.map((item, index) => {
        const secondary =
          item.rawName !== item.displayName ? item.rawName : undefined;
        return (
          <div
            key={`${item.id}-${index}`}
            className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3"
          >
            <span className="w-10 shrink-0 text-xs font-mono text-muted-foreground">
              #{index + 1}
            </span>
            <div className="flex min-w-0 items-center gap-3">
              {item.icon ? (
                <span className="text-lg" aria-hidden="true">
                  {item.icon}
                </span>
              ) : null}
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  {item.displayName}
                </p>
                {secondary ? (
                  <p className="truncate text-xs text-muted-foreground">
                    {secondary}
                  </p>
                ) : null}
              </div>
            </div>
            <span className="text-right text-xs font-semibold text-muted-foreground">
              {formatVisitorsValue(item.value)}
            </span>
          </div>
        );
      })}
    </div>
  ) : (
    <div className="flex h-40 items-center justify-center px-4 text-sm text-muted-foreground">
      No {locationEntityLabel} found.
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs
        value={locationView}
        onValueChange={(value) => setLocationView(value as LocationView)}
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
                  {({ geographies }) => {
                    console.log("GEOS", geographies);
                    return geographies.map((geo) => {
                      const countryName = geo.properties.NAME;
                      const countryNameISO = geo.properties.ISO_A2;
                      const countryData = locationData?.find(
                        (item) => item.name === countryNameISO
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
                          onClick={() => {
                            alert("yoo");
                          }}
                          geography={geo}
                          onMouseEnter={(event) => {
                            setHoveredCountry({
                              name: countryName,
                              iso: countryNameISO,
                              visitors,
                              x: event.clientX,
                              y: event.clientY,
                            });
                          }}
                          onMouseMove={(event) => {
                            setHoveredCountry((prev) =>
                              prev && prev.name === countryName
                                ? {
                                    ...prev,
                                    x: event.clientX,
                                    y: event.clientY,
                                  }
                                : null
                            );
                          }}
                          onMouseLeave={() => {
                            setHoveredCountry(null);
                          }}
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
                    });
                  }}
                </Geographies>
              </ZoomableGroup>
            </ComposableMap>
            <MapLegend />
            {hoveredCountry && (
              <div
                className="fixed z-50 pointer-events-none rounded-lg border border-border/60 bg-background/95 px-4 py-3 shadow-lg backdrop-blur"
                style={{
                  left: hoveredCountry.x + 8,
                  top: hoveredCountry.y + 8,
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">
                    {flags[hoveredCountry.iso] || "🌍"}
                  </span>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-foreground text-sm">
                        {hoveredCountry.name}
                      </p>
                      <span className="text-xs text-muted-foreground">
                        ({hoveredCountry.iso})
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <span>👥</span>
                      <span>
                        {formatVisitorsValue(hoveredCountry.visitors)} visitors
                      </span>
                    </div>
                    {countryNames[hoveredCountry.iso] &&
                      countryNames[hoveredCountry.iso] !==
                        hoveredCountry.name && (
                        <div className="text-xs text-muted-foreground italic">
                          {countryNames[hoveredCountry.iso]}
                        </div>
                      )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabContent>

        <TabContent value="country">
          {renderLocationChartSection("Country")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>

        <TabContent value="region">
          {renderLocationChartSection("Region")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>

        <TabContent value="city">
          {renderLocationChartSection("City")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>
      </Tabs>
      <AnalyticsDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={`All ${locationEntityLabel}`}
        description={`Review every ${locationEntityLabel} contributing visitors for this period.`}
        searchPlaceholder={`Search ${locationEntityLabel}...`}
        searchValue={detailsSearch}
        onSearchChange={setDetailsSearch}
        totalCount={totalLocationCount}
        filteredCount={filteredLocationCount}
        entityLabel={locationEntityLabel}
        header={locationDetailsHeader}
      >
        {locationDetailsContent}
      </AnalyticsDetailsDialog>
    </Card>
  );
}
