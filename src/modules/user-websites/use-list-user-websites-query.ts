import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useQuery } from "@tanstack/react-query";
import { UserWebsite } from "./user-website.types";

const listUserWebsites = async (): Promise<UserWebsite[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/list-user-websites`,
    {
      method: "POST",

      body: JSON.stringify({}),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
  const resp = await res.json();
  return resp as UserWebsite[];
};

export const listUserWebsitesQueryId = "list-user-websites";
export const useListUserWebsitesQuery = () => {
  return useQuery({
    queryKey: [listUserWebsitesQueryId],
    queryFn: async () => {
      return listUserWebsites();
    },
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
