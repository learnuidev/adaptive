import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { DateRangePicker } from "./date-range-picker";
import { useState } from "react";
import { safeFormatDate } from "@/utils/date-utils";
import { CalendarIcon } from "lucide-react";

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
      setSelectedPeriod("custom");
      setShowDatePicker(true);
    } else {
      setSelectedPeriod(value);
      setShowDatePicker(false);
    }
  };

  const handleDateApply = (dateRange: { startDate: Date; endDate: Date }) => {
    setCustomDateRange(dateRange);
    setShowDatePicker(false);
  };

  const handleDateClear = () => {
    setCustomDateRange(null);
    setSelectedPeriod("last7d");
    setShowDatePicker(false);
  };

  const handleEditDates = () => {
    setShowDatePicker(true);
  };

  return (
    <>
      <div className="flex items-center gap-2">
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
        
        {selectedPeriod === "custom" && customDateRange && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {safeFormatDate(customDateRange.startDate)} - {safeFormatDate(customDateRange.endDate)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEditDates}
              className="h-6 w-6 p-0 hover:bg-white/10"
            >
              <CalendarIcon className="h-3 w-3" />
            </Button>
          </div>
        )}
      </div>
      
      {/* Floating date picker - positioned absolutely to prevent layout shift */}
      {showDatePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div 
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowDatePicker(false)}
          />
          <div className="relative glass border-white/10 bg-card/95 backdrop-blur-md rounded-lg p-4 shadow-xl min-w-[400px] max-w-[90vw] max-h-[90vh] overflow-auto">
            <DateRangePicker
              value={customDateRange || undefined}
              onApply={handleDateApply}
              onClear={handleDateClear}
              className="w-full"
            />
          </div>
        </div>
      )}
    </>
  );
}
