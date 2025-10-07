import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { FilterPeriod } from "./analytics.types";

export type GetTotalVisitorsByResponse = { name: string; visitors: string }[];

export interface GetTotalVisitorsByParams {
  websiteId: string;
  period: FilterPeriod;
  from?: Date;
  to?: Date;
  groupBy:
    | "country"
    | "region"
    | "city"
    | "browser_name"
    | "os_name"
    | "device";
}

async function getTotalVisitorsBy({
  websiteId,
  period,
  groupBy,
  from,
  to,
}: GetTotalVisitorsByParams): Promise<GetTotalVisitorsByResponse> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/get-total-visitors-by`,
    {
      method: "POST",
      body: JSON.stringify({ groupBy, from, to, websiteId, period }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const respRaw = (await res.json()) as GetTotalVisitorsByResponse;

  return respRaw;
}
const getSummaryQueryKey = "get-summary";

export type LocationView = "map" | "country" | "region" | "city";

export const useGetTotalVisitorsByQuery = ({
  websiteId,
  period,
  groupBy,
}: GetTotalVisitorsByParams) => {
  return useQuery({
    queryKey: [getSummaryQueryKey, websiteId, period, groupBy],
    queryFn: async () => {
      const response = await getTotalVisitorsBy({
        websiteId,
        period,
        groupBy,
      });
      return response;
    },
    // refetchInterval: 5000,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
