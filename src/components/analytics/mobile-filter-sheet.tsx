import { useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Filter, Database, Clock, Check, ChevronDown } from "lucide-react";

import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { DateRangePicker } from "./date-range-picker";
import { safeFormatDate } from "@/utils/date-utils";

const periodLabels: Record<FilterPeriod, string> = {
  today: "Today",
  yesterday: "Yesterday",
  // day: "Day",
  // week: "Week",
  // month: "Month",
  // year: "Year",
  last24h: "Last 24 hours",
  last7d: "Last 7 days",
  last30d: "Last 30 days",
  last12m: "Last 12 months",
  wtd: "Week to date",
  mtd: "Month to date",
  ytd: "Year to date",
  all: "All time",
  custom: "Custom",
};

export function MobileFilterSheet() {
  const [open, setOpen] = useState(false);
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const navigate = useNavigate();
  const { data: websites } = useListUserWebsitesQuery();
  const {
    selectedPeriod,
    setSelectedPeriod,
    customDateRange,
    setCustomDateRange,
  } = useFilterPeriodStore();

  const handleWebsiteChange = (newCredentialId: string) => {
    const currentPath = location.pathname;
    const basePath = currentPath.split("/")[1] || "dashboard";
    navigate({ to: `/${basePath}/${newCredentialId}` });
    setOpen(false);
  };

  const handlePeriodChange = (period: FilterPeriod) => {
    if (period === "custom") {
      setSelectedPeriod("custom");
    } else {
      setSelectedPeriod(period);
      setOpen(false);
    }
  };

  const handleMobileDateApply = (dateRange: {
    startDate: Date;
    endDate: Date;
  }) => {
    setCustomDateRange(dateRange);
    setOpen(false);
  };

  const handleMobileDateClear = () => {
    setCustomDateRange(null);
    setSelectedPeriod("last7d");
    setOpen(false);
  };

  const getActiveFiltersCount = () => {
    const count = 0;
    return count;
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="relative flex items-center gap-2 glass border-white/10 bg-card/50 backdrop-blur-md h-9 px-3"
        >
          <Filter className="w-4 h-4" />
          <span className="text-sm">Filters</span>
          <ChevronDown className="w-3 h-3" />
          {getActiveFiltersCount() > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-primary text-primary-foreground">
              {getActiveFiltersCount()}
            </Badge>
          )}
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="max-h-[85vh] rounded-t-2xl">
        <SheetHeader className="pb-6">
          <SheetTitle className="text-left text-xl font-semibold">
            Filters
          </SheetTitle>
        </SheetHeader>

        <div className="space-y-6">
          {/* Credential Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Website</h3>
            </div>
            <div className="grid gap-2">
              {websites?.map((website) => (
                <Button
                  key={website.id}
                  variant={websiteId === website.id ? "default" : "ghost"}
                  className="justify-between h-12 px-4"
                  onClick={() => handleWebsiteChange(website.id)}
                >
                  <div className="flex flex-col items-start">
                    <span className="font-medium">{website.title}</span>
                    <span className="text-xs text-muted-foreground">
                      {website.domain}
                    </span>
                  </div>
                  {websiteId === website.id && <Check className="w-4 h-4" />}
                </Button>
              ))}
            </div>
          </div>

          <Separator />

          {/* Time Period Selection */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <h3 className="font-medium">Time Period</h3>
            </div>
            <div className="grid gap-2">
              {Object.entries(periodLabels).map(([key, label]) => (
                <Button
                  key={key}
                  variant={selectedPeriod === key ? "default" : "ghost"}
                  className="justify-between h-11 px-4"
                  onClick={() => handlePeriodChange(key as FilterPeriod)}
                >
                  <span>{label}</span>
                  {selectedPeriod === key && <Check className="w-4 h-4" />}
                </Button>
              ))}
            </div>

            {selectedPeriod === "custom" && (
              <div className="mt-4">
                {customDateRange ? (
                  <div className="flex items-center justify-between p-3 bg-muted/30 rounded border">
                    <span className="text-sm text-foreground">
                      {safeFormatDate(customDateRange.startDate)} - {safeFormatDate(customDateRange.endDate)}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setCustomDateRange(null);
                      }}
                      className="text-xs"
                    >
                      Change dates
                    </Button>
                  </div>
                ) : (
                  <DateRangePicker
                    value={customDateRange || undefined}
                    onApply={handleMobileDateApply}
                    onClear={handleMobileDateClear}
                    className="w-full"
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <div className="pt-6 pb-4">
          <Button
            className="w-full h-12 text-base font-medium"
            onClick={() => setOpen(false)}
          >
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
