import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { DateRangePicker } from "./date-range-picker";
import { useState } from "react";
import { safeFormatDate } from "@/utils/date-utils";

const periodLabels: Record<FilterPeriod, string> = {
  today: "Today",
  yesterday: "Yesterday",
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

export function FilterPeriodSelector() {
  const { 
    selectedPeriod, 
    setSelectedPeriod, 
    customDateRange,
    setCustomDateRange 
  } = useFilterPeriodStore();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handlePeriodChange = (value: FilterPeriod) => {
    if (value === "custom") {
      setShowDatePicker(true);
    } else {
      setSelectedPeriod(value);
      setShowDatePicker(false);
    }
  };

  const handleDateRangeChange = (dateRange: { startDate: Date; endDate: Date }) => {
    setCustomDateRange(dateRange);
    setShowDatePicker(false);
  };

  return (
    <div className="flex flex-col gap-2">
      <Select
        value={selectedPeriod}
        onValueChange={handlePeriodChange}
      >
        <SelectTrigger className="w-[140px] glass border-white/10 bg-card/50 backdrop-blur-md">
          <SelectValue placeholder="Select period" />
        </SelectTrigger>
        <SelectContent className="glass border-white/10 bg-card/95 backdrop-blur-md">
          {Object.entries(periodLabels).map(([key, label]) => (
            <SelectItem key={key} value={key} className="hover:bg-white/5">
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {showDatePicker && (
        <div className="relative z-50">
          <div className="glass border-white/10 bg-card/95 backdrop-blur-md rounded-lg p-4 shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">
                Select date range
              </span>
              <button
                onClick={() => setShowDatePicker(false)}
                className="text-muted-foreground hover:text-foreground text-sm"
              >
                Cancel
              </button>
            </div>
            <DateRangePicker
              value={customDateRange || undefined}
              onChange={handleDateRangeChange}
              className="w-full"
            />
          </div>
        </div>
      )}
      
      {selectedPeriod === "custom" && customDateRange && !showDatePicker && (
        <div className="text-xs text-muted-foreground px-1">
          {safeFormatDate(customDateRange.startDate)} - {safeFormatDate(customDateRange.endDate)}
        </div>
      )}
    </div>
  );
}
