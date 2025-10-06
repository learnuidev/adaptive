import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FilterPeriod } from "@/modules/analytics/analytics.types";

import { useFilterPeriodStore } from "@/stores/filter-period-store";

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
  const { selectedPeriod, setSelectedPeriod } = useFilterPeriodStore();

  return (
    <Select
      value={selectedPeriod}
      onValueChange={(value: FilterPeriod) => setSelectedPeriod(value)}
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
  );
}
