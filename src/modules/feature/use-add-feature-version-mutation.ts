import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
// import { listFeatureVersionsQueryKey } from "./use-list-feature-versions-query";
import { addFeatureVersionSchema, FeatureVersion } from "./feature.types";
import { getFeatureDetailsQueryKey } from "./use-get-feature-details-query";

export type AddFeatureVersionParam = z.infer<typeof addFeatureVersionSchema>;

const addFeatureVersion = async (
  input: AddFeatureVersionParam
): Promise<FeatureVersion> => {
  // Validate input against schema before posting
  addFeatureVersionSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/add-feature-version`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as FeatureVersion;
};

export const useAddFeatureVersionMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddFeatureVersionParam) => {
      return addFeatureVersion(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [getFeatureDetailsQueryKey, data.featureId],
      });
    },
  });
};
