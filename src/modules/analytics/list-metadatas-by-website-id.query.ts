/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { MetadataItem } from "./analytics.types";

const sampleMetadatas: MetadataItem[] = [
  { key: "e_key", values: ["trends-feature"] },
  {
    key: "eventName",
    values: ["select-trend-type", "create-new-trend"],
  },
  { key: "featureKey", values: ["trends-feature"] },
  { key: "featurekey", values: ["trends-feature"] },
  { key: "type", values: ["analytics"] },
];

async function listMetadatasByWebsiteId({
  websiteId,
}: {
  websiteId: string;
}): Promise<MetadataItem[]> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-metadatas`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch metadatas");
  }

  return res.json();
}

const listMetadatasByWebsiteIdQueryKey = "list-metadatas-by-website-id";

export const useListMetadatasByWebsiteIdQuery = ({
  websiteId,
}: {
  websiteId: string;
}) => {
  return useQuery<MetadataItem[]>({
    queryKey: [listMetadatasByWebsiteIdQueryKey, websiteId],
    queryFn: () => listMetadatasByWebsiteId({ websiteId }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
