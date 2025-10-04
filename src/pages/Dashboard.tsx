import { ResponsiveFilters } from "@/components/analytics/ResponsiveFilters";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { UnifiedAnalyticsCard } from "@/components/dashboard/UnifiedAnalyticsCard";
import { InteractiveVisitorChart } from "@/components/dashboard/interactive-visitor-chart/interactive-visitor-chart";
import { WithNewEvents } from "@/components/with-new-events";
import {
  useGetSummaryQuery,
  VisitorCount,
} from "@/modules/analytics/use-get-summary-query";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useParams } from "@tanstack/react-router";
import { useState } from "react";

function buildChartData(
  selectedPeriod: FilterPeriod,
  totalVisitors: VisitorCount[]
) {
  if (!totalVisitors) return [];

  const raw = totalVisitors;
  const filled: { name: string; value: number }[] = [];

  // Decide granularity from the first item that has a key
  const first = raw.find((it) => it?.day || it?.hour || it?.month);
  if (!first) return [];

  if (first.day) {
    // ---------- WEEK (7 days) ----------
    // Reorder days so Monday is first and Sunday is last
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const map = new Map<string, number>();
    raw.forEach((it) => {
      if (it?.day) {
        const d = new Date(it.day);
        // Adjust day index so Monday (1) maps to 0
        const dayIndex = (d.getDay() + 6) % 7;
        map.set(days[dayIndex], Number(it.total) || 0);
      }
    });
    days.forEach((d) => filled.push({ name: d, value: map.get(d) || 0 }));
  } else if (first.hour) {
    // ---------- DAY (24 hours) ----------
    const map = new Map<number, number>();
    raw.forEach((it) => {
      if (it?.hour)
        map.set(new Date(it.hour).getHours(), Number(it.total) || 0);
    });
    Array.from({ length: 24 }, (_, h) => h).forEach((h) =>
      filled.push({ name: `${h}:00`, value: map.get(h) || 0 })
    );
  } else if (first.month) {
    // ---------- YEAR (12 months) ----------
    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const map = new Map<number, number>();
    raw.forEach((it) => {
      if (it?.month) {
        const str = String(it.month);
        const m = Number(str.slice(4, 6)); // 1-12
        map.set(m - 1, Number(it.total) || 0);
      }
    });
    monthNames.forEach((name, idx) =>
      filled.push({ name, value: map.get(idx) || 0 })
    );
  }

  // If selectedPeriod is 'month', override labels to "Month Day"
  if (["month", "last30d"].includes(selectedPeriod) && first.day) {
    const dayMap = new Map<string, number>();
    raw.forEach((it) => {
      if (it?.day) {
        const d = new Date(it.day);
        const iso = d.toISOString().slice(0, 10); // YYYY-MM-DD
        dayMap.set(iso, Number(it.total) || 0);
      }
    });

    // Build array in chronological order
    const sorted = Array.from(dayMap.keys()).sort();

    // Fill missing days with 0
    const filledMonth: { name: string; value: number }[] = [];
    if (sorted.length > 0) {
      const firstDate = new Date(sorted[0]);
      const lastDate = new Date(sorted[sorted.length - 1]);
      const dayMs = 24 * 60 * 60 * 1000;
      for (
        let d = new Date(firstDate);
        d <= lastDate;
        d.setTime(d.getTime() + dayMs)
      ) {
        const iso = d.toISOString().slice(0, 10);
        const monthName = d.toLocaleString("en-US", { month: "long" });
        const day = d.getDate();
        const label = `${monthName} ${day}`;
        const value = dayMap.get(iso) || 0;
        filledMonth.push({ name: label, value });
      }
    }
    return filledMonth;
  }

  return filled;
}
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
  const params = useParams({ strict: false }) as { credentialId?: string };
  const credentialId = params?.credentialId;
  const { data: credentials } = useListUserCredentialsQuery();
  const [flags, setFlags] = useState(featureFlags);

  const currentCredential = credentials?.find(
    (cred) => cred.id === credentialId
  );

  const toggleFlag = (id: number) => {
    setFlags(
      flags.map((flag) =>
        flag.id === id ? { ...flag, enabled: !flag.enabled } : flag
      )
    );
  };

  const { selectedPeriod } = useFilterPeriodStore();
  const { data: summary } = useGetSummaryQuery({
    websiteId: credentialId,
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

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  return (
    <WithNewEvents credentialId={credentialId}>
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
          <InteractiveVisitorChart credentialId={credentialId} />
        </div>
      </div>
    </WithNewEvents>
  );
}
