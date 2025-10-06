export type AnalyticsEvent = {
  id: string;
  visitor_id: string;
  session_id: string;
  identity_id: string;
  website_id: string;
  // Info for AI agent: ex: lovable
  // custom here is custom event, if the custom event type is custom, check into metada to find out what the custom data is
  type: "pageview" | "payment" | "custom";
  event_name: string;
  content_id: string;
  href: string;
  domain: string;
  created_at: string;
  email: string;
  ip_address: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
  device_vendor: string;
  device_model: string;
  viewport_width: number;
  viewport_height: number;
  metadata: Record<string, string>;
};

export type FilterPeriod =
  | "today"
  | "yesterday"
  | "last24h"
  | "last7d"
  | "last30d"
  | "last12m"
  | "wtd"
  | "mtd"
  | "ytd"
  | "all"
  | "custom";

export type CustomDateRange = {
  startDate: Date | string;
  endDate: Date | string;
};

export const filterPeriods: Record<FilterPeriod, FilterPeriod> = {
  today: "today",
  yesterday: "yesterday",
  last24h: "last24h",
  last7d: "last7d",
  last30d: "last30d",
  last12m: "last12m",
  wtd: "wtd",
  mtd: "mtd",
  ytd: "ytd",
  all: "all",
  custom: "custom",
};

export type MetadataItem = {
  key: string;
  values: string[];
};
