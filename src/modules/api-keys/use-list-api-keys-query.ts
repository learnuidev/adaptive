import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useQuery } from "@tanstack/react-query";
import { ApiKey } from "./api-key.types";

const listApiKeys = async (websiteId: string): Promise<ApiKey[]> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/list-api-keys`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
  
  const resp = await res.json();
  return resp.apiKeys as ApiKey[];
};

export const listApiKeysQueryId = "list-api-keys";
export const useListApiKeysQuery = (websiteId: string) => {
  return useQuery({
    queryKey: [listApiKeysQueryId, websiteId],
    queryFn: async () => {
      return listApiKeys(websiteId);
    },
    enabled: !!websiteId,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    refetchIntervalInBackground: false,
  });
};
