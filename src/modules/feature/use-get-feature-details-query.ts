import { useQuery } from "@tanstack/react-query";

import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { Feature, FeatureVersion } from "./feature.types";

type FeatureDetails = Feature & {
  versions: FeatureVersion[];
};

const getFeatureDetails = async (
  featureId: string
): Promise<FeatureDetails> => {
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
  return resp;
};

export const getFeatureDetailsQueryKey = "get-feature-details";

export function useGetFeatureDetailsQuery(featureId: string) {
  return useQuery({
    queryKey: [getFeatureDetailsQueryKey, featureId],
    queryFn: () => getFeatureDetails(featureId),
  });
}
