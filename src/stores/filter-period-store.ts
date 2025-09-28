import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { FilterPeriod, filterPeriods } from '@/modules/analytics/use-get-summary-query';

interface FilterPeriodStore {
  selectedPeriod: FilterPeriod;
  setSelectedPeriod: (period: FilterPeriod) => void;
}

export const useFilterPeriodStore = create<FilterPeriodStore>()(
  persist(
    (set) => ({
      selectedPeriod: filterPeriods.week,
      setSelectedPeriod: (period: FilterPeriod) =>
        set({ selectedPeriod: period }),
    }),
    {
      name: 'selected-filter-period',
    }
  )
);