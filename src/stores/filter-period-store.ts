import { create } from "zustand";
import { persist } from "zustand/middleware";
// import { FilterPeriod, filterPeriods } from '@/modules/analytics/use-get-summary-query';

import {
  FilterPeriod,
  filterPeriods,
  CustomDateRange,
} from "@/modules/analytics/analytics.types";

interface FilterPeriodStore {
  selectedPeriod: FilterPeriod;
  customDateRange: CustomDateRange | null;
  setSelectedPeriod: (period: FilterPeriod) => void;
  setCustomDateRange: (dateRange: CustomDateRange) => void;
}

export const useFilterPeriodStore = create<FilterPeriodStore>()(
  persist(
    (set) => ({
      selectedPeriod: "last7d",
      customDateRange: null,
      setSelectedPeriod: (period: FilterPeriod) =>
        set({ selectedPeriod: period }),
      setCustomDateRange: (dateRange: CustomDateRange) =>
        set({ customDateRange: dateRange, selectedPeriod: "custom" }),
    }),
    {
      name: "selected-filter-period",
      deserialize: (str) => {
        const parsed = JSON.parse(str);
        // Convert string dates back to Date objects
        if (parsed.state?.customDateRange) {
          parsed.state.customDateRange = {
            startDate: new Date(parsed.state.customDateRange.startDate),
            endDate: new Date(parsed.state.customDateRange.endDate),
          };
        }
        return parsed;
      },
    }
  )
);
