import { ResponsiveFilters } from "@/components/analytics/responsive-filters";
import { InteractiveVisitorChart } from "@/components/dashboard/interactive-visitor-chart/interactive-visitor-chart";
import { UnifiedAnalyticsCard } from "@/components/dashboard/unified-analytics-card";
import { NoWebsiteMessage } from "@/components/websites/no-website-message";
import { WithNewEvents } from "@/components/with-new-events";
import {
  useGetSummaryQuery,
  VisitorCount,
} from "@/modules/analytics/use-get-summary-query";
import { useListUserWebsitesQuery } from "@/modules/user-websites/use-list-user-websites-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";
import { buildChartData, combineChartData, calculatePercentageChange } from "@/lib/chart-utils";


const deviceData = [
  { name: "Desktop", value: 65 },
  { name: "Mobile", value: 85 },
  { name: "Tablet", value: 35 },
];

const featureFlags = [
  {
    id: 1,
    name: "New Dashboard UI",
    description: "Updated dashboard design with improved navigation",
    enabled: true,
    rolloutPercentage: 75,
    environment: "production" as const,
    usersAffected: 18500,
  },
  {
    id: 2,
    name: "Advanced Analytics",
    description: "Enhanced analytics with real-time data processing",
    enabled: false,
    rolloutPercentage: 25,
    environment: "staging" as const,
    usersAffected: 2300,
  },
  {
    id: 3,
    name: "AI Insights",
    description: "Machine learning powered insights and predictions",
    enabled: true,
    rolloutPercentage: 100,
    environment: "development" as const,
    usersAffected: 500,
  },
];

import { GoalsPanel } from "@/components/dashboard/interactive-visitor-chart/goals-panel";
import { FilterPeriod } from "@/modules/analytics/analytics.types";
import { GetSummaryResponse } from "@/modules/analytics/use-get-summary-query";

const formatSessionTime = (summary: GetSummaryResponse) => {
  const totalSeconds = summary?.averageSession.current || 0;
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m ${seconds}s`;
  }
};

export default function Dashboard() {
  // Use strict: false to handle cases where params might not exist
  const params = useParams({ strict: false }) as { websiteId?: string };
  const websiteId = params?.websiteId;
  const { data: websites } = useListUserWebsitesQuery();
  const [flags, setFlags] = useState(featureFlags);

  const currentWebsite = websites?.find((cred) => cred.id === websiteId);

  const toggleFlag = (id: number) => {
    setFlags(
      flags.map((flag) =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };

  const { selectedPeriod } = useFilterPeriodStore();
  const { data: summary } = useGetSummaryQuery({
    websiteId,
    period: selectedPeriod,
  });

  // Reusable helper: turns summary.totalVisitors.current into chart-ready points

  // Inside component:
  const chartData = buildChartData(
    selectedPeriod,
    summary?.totalVisitors.current
  );
  const previousChartData = buildChartData(
    selectedPeriod,
    summary?.totalVisitors?.previous
  );

  const totalPageVisitsOvertimeChartData = buildChartData(
    selectedPeriod,
    summary?.totalPageVisitsOvertime.current
  );
  const previousTotalPageVisitsOvertimeChartData = buildChartData(
    selectedPeriod,
    summary?.totalPageVisitsOvertime?.previous
  );

  // Combine both datasets for composed chart
  const combinedChartData = chartData.map((item, index) => ({
    ...item,
    secondaryValue: totalPageVisitsOvertimeChartData[index]?.value || 0,
  }));

  const [metricsEnabled, setMetricsEnabled] = useState([true, true, true]);

  const metricsData = [
    {
      label: "Visitors",
      value: summary?.totalVisitors.currentTotal || 0,
      change: summary?.totalVisitors.percentageDifference || 0,
      enabled: metricsEnabled[0],
      showCheckbox: true,
    },
    {
      label: "Page Views",
      value: summary?.totalPageVisits.current || 0,
      change: summary?.totalPageVisits.percentageDifference || 0,
      enabled: metricsEnabled[1],
      showCheckbox: true,
    },
    {
      label: "Session time",
      value: summary?.averageSession.current ? formatSessionTime(summary) : "0",
      change: summary?.averageSession.percentageDifference || 0,
      enabled: metricsEnabled[2],
      showCheckbox: false,
    },
  ];

  const handleToggleMetric = (index: number) => {
    setMetricsEnabled((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  // Show websites selection if no website ID or website not found
  if (!websiteId || (websites && !currentWebsite)) {
    return <NoWebsiteMessage />;
  }

  return (
    <WithNewEvents websiteId={websiteId}>
      <div className="min-h-screen bg-background w-full">
        {/* Header */}

        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-between gap-4">
              <ResponsiveFilters />
              <div className="hidden md:flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live data</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-2 space-y-8">
          {/* Unified Analytics */}
          <UnifiedAnalyticsCard
            metrics={metricsData}
            data={combinedChartData}
            selectedPeriod={selectedPeriod}
            chartKey="visitorTraffic"
            height={400}
            onToggleMetric={handleToggleMetric}
            showVisitors={metricsEnabled[0]}
            showPageViews={metricsEnabled[1]}
          />

          {/* Interactive Visitor Analytics */}
          <InteractiveVisitorChart websiteId={websiteId} />

          <GoalsPanel websiteId={websiteId} />
        </div>
      </div>
    </WithNewEvents>
  );
}
