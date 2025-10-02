import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
import { listFeaturesQueryKey } from "./use-list-features-query";
import { addFeatureSchema, Feature } from "./feature.types";

export type AddFeatureParam = z.infer<typeof addFeatureSchema>;

const addFeature = async (input: AddFeatureParam): Promise<Feature> => {
  // Validate input against schema before posting
  addFeatureSchema.parse(input);

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/add-feature`,
    {
      method: "POST",
      body: JSON.stringify(input),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }

  const resp = await res.json();
  return resp as Feature;
};
export const useAddFeatureMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: AddFeatureParam) => {
      return addFeature(input);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [listFeaturesQueryKey, data.websiteId],
      });
    },
  });
};
