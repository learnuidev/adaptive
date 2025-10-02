/* eslint-disable @typescript-eslint/no-explicit-any */
import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";

async function listAttributeValuesByAttributeKey({
  websiteId,
  attributeKey,
}: {
  websiteId: string;
  attributeKey: string;
}): Promise<string[]> {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/analytics/list-attribute-values`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId, attributeKey }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch attribute values");
  }

  return res.json();
}

const listAttributeValuesByAttributeKeyQueryKey =
  "list-attribute-values-by-attribute-key";

export const useListAttributeValuesByAttributeKeyQuery = ({
  websiteId,
  attributeKey,
}: {
  websiteId: string;
  attributeKey: string;
}) => {
  return useQuery<string[]>({
    queryKey: [
      listAttributeValuesByAttributeKeyQueryKey,
      websiteId,
      attributeKey,
    ],
    queryFn: () =>
      listAttributeValuesByAttributeKey({ websiteId, attributeKey }),
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
