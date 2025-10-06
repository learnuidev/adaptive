import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";

export type LiveUser = {
  visitor_id: string;
  last_seen: string;
  email?: string;
  country?: string;
  region?: string;
  city?: string;
  latitude?: number;
  longitude?: number;
  page?: string;
  duration?: number;
};

export type LiveUserSummary = {
  totalUsers: number;
  avgSessionDuration: number;
  topPages: Array<{
    page: string;
    users: number;
  }>;
  topCountries: Array<{
    country: string;
    users: number;
  }>;
};

export type GetLiveUsersResponse = {
  liveUsers: LiveUser[];
  metadata: {
    websiteId: string;
    timeWindowMinutes: number;
    totalLiveUsers: number;
    returnedUsers: number;
    lastUpdated: string;
    timezone: string;
  };
  summary?: LiveUserSummary;
  geography?: Array<{
    country: string;
    region: string;
    city: string;
    users: number;
  }>;
};

async function getLiveUsers({
  websiteId,
  timeWindowMinutes = 30,
  includeSummary = true,
  includeGeography = false,
  limit = 100,
}: {
  websiteId: string;
  timeWindowMinutes?: number;
  includeSummary?: boolean;
  includeGeography?: boolean;
  limit?: number;
}): Promise<GetLiveUsersResponse> {
  const requestBody = {
    websiteId,
    timeWindowMinutes,
    includeSummary,
    includeGeography,
    limit,
  };

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/get-live-users`,
    {
      method: "POST",
      body: JSON.stringify(requestBody),
    }
  );

  if (!res.ok) {
    throw Error(`Failed to fetch live users: ${res.statusText}`);
  }

  return res.json();
}

const getLiveUsersQueryKey = "get-live-users";

export const useGetLiveUsersQuery = ({
  websiteId,
  timeWindowMinutes = 30,
  includeSummary = true,
  includeGeography = false,
  limit = 100,
  enabled = true,
}: {
  websiteId: string;
  timeWindowMinutes?: number;
  includeSummary?: boolean;
  includeGeography?: boolean;
  limit?: number;
  enabled?: boolean;
}) => {
  return useQuery<GetLiveUsersResponse>({
    queryKey: [
      getLiveUsersQueryKey,
      websiteId,
      timeWindowMinutes,
      includeSummary,
      includeGeography,
      limit,
    ],
    queryFn: async () => {
      const response = await getLiveUsers({
        websiteId,
        timeWindowMinutes,
        includeSummary,
        includeGeography,
        limit,
      });
      return response;
    },
    refetchInterval: 30000, // Refresh every 30 seconds for live data
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
    refetchIntervalInBackground: false,
    enabled: enabled && !!websiteId,
  });
};
