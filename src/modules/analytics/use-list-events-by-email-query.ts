/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsEvent, FilterPeriod } from "./analytics.types";

const mockEvent: AnalyticsEvent = {
  id: "01K69R5JH64S3Y6VAN4X61T85H",
  visitor_id: "aecd7b27-cf35-49ac-806b-29f035917dd0",
  session_id: "sd010df84-a221-4d91-ac0e-84bd2c68041c",
  identity_id: "",
  website_id: "01K66XSK34CXMV0TT8ATS953W0",
  type: "pageview",
  event_name: "",
  content_id: "",
  href: "https://www.adaptive.fyi/users/01K66Y71NVHBWVFX8T9HB76WXH",
  domain: "www.adaptive.fyi",
  created_at: "2025-09-29 03:27:26.246",
  email: "learnuidev@gmail.com",
  ip_address: "146.70.186.164",
  country: "US",
  region: "NY",
  city: "New York",
  latitude: 40.7157,
  longitude: -74,
  timezone: "America/New_York",
  os_name: "macOS",
  os_version: "10.15.7",
  browser_name: "Chrome",
  browser_version: "140.0.0.0",
  device_vendor: "Apple",
  device_model: "Macintosh",
  viewport_width: 1680,
  viewport_height: 1050,
  metadata: {},
};
type ListEventsByEmailResponse = AnalyticsEvent[];
async function listEventsByEmail({
  websiteId,
  period,
  email,
}: {
  websiteId: string;
  period: FilterPeriod;
  email: string;
}): Promise<ListEventsByEmailResponse> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-events-by-email`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId, period, email }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const respRaw = (await res.json()) as ListEventsByEmailResponse;

  return respRaw;
}
const listEventsByEmailQueryKey = "list-events-by-email";

export const useListEventsByEmailQuery = ({
  websiteId,
  period,
  email,
}: {
  websiteId: string;
  period: FilterPeriod;
  email: string;
}) => {
  return useQuery({
    queryKey: [listEventsByEmailQueryKey, websiteId, period, email],
    queryFn: async () => {
      const response = await listEventsByEmail({ websiteId, period, email });
      return response;
    },
    // refetchInterval: 5000,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
