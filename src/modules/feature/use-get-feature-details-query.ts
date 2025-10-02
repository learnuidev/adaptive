import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { Feature } from "./feature.types";

const getFeatureDetails = async (featureId: string): Promise<Feature[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/get-feature-details`,
    {
      method: "POST",
      body: JSON.stringify({ featureId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Feature[];
};

export const listFeaturesQueryKey = "list-features";

export function useGetFeatureDetailsQuery(featureId: string) {
  return useQuery({
    queryKey: [listFeaturesQueryKey, featureId],
    queryFn: () => getFeatureDetails(featureId),
  });
}
