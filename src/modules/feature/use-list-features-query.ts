import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { Feature } from "./feature.types";

const listFeatures = async (websiteId: string): Promise<Feature[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-features`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Feature[];
};

export const listFeaturesQueryKey = "list-features";

export function useListFeaturesQuery(websiteId: string) {
  return useQuery({
    queryKey: [listFeaturesQueryKey, websiteId],
    queryFn: () => listFeatures(websiteId),
  });
}
