import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { AnalyticsEvent } from "./analytics.types";

export type JourneyStep = {
  event_name: string;
  page_url?: string;
  timestamp: string;
  properties?: Record<string, unknown>;
};

export type ListJourneysRequest = {
  websiteId: string;
  eventId: string;
  goalName?: string;
  selectedKeys?: string[];
};

export type ListJourneysResponse = {
  journeys: AnalyticsEvent[];
  total: number;
};

const listJourneys = async (params: ListJourneysRequest) => {
  try {
    const response = await fetchWithToken(
      `${appConfig.apiUrl}/v1/analytics/list-journeys`,
      {
        method: "POST",
        body: JSON.stringify(params),
      }
    );

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "Failed to fetch journeys");
    }

    console.log("response data", responseData);

    return {
      journeys: responseData || [],
      total: responseData?.length || 0,
    };
  } catch (error) {
    throw Error(
      `Something went wrong while fetching journeys: ${error.message}`
    );
  }
};

const listJourneysQueryKey = "list-journeys";

export const useListJourneysQuery = (params: ListJourneysRequest) => {
  return useQuery<ListJourneysResponse>({
    queryKey: [listJourneysQueryKey, params],
    queryFn: () => listJourneys(params),
    enabled: !!params.websiteId && !!params.eventId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
