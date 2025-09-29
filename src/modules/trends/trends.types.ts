export type TrendType = "count" | "unique_users" | "avg_per_user";
export type TimeRange = "1d" | "7d" | "30d" | "90d";
export type GroupByTime = "hour" | "day" | "week" | "month";

export interface TrendBuilderForm {
  metadataField: string;
  trendType: TrendType;
  timeRange: TimeRange;
  eventType?: string;
  groupByTime: GroupByTime;
  limit: number;
}

export interface TrendData {
  time_period: string;
  metadata_value: string;
  trend_value: number;
}

export interface TopMetadataTrendData {
  metadata_value: string;
  event_count: number;
  unique_users: number;
}

export interface MetadataValueTrendData {
  time_period: string;
  event_count: number;
  daily_users: number;
}

export interface TrendBuilderState {
  form: TrendBuilderForm;
  results?: TrendData[];
  topTrends?: TopMetadataTrendData[];
  isLoading: boolean;
  error?: string;
}

export const TREND_TYPE_OPTIONS = [
  { value: "count" as const, label: "Total Count", description: "Count of all events" },
  { value: "unique_users" as const, label: "Unique Users", description: "Count of unique visitors" },
  { value: "avg_per_user" as const, label: "Average per User", description: "Average events per user" },
];

export const TIME_RANGE_OPTIONS = [
  { value: "1d" as const, label: "Last 24 Hours" },
  { value: "7d" as const, label: "Last 7 Days" },
  { value: "30d" as const, label: "Last 30 Days" },
  { value: "90d" as const, label: "Last 90 Days" },
];

export const GROUP_BY_TIME_OPTIONS = [
  { value: "hour" as const, label: "Hourly" },
  { value: "day" as const, label: "Daily" },
  { value: "week" as const, label: "Weekly" },
  { value: "month" as const, label: "Monthly" },
];