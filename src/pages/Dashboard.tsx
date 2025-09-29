import { ResponsiveFilters } from "@/components/analytics/ResponsiveFilters";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { InteractiveVisitorChart } from "@/components/dashboard/interactive-visitor-chart/interactive-visitor-chart";
import { WithNewEvents } from "@/components/with-new-events";
import {
  // FilterPeriod,
  useGetSummaryQuery,
  VisitorCount,
} from "@/modules/analytics/use-get-summary-query";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { useFilterPeriodStore } from "@/stores/filter-period-store";
import { useParams } from "@tanstack/react-router";
import { Clock, Eye, TrendingUp, Users } from "lucide-react";
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

  const metricsData = [
    {
      title: "Total Visitors",
      value: summary?.totalVisitors.currentTotal || "0",
      change: summary?.totalVisitors.percentageDifference
        ? `${summary?.totalVisitors.percentageDifference?.toFixed(2)}% from last week`
        : "",
      changeType: "positive" as const,
      icon: Users,
      trend: [20, 35, 25, 45, 30, 55, 40],
    },
    {
      title: "Page Views",
      value: summary?.totalPageVisits.current || "0",
      change: summary?.totalPageVisits.percentageDifference
        ? `${summary?.totalPageVisits.percentageDifference?.toFixed(2)}% from last week`
        : "",
      changeType: "positive" as const,
      icon: Eye,
      trend: [40, 35, 50, 45, 60, 55, 65],
    },
    {
      title: "Avg Session",
      value: summary?.averageSession.current ? formatSessionTime(summary) : "0",
      change: summary?.averageSession.percentageDifference
        ? `${summary?.averageSession.percentageDifference?.toFixed(2)}% from last week`
        : "",
      changeType:
        summary?.averageSession.current - summary?.averageSession?.previous < 0
          ? ("negative" as const)
          : ("positive" as const),
      icon: Clock,
      trend: [60, 55, 50, 45, 50, 40, 35],
    },
    {
      title: "Conversion Rate",
      value: "3.24%",
      change: "+0.8% from last week",
      changeType: "positive" as const,
      icon: TrendingUp,
      trend: [15, 20, 25, 30, 28, 35, 40],
    },
  ];

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  return (
    <WithNewEvents credentialId={credentialId}>
      <div className="min-h-screen bg-background w-full">
        {/* Header */}
        <div className="border-b border-border/50 bg-card/50 backdrop-blur-sm">
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground">
                  Dashboard Overview
                </h1>
                <p className="text-muted-foreground">
                  {currentCredential
                    ? `Analytics for ${currentCredential.title}`
                    : "Welcome back! Here's what's happening with your analytics."}
                </p>
              </div>
              <div className="flex items-center justify-between gap-4">
                <ResponsiveFilters />
                <div className="hidden md:flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">
                    Live data
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Metrics Grid */}
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">
              Key Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metricsData.map((metric, index) => (
                <div
                  key={metric.title}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <MetricsCard {...metric} />
                </div>
              ))}
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 gap-6">
            <AnalyticsChart
              chartKey="visitorTraffic"
              title="Visitors & Page Views"
              colorPalette={"blue"}
              selectedPeriod={selectedPeriod}
              data={combinedChartData}
              height={400}
              type="composed"
              secondaryLabel="Page Views"
            />
          </div>

          {/* Interactive Visitor Analytics */}
          <InteractiveVisitorChart credentialId={credentialId} />
        </div>
      </div>
    </WithNewEvents>
  );
}
