import { appConfig } from "@/lib/app-config";
import { fetchWithToken } from "@/lib/aws-smplify/fetch-with-token";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiKeyWithSecret } from "./api-key.types";
import { listApiKeysQueryId } from "./use-list-api-keys-query";

const createApiKey = async (websiteId: string): Promise<ApiKeyWithSecret> => {
  const res = await fetchWithToken(
    `${appConfig.apiUrl}/v1/create-api-key`,
    {
      method: "POST",
      body: JSON.stringify({ websiteId }),
    }
  );

  if (!res.ok) {
    throw Error(`Something went wrong`);
  }
  
  const resp = await res.json();
  return resp as ApiKeyWithSecret;
};

export const useCreateApiKeyMutation = (websiteId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return createApiKey(websiteId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: [listApiKeysQueryId, websiteId] 
      });
    },
  });
};
