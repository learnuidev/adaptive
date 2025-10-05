import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useGetTotalVisitorsByQuery } from "@/modules/analytics/use-get-total-visitors-by";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  AnalyticsDetailsDialog,
  DetailsButton,
  TabContent,
  VisitorsBarChart,
  formatVisitorsValue,
} from "./interactive-visitor-chart.components";
import type { VisitorsBarDatum } from "./interactive-visitor-chart.components";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function TechPanel({ credentialId }: InteractiveVisitorChartProps) {
  const [techView, setTechView] = useState<
    "browser_name" | "os_name" | "device"
  >("browser_name");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsSearch, setDetailsSearch] = useState("");
  const [techSortDirection, setTechSortDirection] = useState<"asc" | "desc">("desc");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: techData } = useGetTotalVisitorsByQuery({
    websiteId: credentialId,
    period: selectedPeriod,
    groupBy: techView,
  });

  useEffect(() => {
    if (!isDetailsOpen) {
      setDetailsSearch("");
    }
  }, [isDetailsOpen]);

  useEffect(() => {
    setDetailsSearch("");
  }, [techView]);

  const orderedTechDetails = useMemo(() => {
    const entries = Array.isArray(techData) ? techData : [];

    const mapped = entries
      .map((item, index) => {
        const visitorsValue = Number.parseInt(item?.visitors ?? "0", 10);
        const numericVisitors = Number.isNaN(visitorsValue) ? 0 : visitorsValue;
        const name = item?.name?.trim() || "Unknown";
        return {
          id: item?.name ?? `tech-${index}`,
          name,
          value: numericVisitors,
        };
      })
      .sort((a, b) => b.value - a.value);

    return techSortDirection === "asc" ? [...mapped].reverse() : mapped;
  }, [techData, techSortDirection]);

  const filteredTechDetails = useMemo(() => {
    const query = detailsSearch.trim().toLowerCase();

    if (!query) {
      return orderedTechDetails;
    }

    return orderedTechDetails.filter((item) =>
      item.name.toLowerCase().includes(query)
    );
  }, [detailsSearch, orderedTechDetails]);

  const totalTechCount = orderedTechDetails.length;
  const filteredTechCount = filteredTechDetails.length;

  const techChartData = useMemo<VisitorsBarDatum[]>(
    () =>
      orderedTechDetails.slice(0, 5).map((item, index) => ({
        id: item.id ?? `tech-${index}`,
        label: item.name,
        value: item.value,
      })),
    [orderedTechDetails]
  );

  const techEntityLabel =
    techView === "browser_name"
      ? "browsers"
      : techView === "os_name"
        ? "operating systems"
        : "devices";

  const techTitle =
    techView === "browser_name"
      ? "All browsers"
      : techView === "os_name"
        ? "All operating systems"
        : "All devices";

  const techNameLabel =
    techView === "browser_name"
      ? "Browser"
      : techView === "os_name"
        ? "OS"
        : "Device";

  const techChartEmptyState = `No ${techEntityLabel} data available`;

  const handleOpenDetails = useCallback(() => {
    setDetailsSearch("");
    setIsDetailsOpen(true);
  }, []);

  const handleTechSortToggle = useCallback(() => {
    setTechSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const renderTechChartSection = useCallback(
    (title: string) => (
      <div className="min-h-[420px]">
        <div className="border-b border-border/50 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </span>
            <button
              type="button"
              onClick={handleTechSortToggle}
              className="flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              aria-label={`Sort visitors ${techSortDirection === "desc" ? "ascending" : "descending"}`}
              title="Toggle visitor sort order"
            >
              <span>Visitors</span>
              <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
                <span
                  className={
                    techSortDirection === "asc"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }
                >
                  ↑
                </span>
                <span
                  className={
                    techSortDirection === "desc"
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
          <VisitorsBarChart data={techChartData} emptyState={techChartEmptyState} />
        </div>
      </div>
    ),
    [handleTechSortToggle, techChartData, techChartEmptyState, techSortDirection]
  );

  const techDetailsHeader = (
    <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
      <span>Rank</span>
      <span>{techNameLabel}</span>
      <button
        type="button"
        onClick={handleTechSortToggle}
        className="flex items-center justify-end gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        aria-label={`Sort visitors ${techSortDirection === "desc" ? "ascending" : "descending"}`}
      >
        <span>Visitors</span>
        <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
          <span
            className={
              techSortDirection === "asc"
                ? "text-foreground"
                : "text-muted-foreground"
            }
          >
            ↑
          </span>
          <span
            className={
              techSortDirection === "desc"
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

  const techDetailsContent = filteredTechDetails.length ? (
    <div className="divide-y divide-border/40">
      {filteredTechDetails.map((item, index) => (
        <div
          key={`${item.id}-${index}`}
          className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3"
        >
          <span className="w-10 shrink-0 text-xs font-mono text-muted-foreground">
            #{index + 1}
          </span>
          <span className="truncate text-sm font-semibold text-foreground">
            {item.name}
          </span>
          <span className="text-right text-xs font-semibold text-muted-foreground">
            {formatVisitorsValue(item.value)}
          </span>
        </div>
      ))}
    </div>
  ) : (
    <div className="flex h-40 items-center justify-center px-4 text-sm text-muted-foreground">
      No {techEntityLabel} found.
    </div>
  );

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs value={techView} onValueChange={(value) => setTechView(value as typeof techView)}>
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="browser_name"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Browser
          </TabsTrigger>
          <TabsTrigger
            value="os_name"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            OS
          </TabsTrigger>
          <TabsTrigger
            value="device"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Device
          </TabsTrigger>
        </TabsList>

        <TabContent value="browser_name">
          {renderTechChartSection("Browser")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>

        <TabContent value="os_name">
          {renderTechChartSection("Operating system")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>

        <TabContent value="device">
          {renderTechChartSection("Device")}
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>
      </Tabs>
      <AnalyticsDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={techTitle}
        description={`Inspect all ${techEntityLabel} contributing visitors for this period.`}
        searchPlaceholder={`Search ${techEntityLabel}...`}
        searchValue={detailsSearch}
        onSearchChange={setDetailsSearch}
        totalCount={totalTechCount}
        filteredCount={filteredTechCount}
        entityLabel={techEntityLabel}
        header={techDetailsHeader}
      >
        {techDetailsContent}
      </AnalyticsDetailsDialog>
    </Card>
  );
}
