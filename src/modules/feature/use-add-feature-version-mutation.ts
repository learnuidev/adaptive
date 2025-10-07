import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { z } from "zod";
// import { listFeatureVersionsQueryKey } from "./use-list-feature-versions-query";
import { addFeatureVersionSchema, FeatureVersion } from "./feature.types";
import { getFeatureDetailsQueryKey } from "./use-get-feature-details-query";

export type AddFeatureVersionParam = z.infer<typeof addFeatureVersionSchema>;

export interface ClickhouseEvent {
  id: string;
  visitor_id: string;
  session_id: string;
  identity_id: string;
  website_id: string;
  type: string;
  event_name: string;
  content_id: string;
  href: string;
  domain: string;
  created_at: string;
  email: string;
  ip_address: string;
  country: string;
  region: string;
  city: string;
  latitude: number;
  longitude: number;
  timezone: string;
  os_name: string;
  os_version: string;
  browser_name: string;
  browser_version: string;
  device_vendor: string;
  device_model: string;
  viewport_width: number;
  viewport_height: number;
  metadata: Record<string, unknown>; // dynamic keys
}

const sampleRollOutRules = [
  {
    type: "and",
    fields: [
      { field: "event_name", op: "=", value: "page_view" },
      { field: "metadata.landing_page", op: "LIKE", value: "%/checkout%" },
    ],
  },
  {
    type: "or",
    fields: [
      { field: "event_name", op: "=", value: "page_view" },
      { field: "metadata.landing_page", op: "LIKE", value: "%/checkout%" },
    ],
  },
];

const addFeatureVersion = async (
  input: AddFeatureVersionParam
): Promise<FeatureVersion> => {
  // Validate input against schema before posting
  const parseResp = addFeatureVersionSchema.safeParse(input);

  if (!parseResp.success) {
    throw Error(parseResp.error.message);
  }

  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/add-feature-version`,
    {
      method: "POST",
      body: JSON.stringify(parseResp.data),
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
