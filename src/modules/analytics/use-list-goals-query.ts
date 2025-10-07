import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { FilterPeriod } from "./analytics.types";

export type Goal = {
  id: string;
  goalName: string;
  email: string;
  created_at: string;
};

export type ListGoalsResponse = {
  goals: Goal[];
};

const listGoals = async ({
  websiteId,
  period,
  from,
  to,
}: {
  websiteId: string;
  period: FilterPeriod;
  from?: string;
  to?: string;
}) => {
  try {
    const params: Record<string, string | FilterPeriod> = {
      websiteId,
      period,
    };

    if (period === "custom" && from && to) {
      params.from = from;
      params.to = to;
    }

    const response = await fetchWithToken(
      `${appConfig.apiUrl}/v1/analytics/get-summary`,
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    );

    const responseData = await response.json();

    return {
      goals: responseData.goals || [],
    };
  } catch (error) {
    throw Error(`Something went wrong while fetching goals`);
  }
};

const listGoalsQueryKey = "list-goals";

export const useListGoalsQuery = ({
  websiteId,
  period,
  customDateRange,
}: {
  websiteId: string;
  period: FilterPeriod;
  customDateRange?: { from: string; to: string };
}) => {
  return useQuery<ListGoalsResponse>({
    queryKey: [listGoalsQueryKey, websiteId, period, customDateRange],
    queryFn: async () => {
      return listGoals({
        websiteId,
        period,
        from: customDateRange?.from,
        to: customDateRange?.to,
      });
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
