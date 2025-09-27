import { MetricsCard } from "@/components/dashboard/MetricsCard";
import { AnalyticsChart } from "@/components/dashboard/AnalyticsChart";
import { FeatureFlagCard } from "@/components/feature-flags/FeatureFlagCard";
import {
  Users,
  Eye,
  Clock,
  TrendingUp,
  MousePointer,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useParams } from "@tanstack/react-router";
import { useListUserCredentialsQuery } from "@/modules/user-credentials/use-list-user-credentials-query";
import { CredentialSelector } from "@/components/credentials/CredentialSelector";
import { NoCredentialsMessage } from "@/components/credentials/NoCredentialsMessage";

// Mock data
const metricsData = [
  {
    title: "Total Visitors",
    value: "24,583",
    change: "+12.5% from last week",
    changeType: "positive" as const,
    icon: Users,
    trend: [20, 35, 25, 45, 30, 55, 40],
  },
  {
    title: "Page Views",
    value: "156,234",
    change: "+8.2% from last week",
    changeType: "positive" as const,
    icon: Eye,
    trend: [40, 35, 50, 45, 60, 55, 65],
  },
  {
    title: "Avg Session",
    value: "4m 32s",
    change: "-2.1% from last week",
    changeType: "negative" as const,
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

const chartData = [
  { name: "00:00", value: 120 },
  { name: "04:00", value: 80 },
  { name: "08:00", value: 350 },
  { name: "12:00", value: 480 },
  { name: "16:00", value: 420 },
  { name: "20:00", value: 380 },
  { name: "23:59", value: 180 },
];

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

  // Show credentials selection if no credential ID or credential not found
  if (!credentialId || (credentials && !currentCredential)) {
    return <NoCredentialsMessage />;
  }

  return (
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
            <div className="flex items-center gap-4">
              <CredentialSelector />
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm text-muted-foreground">Live data</span>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <AnalyticsChart
              title="Visitor Traffic"
              data={chartData}
              height={350}
              type="area"
            />
          </div>
          <div>
            <AnalyticsChart
              title="Device Usage"
              data={deviceData}
              height={350}
              color="hsl(220, 70%, 50%)"
              type="line"
            />
          </div>
        </div>

        {/* Top Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass p-6 rounded-lg border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-soft rounded-lg">
                <MousePointer className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Top Pages</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  /dashboard
                </span>
                <span className="font-medium text-foreground">45.2k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  /analytics
                </span>
                <span className="font-medium text-foreground">32.1k</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">/users</span>
                <span className="font-medium text-foreground">28.9k</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-soft rounded-lg">
                <Smartphone className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Devices</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Desktop</span>
                <span className="font-medium text-foreground">65.4%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Mobile</span>
                <span className="font-medium text-foreground">28.7%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Tablet</span>
                <span className="font-medium text-foreground">5.9%</span>
              </div>
            </div>
          </div>

          <div className="glass p-6 rounded-lg border border-border/50 hover:shadow-medium transition-all duration-300">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary-soft rounded-lg">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Growth</h3>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Week</span>
                <span className="font-medium text-primary">+12.5%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">
                  This Month
                </span>
                <span className="font-medium text-primary">+8.3%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">This Year</span>
                <span className="font-medium text-primary">+24.7%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Flags Section */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Active Feature Flags
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flags.map((flag, index) => (
              <div
                key={flag.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <FeatureFlagCard
                  {...flag}
                  onToggle={() => toggleFlag(flag.id)}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
