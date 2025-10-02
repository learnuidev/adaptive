import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ExternalLink } from "lucide-react";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useMemo, useState } from "react";
import {
  DetailsButton,
  TabContent,
} from "./interactive-visitor-chart.components";
import { useGetSummaryQuery } from "@/modules/analytics/use-get-summary-query";
import { useListFeaturesQuery } from "@/modules/feature/use-list-features-query";

interface InteractiveVisitorChartProps {
  credentialId: string;
}

export function PageAndFeaturePanel({
  credentialId,
}: InteractiveVisitorChartProps) {
  const [currentTab, setCurrentTab] = useState<"page" | "feature">("page");
  const { selectedPeriod } = useFilterPeriodStore();

  const { data: summary } = useGetSummaryQuery({
    websiteId: credentialId,
    period: selectedPeriod,
  });

  const { data: features } = useListFeaturesQuery(credentialId);

  const currentPageVisitsPerPage = useMemo(
    () =>
      (summary?.pageVisitsPerPage.current || [])
        ?.sort(
          (a, b) =>
            parseInt(b?.total || b?.visits || "0" || "0") -
            parseInt(a?.total || a?.visits || "0" || "0")
        )
        .slice(0, 5)
        ?.map((page) => {
          return {
            name: page?.patternHref || page?.href || "",
            value: parseInt(page?.total || page?.visits || "0" || "0"),
          };
        }),
    [summary?.pageVisitsPerPage.current]
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
              <div className="flex items-center justify-between text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span>Page</span>
                <span>Visitors ↑↓</span>
              </div>
            </div>
            <div className="pr-4 space-y-2">
              {currentPageVisitsPerPage &&
              currentPageVisitsPerPage.length > 0 ? (
                <TooltipProvider>
                  {(() => {
                    const maxValue = Math.max(
                      ...currentPageVisitsPerPage.map((p) => p.value)
                    );
                    return currentPageVisitsPerPage.map((page, index) => {
                      const percentage = (page.value / maxValue) * 100;
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            <div
                              className="group cursor-pointer"
                              onClick={() => handlePageClick(page.name)}
                            >
                              <div className="flex items-center gap-3 mb-1">
                                <div className="flex-1 relative h-10 bg-secondary/30 rounded overflow-hidden">
                                  <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/70 to-primary/50 transition-all duration-300 group-hover:from-primary/80 group-hover:to-primary/60"
                                    style={{ width: `${percentage}%` }}
                                  />
                                  <div className="absolute inset-0 flex items-center justify-between px-3 gap-2">
                                    <span className="text-sm font-medium text-foreground truncate z-10 flex-1">
                                      {page.name || "/"}
                                    </span>
                                    <ExternalLink className="h-3 w-3 text-foreground/50 group-hover:text-foreground/80 transition-colors flex-shrink-0 z-10" />
                                  </div>
                                </div>
                                <span className="text-sm font-bold text-foreground w-4 text-right">
                                  {page.value >= 1000
                                    ? `${(page.value / 1000).toFixed(1)}k`
                                    : page.value.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-md">
                            <div className="space-y-1">
                              <p className="font-semibold text-sm break-all">
                                {page.name || "/"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {page.value.toLocaleString()} visitor
                                {page.value !== 1 ? "s" : ""} • Click to open
                              </p>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      );
                    });
                  })()}
                </TooltipProvider>
              ) : (
                <div className="flex items-center justify-center h-[360px] text-muted-foreground">
                  No page data available
                </div>
              )}
            </div>
          </div>
          <DetailsButton />
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
          <DetailsButton />
        </TabContent>
      </Tabs>
    </Card>
  );
}
