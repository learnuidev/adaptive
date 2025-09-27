import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";

interface HasUserEventsResponse {
  hasUserEvents: boolean;
}

async function fetchHasUserEvents(
  websiteId: string
): Promise<HasUserEventsResponse> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/has-user-events`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as HasUserEventsResponse;
}
const hasUserEventsQueryKey = "has-user-events";
export const useHasUserEventsQuery = (websiteId: string) => {
  return useQuery<HasUserEventsResponse>({
    queryKey: [hasUserEventsQueryKey, websiteId],
    queryFn: async () => {
      const response = await fetchHasUserEvents(websiteId);
      return response;
    },
    refetchInterval: (data) => {
      return data?.state?.data?.hasUserEvents === false ? 4000 : false;
    },
  });
};
