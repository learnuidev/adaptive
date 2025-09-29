/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsEvent, FilterPeriod } from "./analytics.types";

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
