/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";

type UserDevice = {
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
  device_vendor: string;
  device_model: string;
  percentageUsed: number;
};

type UserBasicInformation = {
  location: string;
  lastSeen: string;
  firstVisit: string;
  totalPageViews: number;
  totalSessions: number;
  averageDuration: number;
  status: string;
};

type UserInfoResponse = {
  basicInformation: UserBasicInformation;
  devicesUsed: UserDevice[];
};

const sampleResponse: UserInfoResponse = {
  basicInformation: {
    location: "New York, NY, US",
    lastSeen: "2025-09-29 01:41:43.462",
    firstVisit: "2025-09-28 01:22:45.241",
    totalPageViews: 138,
    totalSessions: 11,
    averageDuration: 0,
    status: "active",
  },
  devicesUsed: [
    {
      os_name: "macOS",
      os_version: "10.15.7",
      browser_name: "Chrome",
      browser_version: "140.0.0.0",
      device_vendor: "Apple",
      device_model: "Macintosh",
      percentageUsed: 25.36,
    },
    {
      os_name: "iOS",
      os_version: "18.6.2",
      browser_name: "Mobile Safari",
      browser_version: "18.6",
      device_vendor: "Apple",
      device_model: "iPhone",
      percentageUsed: 74.64,
    },
  ],
};

async function getUserInfo({
  websiteId,

  email,
}: {
  websiteId: string;
  email: string;
}): Promise<UserInfoResponse> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/get-user-info`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId, email }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const respRaw = (await res.json()) as UserInfoResponse;

  return respRaw;
}
const getUserInfoQueryKey = "get-user-info";

export const useGetUserInfoQuery = ({
  websiteId,
  email,
}: {
  websiteId: string;
  email: string;
}) => {
  return useQuery({
    queryKey: [getUserInfoQueryKey, websiteId, email],
    queryFn: async () => {
      const response = await getUserInfo({ websiteId, email });
      return response;
    },
    // refetchInterval: 5000,

    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
