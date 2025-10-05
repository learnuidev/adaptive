import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink } from "lucide-react";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnalyticsDetailsDialog,
  DetailsButton,
  TabContent,
  VisitorsBarChart,
  type VisitorsBarDatum,
  formatVisitorsValue,
} from "./interactive-visitor-chart.components";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useListFeaturesQuery } from "@/modules/feature/use-list-features-query";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

const getDisplayLabel = (path: string) => {
  if (!path) return "/";
  const displayPath = path.startsWith("http") ? new URL(path).pathname || "/" : path;
  if (displayPath.length <= 34) return displayPath;
  return `${displayPath.slice(0, 16)}…${displayPath.slice(-12)}`;
};

export function PageAndFeaturePanel({
  credentialId,
}: InteractiveVisitorChartProps) {
  const [currentTab, setCurrentTab] = useState<"page" | "feature">("page");
  const [pageSortDirection, setPageSortDirection] = useState<"asc" | "desc">("desc");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [detailsView, setDetailsView] = useState<"page" | "feature">("page");
  const [detailsSearch, setDetailsSearch] = useState("");
  const [featureSortDirection, setFeatureSortDirection] = useState<"asc" | "desc">("asc");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: summary } = useGetSummaryQuery({
    websiteId: credentialId,
    period: selectedPeriod,
  });

  const { data: features } = useListFeaturesQuery(credentialId);

  useEffect(() => {
    if (!isDetailsOpen) {
      setDetailsSearch("");
    }
  }, [isDetailsOpen]);

  useEffect(() => {
    if (isDetailsOpen) {
      setDetailsView(currentTab);
      setDetailsSearch("");
    }
  }, [currentTab, isDetailsOpen]);

  const handleSortToggle = useCallback(() => {
    setPageSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const handleOpenDetails = useCallback(() => {
    setDetailsView(currentTab);
    setDetailsSearch("");
    setIsDetailsOpen(true);
  }, [currentTab]);

  const handleFeatureSortToggle = useCallback(() => {
    setFeatureSortDirection((prev) => (prev === "desc" ? "asc" : "desc"));
  }, []);

  const orderedPageVisits = useMemo(() => {
    const rawPageVisits = summary?.pageVisitsPerPage?.current ?? [];
    const pages = Array.isArray(rawPageVisits) ? rawPageVisits : [];

    const mapped = pages
      .map((page) => {
        const rawPath = page?.patternHref || page?.href || "";
        const value = Number.parseInt(
          page?.total || page?.visits || "0",
          10
        );

        return {
          fullPath: rawPath || "/",
          label: getDisplayLabel(rawPath || "/"),
          value: Number.isNaN(value) ? 0 : value,
        };
      })
      .sort((a, b) => b.value - a.value);

    const ordered =
      pageSortDirection === "asc" ? [...mapped].reverse() : mapped;

    return ordered.map((item, index) => ({ ...item, rank: index + 1 }));
  }, [summary, pageSortDirection]);

  const currentPageVisitsPerPage = useMemo(
    () => orderedPageVisits.slice(0, 5),
    [orderedPageVisits]
  );

  const pageChartData = useMemo<VisitorsBarDatum[]>(
    () =>
      currentPageVisitsPerPage.map((page) => ({
        id: page.fullPath || page.label,
        label: page.label,
        value: page.value,
        secondaryLabel: page.fullPath,
        meta: page,
      })),
    [currentPageVisitsPerPage]
  );

  const filteredPageDetails = useMemo(() => {
    if (detailsView !== "page") {
      return [];
    }

    if (!orderedPageVisits.length) {
      return [];
    }

    const query = detailsSearch.trim().toLowerCase();

    if (!query) {
      return orderedPageVisits;
    }

    return orderedPageVisits.filter((page) => {
      const labelMatch = page.label.toLowerCase().includes(query);
      const pathMatch = page.fullPath.toLowerCase().includes(query);
      return labelMatch || pathMatch;
    });
  }, [detailsSearch, detailsView, orderedPageVisits]);

  const filteredFeatureDetails = useMemo(() => {
    if (detailsView !== "feature") {
      return [];
    }

    const list = Array.isArray(features) ? features : [];
    const query = detailsSearch.trim().toLowerCase();

    const filtered = query
      ? list.filter((feature) => {
          const nameMatch = feature.name?.toLowerCase().includes(query);
          const keyMatch = feature.featureKey?.toLowerCase().includes(query);
          const descriptionMatch = feature.description?.toLowerCase().includes(query);
          const tagsMatch = feature.tags?.some((tag) => tag.toLowerCase().includes(query));

          return Boolean(nameMatch || keyMatch || descriptionMatch || tagsMatch);
        })
      : list;

    const sorted = [...filtered].sort((a, b) => {
      const aName = a.name?.toLowerCase() ?? "";
      const bName = b.name?.toLowerCase() ?? "";
      return aName.localeCompare(bName);
    });

    return featureSortDirection === "asc" ? sorted : sorted.reverse();
  }, [detailsSearch, detailsView, features, featureSortDirection]);

  const pageChartTooltip = useCallback(
    (datum: VisitorsBarDatum) => {
      const fullPath = (datum.secondaryLabel as string) || datum.label;

      return (
        <div className="rounded-md border border-border/60 bg-background/95 px-3 py-2 shadow-lg backdrop-blur">
          <p className="break-all text-sm font-semibold">{fullPath}</p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <ExternalLink className="h-3 w-3" />
            {formatVisitorsValue(datum.value)} visitors • Click to open
          </p>
        </div>
      );
    },
    []
  );

  const handlePageClick = (pagePath: string) => {
    if (!pagePath) return;

    // Try to construct the full URL
    // First, check if credentialId might contain domain info, otherwise use current origin
    const fullUrl = pagePath.startsWith("http")
      ? pagePath
      : `${window.location.origin}${pagePath.startsWith("/") ? "" : "/"}${pagePath}`;

    window.open(fullUrl, "_blank", "noopener,noreferrer");
  };

  const detailsCount =
    detailsView === "page"
      ? filteredPageDetails.length
      : filteredFeatureDetails.length;

  const totalDetailsCount =
    detailsView === "page"
      ? orderedPageVisits.length
      : Array.isArray(features)
        ? features.length
        : 0;

  const detailsPlaceholder =
    detailsView === "page" ? "Search pages..." : "Search features...";

  const detailsEntityLabel =
    detailsView === "page" ? "pages" : "features";

  const detailsHeader =
    detailsView === "page" ? (
      <div className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-center px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>Rank</span>
        <span>Page</span>
        <button
          type="button"
          onClick={handleSortToggle}
          className="flex items-center justify-end gap-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Sort visitors ${pageSortDirection === "desc" ? "ascending" : "descending"}`}
        >
          <span>Visitors</span>
          <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
            <span
              className={
                pageSortDirection === "asc"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              ↑
            </span>
            <span
              className={
                pageSortDirection === "desc"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              ↓
            </span>
          </span>
        </button>
      </div>
    ) : (
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center px-4 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <button
          type="button"
          onClick={handleFeatureSortToggle}
          className="flex items-center gap-1 text-left text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          aria-label={`Sort features ${featureSortDirection === "desc" ? "ascending" : "descending"}`}
        >
          <span>Feature</span>
          <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
            <span
              className={
                featureSortDirection === "asc"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              ↑
            </span>
            <span
              className={
                featureSortDirection === "desc"
                  ? "text-foreground"
                  : "text-muted-foreground"
              }
            >
              ↓
            </span>
          </span>
        </button>
        <span className="text-right">Key</span>
      </div>
    );

  const detailsContent =
    detailsView === "page" ? (
      filteredPageDetails.length ? (
        <div className="divide-y divide-border/40">
          {filteredPageDetails.map((page) => (
            <button
              key={`${page.fullPath}-${page.rank}`}
              type="button"
              onClick={() => handlePageClick(page.fullPath)}
              className="grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 text-left transition-colors hover:bg-secondary/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <span className="w-10 shrink-0 text-xs font-mono text-muted-foreground">
                #{page.rank}
              </span>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-sm font-semibold text-foreground">
                  {page.label}
                </span>
                <span className="break-all text-xs text-muted-foreground">
                  {page.fullPath}
                </span>
              </div>
              <span className="flex items-center justify-end gap-1 whitespace-nowrap text-xs font-semibold text-muted-foreground">
                {formatVisitorsValue(page.value)}
                <ExternalLink className="h-3.5 w-3.5" />
              </span>
            </button>
          ))}
        </div>
      ) : (
        <div className="flex h-40 items-center justify-center px-4 text-sm text-muted-foreground">
          No pages found.
        </div>
      )
    ) : filteredFeatureDetails.length ? (
      <div className="divide-y divide-border/40">
        {filteredFeatureDetails.map((feature) => (
          <div
            key={feature.id}
            className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-4 py-3"
          >
            <div className="min-w-0 space-y-1">
              <p className="truncate text-sm font-semibold text-foreground">
                {feature.name}
              </p>
              {feature.description ? (
                <p className="break-words text-xs text-muted-foreground">
                  {feature.description}
                </p>
              ) : null}
              {feature.tags?.length ? (
                <div className="mt-2 flex flex-wrap gap-2">
                  {feature.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-secondary/70 px-2 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider text-muted-foreground"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
            <span className="text-right text-xs font-mono text-muted-foreground">
              {feature.featureKey}
            </span>
          </div>
        ))}
      </div>
    ) : (
      <div className="flex h-40 items-center justify-center px-4 text-sm text-muted-foreground">
        No features found.
      </div>
    );

  return (
    <Card className="bg-gradient-card border-border/50 hover:shadow-medium transition-all duration-300 animate-fade-in glass">
      <Tabs
        value={currentTab}
        onValueChange={(v) => setCurrentTab(v as "page" | "feature")}
      >
        <TabsList className="w-full rounded-none border-b border-border/50 bg-transparent p-0 h-12">
          <TabsTrigger
            value="page"
            className="rounded-none border-r border-border/50 data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Page
          </TabsTrigger>
          <TabsTrigger
            value="feature"
            className="rounded-none data-[state=active]:bg-secondary data-[state=active]:text-foreground text-muted-foreground"
          >
            Features
          </TabsTrigger>
        </TabsList>

        <TabContent value="page">
          <div className="min-h-[420px]">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Page
                </span>
                <button
                  type="button"
                  onClick={handleSortToggle}
                  className="flex items-center gap-1 text-xs font-medium text-muted-foreground uppercase tracking-wider transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  aria-label={`Sort visitors ${pageSortDirection === "desc" ? "ascending" : "descending"}`}
                  title="Toggle visitor sort order"
                >
                  <span>Visitors</span>
                  <span className="flex items-center gap-[2px] text-[0.65rem] leading-none font-semibold">
                    <span
                      className={
                        pageSortDirection === "asc"
                          ? "text-foreground"
                          : "text-muted-foreground"
                      }
                    >
                      ↑
                    </span>
                    <span
                      className={
                        pageSortDirection === "desc"
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
            <div className="p-4 h-[360px]">
              <VisitorsBarChart
                data={pageChartData}
                onBarClick={(datum) => handlePageClick((datum.secondaryLabel as string) || datum.label)}
                tooltipRenderer={pageChartTooltip}
                emptyState="No page data available"
              />
            </div>
          </div>
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>

        <TabContent value="feature">
          <div className="min-h-[420px]">
            <div className="p-4 border-b border-border/50">
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Feature</span>
                <span>Count</span>
              </div>
            </div>
            <div className="p-4 space-y-2">
              {features && features.length > 0 ? (
                features.map((feature, index) => (
                  <div key={feature.id} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {feature.name}
                      </p>
                      {feature.description && (
                        <p className="text-xs text-muted-foreground truncate">
                          {feature.description}
                        </p>
                      )}
                    </div>
                    <span className="text-sm font-mono text-muted-foreground ml-4">
                      {feature.featureKey}
                    </span>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-[360px] text-muted-foreground">
                  No features yet
                </div>
              )}
            </div>
          </div>
          <DetailsButton onClick={handleOpenDetails} />
        </TabContent>
      </Tabs>
      <AnalyticsDetailsDialog
        open={isDetailsOpen}
        onOpenChange={setIsDetailsOpen}
        title={detailsView === "page" ? "All pages" : "All features"}
        description={
          detailsView === "page"
            ? "Review every tracked page, search for specific paths, and open them directly in a new tab."
            : "Browse your full feature catalog and quickly search by name, key, or description."
        }
        searchPlaceholder={detailsPlaceholder}
        searchValue={detailsSearch}
        onSearchChange={setDetailsSearch}
        totalCount={totalDetailsCount}
        filteredCount={detailsCount}
        entityLabel={detailsEntityLabel}
        header={detailsHeader}
      >
        {detailsContent}
      </AnalyticsDetailsDialog>
    </Card>
  );
}
